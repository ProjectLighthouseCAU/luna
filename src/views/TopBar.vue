<template>
  <v-app-bar
    :density="compactIfMobile"
    class="overflow-x-auto"
  >
    <template #prepend>
      <v-spacer />
      <v-app-bar-nav-icon
        icon=""
        @click="navButtonClick"
      >
        <v-img
          src="@/assets/logo.svg"
          height="32px"
        />
      </v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>
      Lighthouse
    </v-app-bar-title>
    <v-spacer />
    <v-app-bar-nav-icon
      icon="mdi-theme-light-dark"
      @click="darkModeButtonClick"
    />
  </v-app-bar>
</template>

<script setup lang='ts'>
import { defineEmits } from 'vue'
import mobile from '@/composables/mobile.vue'
const { compactIfMobile } = mobile()
const emit = defineEmits(['navButtonClick', 'darkModeButtonClick'])

function navButtonClick() {
  emit('navButtonClick')
}

function darkModeButtonClick() {
  emit('darkModeButtonClick')
}

</script>
