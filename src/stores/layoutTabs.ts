import useContinuousStore, { contiDistribs } from 'stores/continuous';
import useDiscreteStore, { discDistribs } from 'stores/discrete';
import { isNullish, sepByCap } from '~/utils/helpers';
import { pages } from '~/utils/route';

export type TabItem = {
  value: number,
  text: string,
  disabled?: boolean,
}

type State = {
  tabIdx: number,
  extTabs: TabItem[],
}

const useLayoutTabsStore =  defineStore('layoutTabs', {
  state: (): State => ({
    extTabs: [],
    tabIdx: 0,
  }),
  actions: {
    updateTabs(route: string) {
      const idx = pages.findIndex(({path}) => route === path);
      let extTabs: TabItem[] = [];
      if (idx === 1) {
        extTabs = discDistribs.map(([name], i) => ({
          value: i,
          text: sepByCap(name),
        }));
      } else if (idx === 2) {
        extTabs = contiDistribs.map(([name], i) => ({
          value: i,
          text: name === 'StudentsT' ? 'Student\'s t' : sepByCap(name),
        }));
      } else if (idx === 3) {
        extTabs = [
          {
            value: 0,
            text: '獨立事件(Independent Event)',
          },
          {
            value: 1,
            text: '相依事件(Dependent Event)',
          },
          {
            value: 2,
            text: '貝氏定理(Bayes\' theorem)',
          }
        ] as const;
      }
      this.extTabs = extTabs;
      if (extTabs.length)
        this.setExtTab_(route, extTabs[0].value);
      return extTabs;
    },
    setExtTab_(route: string, val: number) {
      this.tabIdx = val;
      if (!isNullish(val) && route === '/discrete-distribution') {
        useDiscreteStore().setCurrent(val);
      } else if (!isNullish(val) && route === '/continuous-distribution') {
        useContinuousStore().setCurrent(val);
      }
    },
  }
});
export default useLayoutTabsStore;
