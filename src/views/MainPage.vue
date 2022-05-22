<template>
  <v-container class="px-2 px-lg-16 py-3">
    <v-card
      :density="compactIfMobile"
      class="px-2 px-lg-16"
    >
      <v-card-title class="justify-center">
        Some Lighthouse displays
      </v-card-title>
      <v-container>
        <v-row>
          <v-col
            v-if="isMobile"
            cols="12"
          >
            <v-pagination
              v-model="pageNumber"
              rounded="circle"
              :density="compactIfMobile"
              :length="Math.ceil(displays.length / perPage)"
            />
          </v-col>
          <v-col
            cols="12"
            md="9"
          >
            <v-card
              :density="compactIfMobile"
              title="FILTERS GO HERE"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-select
              v-model="perPage"
              label="Displays per page"
              :items="[1,2,4,6,8,12,24,48]"
              outlined
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-for="d in currentPageDisplays"
            :key="d"
            cols="6"
            md="4"
            lg="3"
            xl="2"
          >
            <v-lazy>
              <lighthouse-display
                :user="d.display"
              />
            </v-lazy>
          </v-col>
        </v-row>
        <v-pagination
          v-model="pageNumber"
          rounded="circle"
          :density="compactIfMobile"
          :length="Math.ceil(displays.length / perPage)"
        />
      </v-container>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import LighthouseDisplay from '@/components/LighthouseDisplayCard.vue'
import { ref, computed, watch } from '@vue/runtime-core'

import mobile from '@/composables/mobile.vue'

const hardcoded = { users: [].concat(...new Array(12).fill(['LoooooongUsername', 'Gluedemann2', 'GLuedemann', 'Uhr', 'Nico'])) }
const displays = ref(hardcoded.users.map((d) => {
  return {
    display: d,
    lastUpdate: ''
  }
}))
const { isMobile, compactIfMobile } = mobile()

// this would be cool if there was a metadata endpoint that returned the time of the last update
// the current implementation does not work with pagination, though

// const triggerReorder = rateLimit(reorder, 2000)

// function rateLimit(f: (...args: any) => any, wait: number) {
//   let lastInvocation = new Date().getTime()
//   return (...args) => {
//     const now = new Date().getTime()
//     if (now - lastInvocation > wait) {
//       lastInvocation = now
//       f(...args)
//     }
//   }
// }

// function updateLastUpdate(d: {lastUpdate: string}) {
//   const now = new Date()
//   now.setMilliseconds(0)
//   d.lastUpdate = now.toISOString()
// }

// function reorder() {
//   displays.value.sort((a, b) => a.lastUpdate < b.lastUpdate ? 1 : -1)
// }

const perPage = ref(isMobile.value ? 4 : 12)
const pageNumber = ref(1)

const currentPageDisplays = computed(() => {
  return displays.value.slice(perPage.value * (pageNumber.value - 1), perPage.value * pageNumber.value)
})

watch(perPage, () => {
  pageNumber.value = 1
})

watch(pageNumber, () => { window.scrollTo(0, 0) })

</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}
</style>
