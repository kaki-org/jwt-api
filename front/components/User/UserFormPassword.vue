<template>
  <v-text-field
    id="password"
    v-model="setPassword"
    :rules="form.rules"
    :hint="form.hint"
    label="パスワードを入力"
    :placeholder="form.placeholder"
    :hide-details="!setValidation"
    :counter="setValidation"
    :type="toggle.type"
    outlined
    autocomplete="on"
  >
    <template #append>
      <v-icon
        role="button"
        tabindex="0"
        :aria-label="toggle.ariaLabel"
        :aria-pressed="show"
        @click="show = !show"
        @keydown.enter="show = !show"
        @keydown.space.prevent="show = !show"
      >
        {{ toggle.icon }}
      </v-icon>
    </template>
  </v-text-field>
</template>

<script>
export default {
  props: {
    password: {
      type: String,
      default: '',
    },
    setValidation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    setPassword: {
      get() {
        return this.password
      },
      set(newValue) {
        return this.$emit('update:password', newValue)
      },
    },
    form() {
      const min = '8文字以上'
      const msg = `${min}。半角英数字・ハイフン・アンダーバーが使えます`
      // ログインページ=入力必須
      // 会員登録ページ=入力必須、8文字以上、72文字以下、書式チェック
      const required = (v) => !!v || ''
      const format = (v) => /^[\w-]{8,72}$/.test(v) || msg

      const rules = this.setValidation ? [format] : [required]
      const hint = this.setValidsation ? msg : undefined
      const placeholder = this.setValidation ? min : undefined
      return { rules, hint, placeholder }
    },
    toggle() {
      const icon = this.show ? 'mdi-eye' : 'mdi-eye-off'
      const type = this.show ? 'text' : 'password'
      const ariaLabel = this.show ? 'パスワードを隠す' : 'パスワードを表示'
      return { icon, type, ariaLabel }
    },
  },
}
</script>
