import { defineStore } from 'pinia';
import { clip } from 'utils/numeric';

export const args = [
  'A',
  'B',
  'B|A'
] as const satisfies string[];

type State = Record<typeof args[number], number>

const useBayesStore = defineStore('bayes', {
  state: () => {
    return args.reduce((prev, name) => {
      prev[name] = 0;
      return prev;
    }, {} as State);
  },
  getters: {
    result(): number {
      return this.A * this['B|A'] / this.B;
    }
  },
  actions: {
    updateArg(key: keyof State, newVal: number | string) {
      this[key] = clip(newVal, 0, 1);
    }
  }
});
export default useBayesStore;
