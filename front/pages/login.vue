<template>
  <user-form-card>
    <template #user-form-card-content>
      <v-form
        ref="form"
        v-model="isValid"
        aria-label="ログインフォーム"
        @submit.prevent="login"
      >
        <user-form-email v-model:email="params.auth.email" />
        <user-form-password v-model:password="params.auth.password" />
        <v-card-actions>
          <!-- パスワードリセット機能は未実装。実装までは操作不可として明示する -->
          <span
            class="body-2 text-medium-emphasis"
            aria-disabled="true"
            title="準備中の機能です"
          >
            パスワードを忘れた？
          </span>
        </v-card-actions>
        <v-card-text class="px-0">
          <v-btn
            type="submit"
            :disabled="!isValid || loading"
            :loading="loading"
            block
            color="appblue"
            class="white--text"
          >
            ログインする
          </v-btn>
        </v-card-text>
      </v-form>
    </template>
  </user-form-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '~/stores/app'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'

definePageMeta({
  layout: 'before-login',
})

const authStore = useAuthStore()
const appStore = useAppStore()
const toastStore = useToastStore()
const router = useRouter()

const isValid = ref(false)
const loading = ref(false)
const params = ref({ auth: { email: '', password: '' } })

const redirectPath = computed(() => appStore.rememberPath)
const loggedInHomePath = computed(() => appStore.homePathName)

const login = async () => {
  loading.value = true
  if (isValid.value) {
    try {
      await authStore.login(params.value.auth)
      authSuccessful()
    } catch (error) {
      authFailure(error)
    }
  }
  loading.value = false
}

const authSuccessful = () => {
  router.push(redirectPath.value)
  // 記憶ルートを初期値に戻す
  appStore.setRememberPath({ name: loggedInHomePath.value })
}

const authFailure = (error: any) => {
  if (error?.response?.status === 404) {
    const msg = 'ユーザーが見つかりません😢'
    console.log(msg, 'error')
    return toastStore.showError(msg, 8000)
  }
  // TODO エラー処理
  console.error('Login error:', error)
  toastStore.showError('ログインに失敗しました', 8000)
}
</script>
