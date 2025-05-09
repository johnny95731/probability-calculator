import { c as contiDistribs, u as useContinuousStore } from "./D7h6Q_jA.js";
import { d as discDistribs, u as useDiscreteStore } from "./BOPhn_H-.js";
import { N as sepByCap, i as isNullish } from "./ChaVi1sj.js";
import { p as pages } from "./CUPcO2LI.js";
import { a1 as defineStore } from "./CLygsIoC.js";
const useLayoutTabsStore = defineStore("layoutTabs", {
  state: () => ({
    extTabs_: [],
    tabIdx_: 0
  }),
  actions: {
    setExtTabs_(route) {
      const idx = pages.findIndex(({ path }) => route === path);
      let extTabs = [];
      if (idx === 1) {
        extTabs = discDistribs.map(([name], i) => ({
          value: i,
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
            value: 0,
            text: "獨立事件(Independent Event)"
          },
          {
            value: 1,
            text: "相依事件(Dependent Event)"
          },
          {
            value: 2,
            text: "貝氏定理(Bayes' theorem)"
          }
        ];
      }
      this.extTabs_ = extTabs;
      if (extTabs.length)
        this.setExtTab_(route, extTabs[0].value);
    },
    setExtTab_(route, val) {
      this.tabIdx_ = val;
      if (!isNullish(val) && route === "/discrete-distribution") {
        useDiscreteStore().setCurrent_(val);
      } else if (!isNullish(val) && route === "/continuous-distribution") {
        useContinuousStore().setCurrent_(val);
      }
    }
  }
});
export {
  useLayoutTabsStore as u
};
