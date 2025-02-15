<script setup lang="ts">
import { pages } from 'utils/route';

useHead({
  title: 'Probability Calculator',
});
</script>

<template>
  <v-container
    v-once
    class="h-100 pa-0"
  >
    <div
      v-once
      class="h-25 px-2 py-16 text-center bg-surface"
    >
      <h2 class="text-h4 font-weight-black">
        機率計算機
      </h2>
    </div>
    <div class="d-flex flex-wrap justify-center ga-4 my-3">
      <v-card
        v-for="page in pages.slice(1)"
        v-once
        :key="page.title"
        class="d-flex flex-column"
        width="400"
        :to="page.path"
        color="grey-lighten-4"
        variant="elevated"
      >
        <v-card-title
          tag="h2"
          class="mb-2 py-1 font-weight-black"
        >
          {{ page.title }}
        </v-card-title>
        <v-card-text>
          {{ page.description }}
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>
