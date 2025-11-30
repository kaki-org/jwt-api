<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="12">
        <v-card-title class="justify-center">
          {{ error.statusCode }}
        </v-card-title>
        <v-card-text class="text-center">
          {{ errorMessage }}
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-icon> mdi-emoticon-sick-outline </v-icon>
        </v-card-actions>
        <v-card-actions class="justify-center">
          <v-btn
            icon
            x-large
            color="appblue"
            @click="redirect"
          >
            <v-icon> mdi-home </v-icon>
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Nuxt 4.x対応のエラーレイアウト
// 型安全性とパフォーマンスを向上させた実装

interface ErrorProps {
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
    data?: unknown
    response?: {
      statusText?: string
    }
  }
}

const props = withDefaults(defineProps<ErrorProps>(), {
  error: () => ({
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    message: 'An error occurred',
  }),
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()
const { t, te } = useI18n()

// ログイン前後でリダイレクトパスを切り替える
const redirectPath = computed(() => {
  const loggedInHomePath = appStore.loggedIn.homePath
  const beforeLoginHomePath = { name: 'index' }
  return authStore.loggedIn ? loggedInHomePath : beforeLoginHomePath
})

// $fetchエラーの場合のメッセージを取得
const responsedMessage = computed(() => {
  // $fetchエラーの場合
  if (props.error.statusMessage) {
    return props.error.statusMessage
  }
  // デフォルトメッセージ
  return props.error.message || 'An error occurred'
})

// i18nに翻訳パスが存在する場合は日本語翻訳メッセージを返す
const errorMessage = computed(() => {
  const translationPath = `error.${responsedMessage.value}`
  return te(translationPath) ? t(translationPath) : responsedMessage.value
})

// 認証エラーの場合は認証状態を初期化する
onMounted(async () => {
  if (props.error.statusCode === 401) {
    await authStore.resetAuth()
  }
})

// リダイレクトパスが現在のルートと一致している場合はリロードを行う
const redirect = () => {
  if (redirectPath.value.name === route.name) {
    router.go(0)
  } else {
    router.push(redirectPath.value)
  }
}
</script>
