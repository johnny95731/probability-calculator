<script setup lang="ts">
import useBayesStore, { args } from 'stores/bayes';

const labels = args.map(name => `P(${name})=`);

const bayesState = useBayesStore();
</script>

<template>
  <v-row>
    <v-col
      class="border rounded-md px-2 py-4 bg-white"
      cols="5"
    >
      <ParamLabel
        v-once
        class="w-100 font-weight-bold"
        label="參數"
      />
      <ParamInput
        v-for="(name, i) in args"
        :key="name"
        :label="name"
        :prepend-text="labels[i]"
        min="0"
        max="1"
        step="any"
        :model-value="bayesState[name]"
        @update:model-value="bayesState.updateArg(name, $event)"
      />
      <v-divider class="my-3" />
    </v-col>
    <v-col
      class="border rounded-md px-2 py-4 bg-white"
    >
      <ParamLabel
        class="w-100 font-weight-bold"
        label="結果"
      />
      <ParamInput
        label="結果"
        prepend-text="P(A|B)="
        readonly
        :model-value="bayesState.result"
      />
    </v-col>
  </v-row>
</template>
