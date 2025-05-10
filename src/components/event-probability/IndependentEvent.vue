<script setup lang="ts">
import useIndependentStore, { optionsOfTargets, targets } from 'stores/independent';
import type { Target } from 'stores/independent';
import { computed } from 'vue';
import FormulaTable from '../FormulaTable.vue';
import { rEventParamNameBiMap, type REventParamKey } from '~/utils/probability';

const independentState = useIndependentStore();

type SelectItem<T> = {
  title: string,
  value: T
}

const targetItems = targets.map(target => ({
  title: `P(${target})`,
  value: target
})) satisfies SelectItem<string>[];

const argOptionItems = targets.reduce((prev, target) => {
  prev[target] = optionsOfTargets[target]
    .map((option, i) => ({
      title: option.keys.map(key => `P(${rEventParamNameBiMap[key]})`).join(', '),
      value: i
    }));
  return prev;
}, {} as Record<Target, SelectItem<number>[]>);

const currentArgs = computed({
  get() {
    return independentState[independentState.target][independentState.optionIdx];
  },
  set([key, naeVal]: [REventParamKey, number]) {
    independentState.setArg(key, naeVal);
  }
});

const formula = computed(() => {
  return independentState.formula.map((text, i) => {
    if (i === 0) {
      return [`P(${independentState.target})`, '= ' + text];
    }
    return [null,  '= ' + text];
  });
});
</script>

<template>
  <v-row>
    <v-col
      class="border rounded-md px-2 py-4 text-center"
    >
      <div class="w-50 mx-auto">
        Euler Diagram
        <EulerDiagram />
      </div>
      <ParamLabel
        class="w-100 font-weight-bold"
        label="計算結果"
      />
      <ParamInput
        class="mx-auto"
        label="計算結果"
        type="text"
        :prependText="`P(${independentState.target})=`"
        readonly
        variant="solo"
        flat
        :model-value="independentState.result"
        :message="independentState.errorMessage"
      />
      <FormulaTable
        class="mx-auto"
        title="算式"
        :formula="formula"
      >
        <template #title>
          <ParamLabel
            class="w-100 font-weight-bold"
            label="算式"
          />
        </template>
      </FormulaTable>
    </v-col>
    <v-col
      class="border rounded-md px-2 py-4"
      cols="4"
    >
      <ParamInput
        type="select"
        label="目標"
        :items="targetItems"
        :model-value="independentState.target"
        @update:model-value="independentState.updateTarget"
      />
      <v-divider class="my-3" />

      <ParamLabel
        v-once
        class="w-100 font-weight-bold"
        label="參數"
      />
      <ParamInput
        type="select"
        label="選項"
        :items="argOptionItems[independentState.target]"
        :model-value="independentState.optionIdx"
        @update:model-value="independentState.setOption"
      />
      <ParamInput
        v-for="({key, label}) in independentState.params"
        :key="key"
        :label="label"
        :prependText="`P(${label})=`"
        min="0"
        max="1"
        step="any"
        :model-value="currentArgs[key]"
        @update:model-value="independentState.setArg(key, $event)"
      />
    </v-col>
  </v-row>
</template>
