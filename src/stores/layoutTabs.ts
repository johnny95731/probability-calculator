import useContinuousStore, { continuousNames } from 'stores/continuous';
import useDiscreteStore, { discreteNames } from 'stores/discrete';
import { sepByCap } from '~/utils/helpers';
import { pages } from '~/utils/route';

export type TabItem = {
  value: string,
  text: string,
  disabled?: boolean,
}

type State = {
  /**
   * Value of header's extension tab.
   */
  extTabValue_: string | null,
  extTabIdx_: number,
  extTabs_: TabItem[],
}

const useLayoutTabsStore =  defineStore('layoutTabs', {
  state: (): State => ({
    extTabs_: [],
    extTabValue_: null,
    extTabIdx_: 0,
  }),
  actions: {
    setExtTabs_(route: string) {
      const idx = pages.findIndex(({path}) => route === path);
      let extTabs: TabItem[] = [];
      if (idx === 1) {
        extTabs = discreteNames.map((name) => ({
          value: name,
          text: sepByCap(name),
        }));
      } else if (idx === 2) {
        extTabs = continuousNames.map((name) => ({
          value: name,
          text: name === 'StudentsT' ? 'Student\'s t' : sepByCap(name),
        }));
      } else if (idx === 3) {
        extTabs = [
          {
            value: 'independent',
            text: '獨立事件(Independent Event)',
          },
          {
            value: 'dependent',
            text: '相依事件(Dependent Event)',
          },
          {
            value: 'bayes',
            text: '貝氏定理(Bayes\' theorem)',
          }
        ] as const;
      }
      this.extTabs_ = extTabs;
      if (extTabs.length)
        this.setExtTabValue_(route, extTabs[0].value);
    },
    setExtTabValue_(route: string, val: string) {
      this.extTabValue_ = val;
      this.extTabIdx_ = this.extTabs_.findIndex(({value}) => this.extTabValue_ === value);
      if (val && route === '/discrete-distribution') {
        const discreteState = useDiscreteStore();
        discreteState.setCurrent(val);
      } else if (val && route === '/continuous-distribution') {
        const continuousState = useContinuousStore();
        continuousState.setCurrent(val);
      }
    },
  }
});
export default useLayoutTabsStore;
