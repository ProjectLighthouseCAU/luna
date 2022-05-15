<template>
  <v-card>
    <v-app-bar>
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
        class="mdi-spin"
        @click="darkModeButtonClick"
      />
    </v-app-bar>
  </v-card>
</template>

<script setup lang='ts'>
import { defineEmits } from 'vue'

const emit = defineEmits(['navButtonClick', 'darkModeButtonClick'])

function navButtonClick() {
  emit('navButtonClick')
}

function darkModeButtonClick() {
  emit('darkModeButtonClick')
}

</script>
