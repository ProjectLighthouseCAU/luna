<template>
  <v-list>
    <v-list-item
      v-for="item in menuItems"
      :key="item.title"
      :to="item.link"
    >
      <v-list-item-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-avatar>
      <v-list-item-title>
        {{ item.title }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
const menuItems = [
  {
    title: 'Home',
    link: '/',
    icon: 'mdi-home'
  },
  {
    title: 'Not home',
    link: '/other',
    icon: 'mdi-arrow-right-thick'
  }
]
</script>
