#!/usr/bin/env bash
# openapi.yaml の info.version を semver で扱うためのスクリプト。
#
# 使い方:
#   openapi-version-bump.sh judge <base-spec> <rev-spec>
#     base と rev の差分から bump レベルを判定し、none / patch / minor / major のいずれかを出力する
#   openapi-version-bump.sh version <spec>
#     info.version を出力する
#   openapi-version-bump.sh apply <spec> <level>
#     info.version を level で上げて書き込み、新しい version を出力する
#
# judge の判定:
#   major … oasdiff changelog に WARN/ERR（level >= 2）がある
#   minor … api-version-changed 以外の INFO（level 1）がある
#   patch … 上記以外で、info.version を除いた差分がある（説明文・example など）
#   none  … 差分なし
set -euo pipefail

oasdiff="${OASDIFF:-oasdiff}"

usage() {
  echo "usage: $0 judge <base-spec> <rev-spec> | version <spec> | apply <spec> <level>" >&2
  exit 2
}

# info ブロック直下の version 値を取り出す
read_version() {
  awk '
    /^info:[[:space:]]*$/ { in_info = 1; next }
    in_info && /^[^[:space:]#]/ { exit }
    in_info && /^  version:[[:space:]]*/ {
      sub(/^  version:[[:space:]]*/, ""); sub(/[[:space:]]+#.*$/, ""); gsub(/["'\''[:space:]]/, ""); print; exit
    }
  ' "$1"
}

# info ブロック直下の version 行だけを書き換える
write_version() {
  local file="$1" version="$2" tmp
  tmp="$(mktemp "${TMPDIR:-/tmp}/openapi-version.XXXXXX")"
  awk -v v="$version" '
    /^info:[[:space:]]*$/ { in_info = 1; print; next }
    in_info && /^[^[:space:]#]/ { in_info = 0 }
    in_info && !done && /^  version:[[:space:]]*/ { print "  version: " v; done = 1; next }
    { print }
  ' "$file" > "$tmp"
  cat "$tmp" > "$file"
  rm -f "$tmp"
}

semver_re='^([0-9]+)\.([0-9]+)\.([0-9]+)$'

bump() {
  local version="$1" level="$2"
  [[ "$version" =~ $semver_re ]] || { echo "semver ではないバージョンです: $version" >&2; exit 1; }
  local ma="${BASH_REMATCH[1]}" mi="${BASH_REMATCH[2]}" pa="${BASH_REMATCH[3]}"
  case "$level" in
    major) echo "$((ma + 1)).0.0" ;;
    minor) echo "${ma}.$((mi + 1)).0" ;;
    patch) echo "${ma}.${mi}.$((pa + 1))" ;;
    none) echo "$version" ;;
    *) echo "不正な level です: $level" >&2; exit 1 ;;
  esac
}

require_version() {
  local version
  version="$(read_version "$1")"
  [[ -n "$version" ]] || { echo "info.version を読み取れません: $1" >&2; exit 1; }
  echo "$version"
}

judge() {
  local base_spec="$1" spec="$2" changes base_version normalized diff_rc
  base_version="$(require_version "$base_spec")"
  require_version "$spec" >/dev/null

  changes="$("$oasdiff" changelog --format json "$base_spec" "$spec")"
  if jq -e 'any(.[]; .level >= 2)' >/dev/null <<<"$changes"; then
    echo "major"
    return
  fi
  if jq -e 'any(.[]; .level == 1 and .id != "api-version-changed")' >/dev/null <<<"$changes"; then
    echo "minor"
    return
  fi

  # info.version だけの変更は差分に数えないよう、version を base に揃えたコピーと比べる
  normalized="$(mktemp "${TMPDIR:-/tmp}/openapi-version.XXXXXX")"
  cp "$spec" "$normalized"
  write_version "$normalized" "$base_version"
  # --fail-on-diff: 0 = 差分なし、1 = 差分あり、それ以外 = エラー
  diff_rc=0
  "$oasdiff" diff --fail-on-diff "$base_spec" "$normalized" >/dev/null || diff_rc=$?
  rm -f "$normalized"
  case "$diff_rc" in
    0) echo "none" ;;
    1) echo "patch" ;;
    *) echo "oasdiff diff が失敗しました（exit ${diff_rc}）" >&2; exit 1 ;;
  esac
}

apply() {
  local spec="$1" level="$2" current next
  current="$(require_version "$spec")"
  next="$(bump "$current" "$level")"
  if [[ "$next" != "$current" ]]; then
    write_version "$spec" "$next"
  fi
  echo "$next"
}

case "${1:-}" in
  judge) [[ $# -eq 3 ]] || usage; judge "$2" "$3" ;;
  version) [[ $# -eq 2 ]] || usage; require_version "$2" ;;
  apply) [[ $# -eq 3 ]] || usage; apply "$2" "$3" ;;
  *) usage ;;
esac
