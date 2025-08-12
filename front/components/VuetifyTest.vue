<!--
  Vuetify設定テスト用コンポーネント
  Nuxt 4.x対応のVuetify動作確認用
-->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Vuetify 3.x テスト</h1>

        <!-- テーマ切り替えボタン -->
        <v-card class="mb-4">
          <v-card-title>テーマ切り替え</v-card-title>
          <v-card-text>
            <v-btn-toggle v-model="selectedTheme" mandatory>
              <v-btn value="light" @click="switchToLight">
                <v-icon>mdi-white-balance-sunny</v-icon>
                ライト
              </v-btn>
              <v-btn value="dark" @click="switchToDark">
                <v-icon>mdi-moon-waning-crescent</v-icon>
                ダーク
              </v-btn>
              <v-btn value="auto" @click="switchToAuto">
                <v-icon>mdi-theme-light-dark</v-icon>
                自動
              </v-btn>
            </v-btn-toggle>
          </v-card-text>
        </v-card>

        <!-- カラーパレット -->
        <v-card class="mb-4">
          <v-card-title>カラーパレット</v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="color in colorVariants" :key="color" cols="6" sm="4" md="3">
                <v-chip :color="color" class="ma-1">
                  {{ color }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ボタンバリエーション -->
        <v-card class="mb-4">
          <v-card-title>ボタンバリエーション</v-card-title>
          <v-card-text>
            <div class="mb-2">
              <v-btn v-for="variant in buttonVariants" :key="variant" :variant="variant" class="ma-1">
                {{ variant }}
              </v-btn>
            </div>
            <div class="mb-2">
              <v-btn v-for="size in buttonSizes" :key="size" :size="size" class="ma-1">
                {{ size }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- フォームコンポーネント -->
        <v-card class="mb-4">
          <v-card-title>フォームコンポーネント</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="textValue"
                  label="テキストフィールド"
                  placeholder="テキストを入力してください"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectValue"
                  :items="selectItems"
                  label="セレクト"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="textareaValue"
                  label="テキストエリア"
                  placeholder="複数行のテキストを入力してください"
                  rows="3"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-checkbox
                  v-model="checkboxValue"
                  label="チェックボックス"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-switch
                  v-model="switchValue"
                  label="スイッチ"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-slider
                  v-model="sliderValue"
                  label="スライダー"
                  :min="0"
                  :max="100"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- レスポンシブテスト -->
        <v-card class="mb-4">
          <v-card-title>レスポンシブテスト</v-card-title>
          <v-card-text>
            <p>現在のブレークポイント: {{ currentBreakpoint }}</p>
            <p>モバイル: {{ isMobile ? 'はい' : 'いいえ' }}</p>
            <p>タブレット: {{ isTablet ? 'はい' : 'いいえ' }}</p>
            <p>デスクトップ: {{ isDesktop ? 'はい' : 'いいえ' }}</p>

            <div class="d-flex flex-wrap">
              <v-chip class="ma-1 d-mobile-and-down-none">モバイル以外で表示</v-chip>
              <v-chip class="ma-1 d-ipad-and-up-none">タブレット未満で表示</v-chip>
              <v-chip class="ma-1 d-md-and-up-none">中画面未満で表示</v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- アイコンテスト -->
        <v-card class="mb-4">
          <v-card-title>アイコンテスト</v-card-title>
          <v-card-text>
            <div class="d-flex flex-wrap">
              <v-icon v-for="icon in testIcons" :key="icon" class="ma-2" size="large">
                {{ icon }}
              </v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { ColorVariant, VuetifySize, VuetifyVariant } from '~/types/vuetify'

// Vuetifyテーマ管理
const {
  currentTheme,
  isDark,
  isMobile,
  isTablet,
  isDesktop,
  switchToDark,
  switchToLight,
  switchToAuto
} = useVuetifyTheme()

// リアクティブデータ
const selectedTheme = ref(currentTheme.value)
const textValue = ref('')
const selectValue = ref('')
const textareaValue = ref('')
const checkboxValue = ref(false)
const switchValue = ref(false)
const sliderValue = ref(50)

// 定数
const colorVariants: ColorVariant[] = [
  'primary', 'secondary', 'accent', 'error',
  'info', 'success', 'warning', 'appblue'
]

const buttonVariants: VuetifyVariant[] = [
  'flat', 'elevated', 'tonal', 'outlined', 'text', 'plain'
]

const buttonSizes: VuetifySize[] = [
  'x-small', 'small', 'default', 'large', 'x-large'
]

const selectItems = [
  { title: 'オプション1', value: 'option1' },
  { title: 'オプション2', value: 'option2' },
  { title: 'オプション3', value: 'option3' },
]

const testIcons = [
  'mdi-home', 'mdi-account', 'mdi-settings', 'mdi-heart',
  'mdi-star', 'mdi-bookmark', 'mdi-share', 'mdi-download'
]

// 計算プロパティ
const currentBreakpoint = computed(() => {
  if (isMobile.value) return 'mobile'
  if (isTablet.value) return 'tablet'
  if (isDesktop.value) return 'desktop'
  return 'unknown'
})

// テーマ変更の監視
watch(currentTheme, (newTheme) => {
  selectedTheme.value = newTheme
})
</script>

<style scoped>
/* カスタムスタイル */
.v-chip {
  font-weight: 500;
}

.v-card-title {
  font-weight: 600;
}
</style>
