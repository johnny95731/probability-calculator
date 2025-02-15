<script setup lang="ts">
import Chart from 'chart.js/auto';
import { mergeObjects, toCSSLength } from 'utils/helpers';
import { defaultOptions } from 'utils/chartconfig';
import type { ChartType, ChartConfiguration } from 'chart.js/auto';
import type { Numberish } from 'utils/type-helpers';

type Props = {
  height?: Numberish | string;
  width?: Numberish | string;
  type?: ChartType;
  title?: string;
} & (
  Pick<ChartConfiguration, 'data' | 'options' | 'plugins'>
)
const props = withDefaults(defineProps<Props>(), {
  type: 'line',
  width: '100%',
});
const sheetSize = computed(() => {
  return {
    height: toCSSLength(props.height),
    width: toCSSLength(props.width),
  };
});

const canvasRef = ref<HTMLCanvasElement>();
const chart = shallowRef<InstanceType<typeof Chart>>();
onMounted(() => {
  if (!unref(canvasRef)) return;
  chart.value = new Chart(unref(canvasRef)!, {
    type: props.type,
    data: props.data,
    options: {
      ...mergeObjects(defaultOptions, props.options)
    },
    plugins: props.plugins,
  });
});

watch(() => props.data, (newData) => {
  if (!unref(chart)) return;
  unref(chart)!.data = newData;
  unref(chart)!.update();
}, { deep: true });

watch(() => props.options, (newOptions) => {
  if (!unref(chart)) return;
  unref(chart)!.options = {
    ...newOptions
  };
  unref(chart)!.update();
}, { deep: true });
</script>

<template>
  <div
    class="chart-container"
    :style="{
      ...sheetSize
    }"
  >
    <slot name="title">
      <div
        v-if="title"
        class="text-center"
      >
        {{ title }}
      </div>
    </slot>
    <canvas
      ref="canvasRef"
    />
  </div>
</template>

<style lang="scss">
.chart-container {
  padding: 8px 16px;
}
</style>
