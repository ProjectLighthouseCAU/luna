<template>
  <v-dialog
    v-model="dialog"
    max-width="100vw"
    max-height="100vh"
    @click="goBack"
  >
    <lighthouse-display-big :user="route.params.id" />
  </v-dialog>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import LighthouseDisplayBig from '@/components/LighthouseDisplayBig.vue'

const dialog = true

const route = useRoute()
const router = useRouter()

function goBack() {
  router.push('/')
}

</script>

<style lang="scss" scoped>
canvas {
  height: 100vmin;
  max-height: 90vh;
  max-width: 100vw;
  image-rendering: crisp-edges;
  aspect-ratio: 0.865;
  border-radius: 2ch;
}
</style>
