<template>
  <v-app :theme="theme">
    <v-navigation-drawer
      v-model="drawer"
    >
      <nav-list />
    </v-navigation-drawer>
    <top-bar
      @nav-button-click="toggleDrawer"
      @dark-mode-button-click="toggleTheme"
    />
    <v-main class="main">
      <v-container
        fluid
        class="py-0"
      >
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from '@vue/runtime-core'
import { Store, useStore } from 'vuex'
import { State, Theme } from './store'
import { Ref } from 'vue'
import TopBar from '@/views/TopBar.vue'
import NavList from '@/views/NavList.vue'

const store : Store<State> = useStore()

onBeforeMount(() => {
  let theme: Theme = localStorage.getItem('theme')
  if (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = 'dark'
  }
  store.commit('setTheme', theme)
})

const drawer = ref(null) as Ref<boolean | null>

const theme = computed(() => {
  return store.state.theme
})

function toggleDrawer() {
  drawer.value = !drawer.value
}

function toggleTheme() {
  store.commit('toggleTheme')
  localStorage.setItem('theme', store.state.theme)
}
</script>

<style lang="scss">
.v-application {
  font-family: 'Fira Sans', 'sans-serif';
}
</style>
