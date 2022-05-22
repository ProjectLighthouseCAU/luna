<template>
  <v-container class="px-2 px-lg-16 py-0">
    <h1 class="my-4">
      Other Page
    </h1>
    <v-card
      title="Some lazy images"
      class="px-2 px-lg-16"
    >
      <v-row>
        <v-col
          cols="0"
          md="10"
        />
        <v-col
          cols="12"
          md="2"
        >
          <v-select
            v-model="nItems"
            label="Items per page"
            :items="[4, 12, 24, 48, 96]"
          />
        </v-col>
      </v-row>
      <v-container>
        <v-row>
          <v-col
            v-for="n in nItems"
            :key="n"
            :cols="nItems === 4 ? 12 : 3"
            :md="nCols"
            class="d-flex justify-center"
          >
            <dummy-lazy />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import DummyLazy from '@/components/DummyLazy.vue'
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'

const nItems = ref(12)

const nCols = computed(() => {
  switch (nItems.value) {
    case 4:
      return 3
    case 12:
    case 24:
      return 2
    case 48:
    case 96:
      return 1
  }
})
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}
</style>
