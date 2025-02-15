import type { ChartDataset, ChartOptions } from 'chart.js';

export const defaultOptions = {
  animation: {
    duration: 300
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
} satisfies ChartOptions;


export const defaultLineDataset = {
  fill: true,
  pointStyle: false,
  borderWidth: 2,
} satisfies Omit<ChartDataset<'line'>, 'data'>;
