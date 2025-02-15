<script setup lang="ts">
import ParamInput from '@/components/ParamInput.vue';
import ParamLabel from '@/components/ParamLabel.vue';
import useContinuousStore from 'stores/continuous';
import VChart from '~/components/VChart.vue';
import { isNullish, vuetifyInputKeydownWrapper } from 'utils/helpers';
import { linspace, round, sortArr } from 'utils/numeric';
import { defaultLineDataset } from 'utils/chartconfig';
import type { ChartData, ChartDataset, ChartOptions } from 'chart.js';

useHead({
  title: 'Probability Calculator - Continuous Probability Distribution',
});

const continuousState = useContinuousStore();

const varsTooltip = computed<string>(() => {
  const distrib = continuousState.distribution;
  const {min, max} = continuousState.varDomain;
  const left = isNullish(min) ? '(-∞' :
    distrib.isInDomain(continuousState.args, min) ?
      `[${min}`:`(${min}`;
  const right = isNullish(max) ? '∞)' :
    distrib.isInDomain(continuousState.args, max) ?
      `${max}]`:`${max})`;
  return `Domain: ${left}, ${right}`;
});

type ResultItem = {
  name: string,
  value: keyof ReturnType<typeof continuousState.calcProb>
}
const pdf: ResultItem[] = [
  {
    name: 'pdf(L)=',
    value: 'left',
  },
  {
    name: 'pdf(R)=',
    value: 'right',
  },
] as const;
const cummulation: ResultItem[] = [
  {
    name: 'P(X≤L)=',
    value: 'below',
  },
  {
    name: 'P(X≥R)=',
    value: 'above',
  },
  {
    name: 'P(L≤X≤R)=',
    value: 'between',
  },
  {
    name: 'P(X≤L or X≥R)=',
    value: 'outside',
  },
] as const;

const sortedVars = computed(() => sortArr(continuousState.vars));
const probResults = computed<ReturnType<typeof continuousState.calcProb>>(() => {
  return continuousState.calcProb(unref(sortedVars));
});
const cdfSuffix = computed(() => continuousState.calc_.toPercentage_ ? '%' : undefined);

const chartData = computed<ChartData>(() => {
  const { calc_: { place_ }, chart_: { points_, extended_ } } = continuousState;
  const round_ = (val: number) => round(val, place_);
  // x-axis
  const [L, R] = sortedVars.value;
  // 2 for left and right. 100 for percentage to decimal.
  const ratio = (extended_ / 200);
  const extended = (R - L) * ratio;
  /** Point counts */
  const counts = {
    outside_: round(points_ * ratio),
    between_: points_ - round(points_ * ratio),
  };
  const xLabels: number[] = [
    ...linspace(L-extended, L, counts.outside_, round_),
    ...linspace(L, R, counts.between_, round_),
    ...linspace(R, R+extended, counts.outside_, round_),
  ];
  // y-axis
  const below: number[] = Array(counts.outside_);
  const between: number[] = Array(counts.between_ + counts.outside_ );
  const above: number[] = Array(counts.between_ + 2 * counts.outside_);
  if (counts.outside_ > 0) {
    between.length -= 1;
    xLabels.splice(between.length, 1);
    xLabels.splice(below.length, 1);
  }
  for (let i = 0, j = between.length-1; i < below.length; i++, j++) {
    below[i] = continuousState.pdf(xLabels[i]);
    above[j] = continuousState.pdf(xLabels[j]);
  }
  for (let i = below.length-1; i < between.length; i++) {
    between[i] = continuousState.pdf(xLabels[i]);
  }

  const yData = [
    {
      ...defaultLineDataset,
      label: 'below',
      data: below,
      borderColor: '#c00',
      backgroundColor: '#c003'
    },
    {
      ...defaultLineDataset,
      label: 'between',
      data: between,
      borderColor: '#0c0',
      backgroundColor: '#0c03',
    },
    {
      ...defaultLineDataset,
      label: 'above',
      data: above,
      borderColor: '#00c',
      backgroundColor: '#00c3',
    }
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
    return continuousState.chart_.extended_;
  },
  set(val: number) {
    if (!isNaN(val))
      continuousState.chart_.extended_ = val;
  }
});
const extendedRatioKeydown = vuetifyInputKeydownWrapper(
  1, 5, extendedRatio, { min: 0, max: 100 }
);

const points = computed({
  get() {
    return continuousState.chart_.points_;
  },
  set(val: number) {
    if (!isNaN(val))
      continuousState.chart_.points_ = val;
  }
});
const pointsKeydown = vuetifyInputKeydownWrapper(
  50, 100, points, { min: 50, max: 2000 }
);

const chartPlace = computed({
  get() {
    return continuousState.chart_.place_;
  },
  set(val: number) {
    if (!isNaN(val) && Number.isInteger(val))
      continuousState.chart_.place_ = val;
  }
});

const place = computed({
  get() {
    return continuousState.calc_.place_;
  },
  set(val: number) {
    if (!isNaN(val) && Number.isInteger(val))
      continuousState.calc_.place_ = val;
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
          const label = `${context.parsed.y} (${context.dataset.label})`;
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: chartGrid.value
      },
      ticks: {
        callback: function(val) {
          // @ts-expect-error
          return round(this.getLabelForValue(val), chartPlace.value);
        }
      },
    },
    y: {
      min: 0,
      border: {
        display: false
      },
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
watch(chartPlace, (newVal) => {
  chartOptions.scales.x.ticks.callback = function(val) {
    // @ts-expect-error
    return round(this.getLabelForValue(val), newVal);
  };
});
</script>

<template>
  <v-container
    class="d-flex flex-column h-100 pa-0 bg-white"
    max-width="950"
  >
    <v-row noGutters>
      <v-col class="px-2 py-4 d-flex flex-wrap justify-space-evenly align-content-start">
        <VChart
          :data="chartData"
          :options="chartOptions"
        >
          <template #title>
            <div
              v-once
              class="text-center"
            >
              Partical Distributonp Function
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
                <VSwitch
                  v-model="chartOptions.plugins.legend"
                >
                  <template #prepend="{id}">
                    <v-label
                      :for="id.value"
                      class="ps-0 opacity-100 text-black"
                      style="width: 100px;"
                      text="顯示圖例"
                    />
                  </template>
                </VSwitch>
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
                <ParamInput
                  label="小數位數"
                  min="0"
                  max="10"
                  step="1"
                  :model-value="chartPlace"
                  @update:model-value="chartPlace = +$event"
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
                  v-model="continuousState.calc_.toPercentage_"
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
          v-for="(param) in pdf"
          :key="param.name"
          class="flex-0-0"
          :param="param"
          readonly
          variant="solo"
          flat
          :model-value="probResults[param.value]"
        />
        <ParamInput
          v-for="(param) in cummulation"
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
          v-for="(param) in continuousState.paramRanges"
          :key="param.name"
          :param="param"
          :model-value="continuousState.args[param.name]"
          @update:model-value="continuousState.setArg(param.name, $event)"
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
          :param="continuousState.varDomain"
          :model-value="continuousState.vars[0]"
          @update:model-value="continuousState.setVars(0, $event)"
        />
        <ParamInput
          label="p2="
          :param="continuousState.varDomain"
          :model-value="continuousState.vars[1]"
          @update:model-value="continuousState.setVars(1, $event)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
