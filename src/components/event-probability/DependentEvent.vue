<script setup lang="ts">
import FormulaTable from '../FormulaTable.vue';
import useDependentStore, { optionsOfTargets, targets } from 'stores/dependent';
import { rEventParamNameBiMap } from 'utils/probability';
import type { Target } from 'stores/dependent';
import type { REventParamKey } from 'utils/probability';

const dependentState = useDependentStore();

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
    return dependentState[dependentState.target][dependentState.optionIdx];
  },
  set([key, naeVal]: [REventParamKey, number]) {
    dependentState.setArg(key, naeVal);
  }
});

const formula = computed(() => {
  return dependentState.formula.map((text, i) => {
    if (i === 0) {
      return [`P(${dependentState.target})`, '= ' + text];
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
        :prependText="`P(${dependentState.target})=`"
        readonly
        variant="solo"
        flat
        :model-value="dependentState.result"
        :message="dependentState.errorMessage"
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
        :model-value="dependentState.target"
        @update:model-value="dependentState.updateTarget"
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
        :items="argOptionItems[dependentState.target]"
        :model-value="dependentState.optionIdx"
        @update:model-value="dependentState.setOption"
      />
      <ParamInput
        v-for="({key, label}) in dependentState.params"
        :key="key"
        :label="label"
        :prependText="`P(${label})=`"
        min="0"
        max="1"
        step="any"
        :model-value="currentArgs[key]"
        @update:model-value="dependentState.setArg(key, $event)"
      />
    </v-col>
  </v-row>
</template>
