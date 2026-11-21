#!/usr/bin/env bash
# openapi.yaml の info.version を、base との差分から semver で自動 bump する。
#
# 使い方: openapi-version-bump.sh <base-spec-file> <spec-file> [override-level]
#   override-level: major | minor | patch（指定時は差分判定より優先）
#
# 判定:
#   major … oasdiff changelog に WARN/ERR（level >= 2）がある
#   minor … api-version-changed 以外の INFO（level 1）がある
#   patch … 上記以外で、info.version を除いた差分がある（説明文・example など）
#   none  … 差分なし
#
# info.version は常に「base を判定レベルで上げた値」に揃える（手で書いた値も上書きする）。
#
# 出力（GITHUB_OUTPUT があれば追記）: level / base_version / target_version / current_version / changed
set -euo pipefail

base_spec="$1"
spec="$2"
override="${3:-}"
oasdiff="${OASDIFF:-oasdiff}"

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
  esac
}

base_version="$(read_version "$base_spec")"
current_version="$(read_version "$spec")"
[[ -n "$base_version" && -n "$current_version" ]] || { echo "info.version を読み取れません" >&2; exit 1; }

# 差分判定
changes="$("$oasdiff" changelog --format json "$base_spec" "$spec")"
if jq -e 'any(.[]; .level >= 2)' >/dev/null <<<"$changes"; then
  level="major"
elif jq -e 'any(.[]; .level == 1 and .id != "api-version-changed")' >/dev/null <<<"$changes"; then
  level="minor"
else
  normalized="$(mktemp "${TMPDIR:-/tmp}/openapi-version.XXXXXX")"
  trap 'rm -f "$normalized"' EXIT
  cp "$spec" "$normalized"
  write_version "$normalized" "$base_version"
  # --fail-on-diff: 0 = 差分なし、1 = 差分あり、それ以外 = エラー
  diff_rc=0
  "$oasdiff" diff --fail-on-diff "$base_spec" "$normalized" >/dev/null || diff_rc=$?
  case "$diff_rc" in
    0) level="none" ;;
    1) level="patch" ;;
    *) echo "oasdiff diff が失敗しました（exit ${diff_rc}）" >&2; exit 1 ;;
  esac
fi

if [[ -n "$override" ]]; then
  case "$override" in
    major | minor | patch) level="$override" ;;
    *) echo "不正な override-level です: $override" >&2; exit 1 ;;
  esac
fi

target_version="$(bump "$base_version" "$level")"

# 常に判定どおりの値に揃える（上げすぎた値も戻す）。多めに上げたい場合はラベルで上書きする。
# 現在値が target と同じなら何もしないので、bot の push で再実行されてもループしない。
changed=false
if [[ "$current_version" != "$target_version" ]]; then
  write_version "$spec" "$target_version"
  changed=true
fi

result="level=${level}
base_version=${base_version}
target_version=${target_version}
current_version=${current_version}
changed=${changed}"
echo "$result"
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "$result" >> "$GITHUB_OUTPUT"
fi
