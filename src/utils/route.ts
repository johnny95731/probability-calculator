
export const pages: {
  path?: string,
  title: string,
  description?: string,
}[] = [
  {
    path: '/',
    title: '首頁',
  },
  {
    path: '/discrete-distribution',
    title: '離散機率分布',
    description: '計算離散機率分布的pmf、cdf以及平均值等資訊。',
  },
  {
    path: '/continuous-distribution',
    title: '連續機率分布',
    description: '計算連續機率分布的pdf、cdf以及平均值等資訊。',
  },
  {
    path: '/event-probability',
    title: '事件機率',
    description: '計算獨立事件、',
  },
] as const;
