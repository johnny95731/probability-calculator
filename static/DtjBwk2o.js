import { c as contiDistribs, u as useContinuousStore } from "./B6xficXq.js";
import { d as discreteNames, u as useDiscreteStore } from "./Br7ZvRxH.js";
import { N as sepByCap } from "./BTmLGcui.js";
import { p as pages } from "./CUPcO2LI.js";
import { a1 as defineStore } from "./nAMcUtwR.js";
const useLayoutTabsStore = defineStore("layoutTabs", {
  state: () => ({
    extTabs: [],
    extTabValue: null,
    extTabIdx: 0
  }),
  actions: {
    setExtTabs(route) {
      const idx = pages.findIndex(({ path }) => route === path);
      let extTabs = [];
      if (idx === 1) {
        extTabs = discreteNames.map((name) => ({
          value: name,
          text: sepByCap(name)
        }));
      } else if (idx === 2) {
        extTabs = contiDistribs.map(([name], i) => ({
          value: i,
          text: name === "StudentsT" ? "Student's t" : sepByCap(name)
        }));
      } else if (idx === 3) {
        extTabs = [
          {
            value: "independent",
            text: "獨立事件(Independent Event)"
          },
          {
            value: "dependent",
            text: "相依事件(Dependent Event)"
          },
          {
            value: "bayes",
            text: "貝氏定理(Bayes' theorem)"
          }
        ];
      }
      this.extTabs = extTabs;
      if (extTabs.length)
        this.setExtTabValue(route, extTabs[0].value);
    },
    setExtTabValue(route, val) {
      this.extTabValue = val;
      this.extTabIdx = this.extTabs.findIndex(({ value }) => this.extTabValue === value);
      if (val && route === "/discrete-distribution") {
        const discreteState = useDiscreteStore();
        discreteState.setCurrent(val);
      } else if (val && route === "/continuous-distribution") {
        const continuousState = useContinuousStore();
        continuousState.setCurrent(val);
      }
    }
  }
});
export {
  useLayoutTabsStore as u
};
