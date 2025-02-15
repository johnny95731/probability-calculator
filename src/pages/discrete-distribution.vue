<script setup lang="ts">
import ParamInput from '@/components/ParamInput.vue';
import ParamLabel from '@/components/ParamLabel.vue';
import type { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import useDiscreteStore from 'stores/discrete';
import type { Cummulative } from '~/utils/distributions/common';
import { isNullish, vuetifyInputKeydownWrapper } from '~/utils/helpers';
import { arange, linspace, round, sortArr } from '~/utils/numeric';

useHead({
  title: 'Probability Calculator - Discrete Probability Distribution',
});

const discreteState = useDiscreteStore();

const varsTooltip = computed<string>(() => {
  const distrib = discreteState.distribution;
  const {min, max} = discreteState.varDomain;
  const left = isNullish(min) ? '(-∞' :
    distrib.isInDomain(discreteState.args, min) ?
      `[${min}`:`(${min}`;
  const right = isNullish(max) ? '∞)' :
    distrib.isInDomain(discreteState.args, max) ?
      `${max}]`:`${max})`;
  return `Domain: ${left}, ${right}`;
});

type ResultItem = {
  name: string,
  value: keyof ReturnType<typeof discreteState.calcProb>
}
const results: ResultItem[] = [
  {
    name: 'P(X=L)',
    value: 'left',
  },
  {
    name: 'P(X=R)',
    value: 'right',
  },
  {
    name: 'P(X≤L)',
    value: 'below',
  },
  {
    name: 'P(X≥R)',
    value: 'above',
  },
  {
    name: 'P(X<L)',
    value: 'belowExcl',
  },
  {
    name: 'P(X>R)',
    value: 'aboveExcl',
  },
  {
    name: 'P(L≤X≤R)',
    value: 'between',
  },
  {
    name: 'P(X≤L or X≥R)',
    value: 'outside',
  },
] as const;
const sortedVars = computed(() => sortArr(discreteState.vars));
const probResults = computed<ReturnType<typeof discreteState.calcProb>>(() => {
  return discreteState.calcProb(unref(sortedVars));
});

const cdfSuffix = computed(() => discreteState.calc_.toPercentage_ ? '%' : undefined);


const chartData = computed<ChartData>(() => {
  const { chart_: { points_, extended_ } } = discreteState;
  // x-axis
  const [L, R] = sortedVars.value;
  // 2 for left and right. 100 for percentage to decimal.
  const ratio = (extended_ / 200);
  const extended = Math.ceil((R - L) * ratio);
  const xLabels: number[] = R-L+1 + 2*extended <= points_ || points_ === 0 ?
    arange(L-extended, R+extended, 1, round) :
    linspace(L-extended, R+extended, points_, round);
  // y-axis
  const pmf: number[] = Array(R - L + 1 + 2 * extended);
  for (let i = 0; i < pmf.length; i++) {
    pmf[i] = discreteState.pdf(xLabels[i]);
  }

  const yData = [
    {
      data: pmf,
      backgroundColor: '#0c03',
    },
  ] satisfies ChartDataset[];
  return {
    labels: xLabels,
    datasets: yData,
  };
});


// Chart
const isChartSettingsActive = ref<boolean>(false);
const settingsTabItems = [
  {
    text: '圖表',
    value: 'chart'
  },
  {
    text: '計算',
    value: 'calc'
  },
] as const;
const settingsTab = ref<typeof settingsTabItems[number]['value']>(
  settingsTabItems[0].value
);

// Arguments in settings dialog
const extendedRatio = computed({
  get() {
    return discreteState.chart_.extended_;
  },
  set(val: number) {
    if (!isNaN(val))
      discreteState.chart_.extended_ = val;
  }
});
const extendedRatioKeydown = vuetifyInputKeydownWrapper(
  1, 5, extendedRatio, { min: 0, max: 100 }
);

const points = computed({
  get() {
    return discreteState.chart_.points_;
  },
  set(val: number) {
    if (!isNaN(val))
      discreteState.chart_.points_ = val;
  }
});
const pointsKeydown = vuetifyInputKeydownWrapper(
  50, 100, points, { min: 50, max: 2000 }
);

const place = computed({
  get() {
    return discreteState.calc_.place_;
  },
  set(val: number) {
    if (!isNaN(val) && Number.isInteger(val))
      discreteState.calc_.place_ = val;
  }
});

const chartGrid = ref(true);
const chartOptions = reactive({
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const x = context.parsed.x;
          const belong = [] as Cummulative[];
          if (x <= sortedVars.value[0]) belong.push('below');
          if (sortedVars.value[0] <= x && x <= sortedVars.value[1]) belong.push('between');
          if (x >= sortedVars.value[1]) belong.push('above');
          return `${context.parsed.y} (${belong.join(',')})`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: chartGrid.value
      },
    },
    y: {
      min: 0,
      grid: {
        display: chartGrid.value
      },
    },
  }
} satisfies ChartOptions<'line'>);
watch(chartGrid, (newVal) => {
  chartOptions.scales.x.grid.display = newVal;
  chartOptions.scales.y.grid.display = newVal;
});
</script>

<template>
  <v-container
    class="d-flex flex-column h-100 pa-0 bg-white"
    max-width="950"
  >
    <v-row noGutters>
      <v-col class="elevation-3 px-2 py-4 d-flex flex-wrap justify-space-evenly align-content-start">
        <VChart
          type="bar"
          :data="chartData"
          :options="chartOptions"
        >
          <template #title>
            <div
              v-once
              class="text-center"
            >
              Partical Mass Function
              <v-icon
                class="float-right cursor-pointer"
                icon="mdi-cog"
                @click="isChartSettingsActive = true"
              />
            </div>
          </template>
        </VChart>
        <!-- Chart Settings -->
        <VDialog
          v-model="isChartSettingsActive"
          max-width="300"
          min-height="400"
        >
          <VCard>
            <VCardTitle
              tag="h2"
              class="font-weight-bold bg-primary d-flex align-center justify-space-between"
            >
              設定
              <VBtn
                icon="mdi-close"
                density="compact"
                variant="text"
                @click="isChartSettingsActive = false"
              />
            </VCardTitle>
            <VTabs
              v-model="settingsTab"
              class="flex-0-0-100"
              :items="settingsTabItems"
              bg-color="blue-grey-darken-2"
              color="white"
              grow
              hide-slider
            >
              <v-tab
                v-for="page in settingsTabItems"
                :key="page.value"
                class="text-body-1"
                :value="page.value"
                base-color="blue-grey-lighten-3"
                variant="tonal"
                :ripple="false"
              >
                {{ page.text }}
              </v-tab>
            </VTabs>
            <VCardText
              class="overflow-y-auto overflow-x-hidden pt-2"
            >
              <template v-if="settingsTab === 'chart'">
                <VSwitch v-model="chartGrid">
                  <template #prepend="{id}">
                    <v-label
                      :for="id.value"
                      class="ps-0 opacity-100 text-black"
                      style="width: 100px;"
                      text="格線"
                    />
                  </template>
                </VSwitch>
                <ParamInput
                  label="延伸範圍"
                  min="0"
                  max="100"
                  suffix="%"
                  :model-value="extendedRatio"
                  @update:model-value="extendedRatio = +$event"
                  @keydown="extendedRatioKeydown"
                >
                  <template #prepend="{props, text}">
                    <div
                      v-bind="props"
                      class="text-left"
                    >
                      {{ text }}
                    </div>
                  </template>
                </ParamInput>
                <ParamInput
                  label="數量"
                  min="50"
                  max="2000"
                  step="50"
                  :model-value="points"
                  @update:model-value="points = +$event"
                  @keydown="pointsKeydown"
                >
                  <template #prepend="{props, text}">
                    <div
                      v-bind="props"
                      class="text-left"
                    >
                      {{ text }}
                    </div>
                  </template>
                </ParamInput>
              </template>

              <template v-else-if="settingsTab === 'calc'">
                <VSwitch
                  v-model="discreteState.calc_.toPercentage_"
                >
                  <template #prepend="{id}">
                    <v-label
                      :for="id.value"
                      class="ps-0 opacity-100 text-black"
                      style="width: 100px;"
                      text="百分比"
                    />
                  </template>
                </VSwitch>
                <ParamInput
                  label="小數位數"
                  min="0"
                  max="10"
                  step="1"
                  :model-value="place"
                  @update:model-value="place = +$event"
                >
                  <template #prepend="{props, text}">
                    <div
                      v-bind="props"
                      class="text-left"
                    >
                      {{ text }}
                    </div>
                  </template>
                </ParamInput>
              </template>
            </VCardText>
          </VCard>
        </VDialog>

        <ParamLabel
          v-once
          class="w-100 font-weight-bold"
          label="計算結果"
          icon="information-outline"
        >
          <VTooltip
            activator="parent"
            location="bottom"
          >
            <div>
              L=min(p1,p2)={{ sortedVars[0] }}
            </div>
            <div>
              R=max(p1,p2)={{ sortedVars[1] }}
            </div>
          </VTooltip>
        </ParamLabel>
        <ParamInput
          v-for="(param) in results"
          :key="param.name"
          class="flex-0-0"
          :param="param"
          readonly
          variant="solo"
          flat
          :suffix="cdfSuffix"
          :model-value="probResults[param.value]"
        />
      </v-col>

      <v-col
        class="border rounded-md px-2 py-4"
        cols="4"
      >
        <ParamLabel
          v-once
          v-tooltip:bottom="'最大、最小值將自動調整'"
          class="font-weight-bold"
          label="參數"
          icon="information-outline"
        />
        <ParamInput
          v-for="(param) in discreteState.paramRanges"
          :key="param.name"
          :param="param"
          :model-value="discreteState.args[param.name]"
          @update:model-value="discreteState.setArg(param.name, +$event)"
        />
        <v-divider class="my-3" />

        <ParamLabel
          v-tooltip:bottom="varsTooltip"
          class="font-weight-bold"
          label="變數"
          icon="information-outline"
        />
        <ParamInput
          label="p1="
          :param="discreteState.varDomain"
          :model-value="discreteState.vars[0]"
          @update:model-value="discreteState.setVars(0, $event)"
        />
        <ParamInput
          label="p2="
          :param="discreteState.varDomain"
          :model-value="discreteState.vars[1]"
          @update:model-value="discreteState.setVars(1, $event)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
