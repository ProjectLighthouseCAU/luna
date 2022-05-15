<template>
  <v-container class="px-2 px-lg-16 py-0">
    <h1 class="my-4">
      Main Page
    </h1>
    <v-card
      title="A grid of text areas"
      class="px-2 px-lg-16"
    >
      <v-container>
        <v-row>
          <v-col
            v-for="n in 16"
            :key="n"
            cols="3"
          >
            <v-textarea
              placeholder="This text area has no function other than to fill the page"
            />
          </v-col>
        </v-row>
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
