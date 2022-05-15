<template>
  <v-container class="px-2 px-lg-16 py-0">
    <h1 class="my-4">
      Other Page
    </h1>
    <v-card
      title="Some text areas"
      class="px-2 px-lg-16"
    >
      <v-container>
        <v-textarea
          v-for="n in 5"
          :key="n"
          placeholder="This text area has no function other than to fill the page"
        />
      </v-container>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}
</style>
