<template>
  <v-card
    width="100%"
  >
    <v-responsive :aspect-ratio="1">
      <v-container class="pa-2 ma-0 d-flex justify-center align-center fill-height">
        <v-img
          v-if="done"
          src="@/assets/logo.png"
        />

        <v-progress-circular
          v-else
          indeterminate="true"
        />
      </v-container>
    </v-responsive>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from '@vue/runtime-core'

const done = ref(false)

onMounted(async() => {
  await new Promise(resolve => { setTimeout(resolve, Math.random() * 3000) })
  done.value = true
})
</script>
