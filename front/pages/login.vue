<template>
  <user-form-card>
    <template #user-form-card-content>
      <v-form
        ref="form"
        v-model="isValid"
        @submit.prevent="login"
      >
        <user-form-email
          :email.sync="params.auth.email"
        />
        <user-form-password
          :password.sync="params.auth.password"
        />
        <v-card-actions>
          <nuxt-link
            to="#"
            class="body-2 text-decoration-none"
          >
            パスワードを忘れた？
          </nuxt-link>
        </v-card-actions>
        <v-card-text
          class="px-0"
        >
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
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAppStore } from '~/stores/app'
import { useToastStore } from '~/stores/toast'

definePageMeta({
  layout: 'before-login'
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
