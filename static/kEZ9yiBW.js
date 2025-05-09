import { V as VDialog, a as VSwitch, T as Tooltip, _ as __nuxt_component_0$1 } from "./BjjwOIE0.js";
import { V as VCol, a as VLabel, _ as __nuxt_component_1, b as __nuxt_component_0, c as VTooltip, d as VDivider, e as VRow } from "./Aa-mRKeE.js";
import { u as useDiscreteStore } from "./BOPhn_H-.js";
import { i as isNullish, s as sortArr, a as arange, l as linspace, v as vuetifyInputKeydownWrapper, r as round } from "./ChaVi1sj.js";
import { d as defineComponent, t as useHead, i as computed, r as ref, D as reactive, E as watch, v as openBlock, F as createBlock, B as withCtx, A as createVNode, G as unref, H as setBlockTracking, y as createBaseVNode, C as createTextVNode, I as isRef, x as createElementBlock, J as renderList, K as Fragment, z as toDisplayString, L as mergeProps, M as createCommentVNode, N as withDirectives } from "./CLygsIoC.js";
import { V as VContainer } from "./BfKDNlkB.js";
import { V as VIcon } from "./iovqoryD.js";
import { V as VCard, a as VCardTitle, b as VCardText } from "./CDB1RMSL.js";
import { V as VBtn, a as VTabs, b as VTab } from "./dwKav9SY.js";
import "./CzYvQyrK.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "discrete-distribution",
  setup(__props) {
    useHead({
      title: "Probability Calculator - Discrete Probability Distribution"
    });
    const discreteState = useDiscreteStore();
    const varsTooltip = computed(() => {
      const distrib = discreteState.distribution_;
      const { min, max } = discreteState.varDomain_;
      const left = isNullish(min) ? "(-∞" : distrib.isInDomain(discreteState.args_, min) ? `[${min}` : `(${min}`;
      const right = isNullish(max) ? "∞)" : distrib.isInDomain(discreteState.args_, max) ? `${max}]` : `${max})`;
      return `Domain: ${left}, ${right}`;
    });
    const results = [
      {
        name: "P(X=L)",
        value: "left"
      },
      {
        name: "P(X=R)",
        value: "right"
      },
      {
        name: "P(X≤L)",
        value: "below"
      },
      {
        name: "P(X≥R)",
        value: "above"
      },
      {
        name: "P(X<L)",
        value: "belowExcl"
      },
      {
        name: "P(X>R)",
        value: "aboveExcl"
      },
      {
        name: "P(L≤X≤R)",
        value: "between"
      },
      {
        name: "P(X≤L or X≥R)",
        value: "outside"
      }
    ];
    const sortedVars = computed(() => sortArr(discreteState.vars_));
    const probResults = computed(() => {
      return discreteState.calcProb_(unref(sortedVars));
    });
    const cdfSuffix = computed(() => discreteState.calc_.toPercentage_ ? "%" : void 0);
    const chartData = computed(() => {
      const { chart_: { points_, extended_ } } = discreteState;
      const [L, R] = sortedVars.value;
      const ratio = extended_ / 200;
      const extendedWidth = Math.ceil((R - L) * ratio);
      const xLabels = R - L + 1 + 2 * extendedWidth <= points_ || points_ === 0 ? arange(L - extendedWidth, R + extendedWidth, 1, round) : linspace(L - extendedWidth, R + extendedWidth, points_, round);
      const pmf = Array(R - L + 1 + 2 * extendedWidth);
      for (let i = 0; i < pmf.length; i++) {
        pmf[i] = discreteState.pdf_(xLabels[i]);
      }
      const yData = [
        {
          data: pmf,
          backgroundColor: "#0c03"
        }
      ];
      return {
        labels: xLabels,
        datasets: yData
      };
    });
    const isChartSettingsActive = ref(false);
    const settingsTabItems = [
      {
        text: "圖表",
        value: "chart"
      },
      {
        text: "計算",
        value: "calc"
      }
    ];
    const settingsTab = ref(
      settingsTabItems[0].value
    );
    const extendedRatio = computed({
      get() {
        return discreteState.chart_.extended_;
      },
      set(val) {
        if (!isNaN(val))
          discreteState.chart_.extended_ = val;
      }
    });
    const extendedRatioKeydown = vuetifyInputKeydownWrapper(
      1,
      5,
      extendedRatio,
      { min: 0, max: 100 }
    );
    const points = computed({
      get() {
        return discreteState.chart_.points_;
      },
      set(val) {
        if (!isNaN(val))
          discreteState.chart_.points_ = val;
      }
    });
    const pointsKeydown = vuetifyInputKeydownWrapper(
      50,
      100,
      points,
      { min: 50, max: 2e3 }
    );
    const place = computed({
      get() {
        return discreteState.calc_.place_;
      },
      set(val) {
        if (!isNaN(val) && Number.isInteger(val))
          discreteState.calc_.place_ = val;
      }
    });
    const chartGrid = ref(true);
    const chartOptions = reactive({
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const x = context.parsed.x;
              const belong = [];
              if (x <= sortedVars.value[0]) belong.push("below");
              if (sortedVars.value[0] <= x && x <= sortedVars.value[1]) belong.push("between");
              if (x >= sortedVars.value[1]) belong.push("above");
              return `${context.parsed.y} (${belong.join(",")})`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: chartGrid.value
          }
        },
        y: {
          min: 0,
          grid: {
            display: chartGrid.value
          }
        }
      }
    });
    watch(chartGrid, (newVal) => {
      chartOptions.scales.x.grid.display = newVal;
      chartOptions.scales.y.grid.display = newVal;
    });
    return (_ctx, _cache) => {
      const _component_VChart = __nuxt_component_0$1;
      return openBlock(), createBlock(VContainer, {
        class: "d-flex flex-column h-100 pa-0 bg-white",
        "max-width": "950"
      }, {
        default: withCtx(() => [
          createVNode(VRow, { noGutters: "" }, {
            default: withCtx(() => [
              createVNode(VCol, { class: "elevation-3 px-2 py-4 d-flex flex-wrap justify-space-evenly align-content-start" }, {
                default: withCtx(() => [
                  createVNode(_component_VChart, {
                    type: "bar",
                    data: unref(chartData),
                    options: unref(chartOptions)
                  }, {
                    title: withCtx(() => [
                      _cache[0] || (setBlockTracking(-1, true), (_cache[0] = createBaseVNode("div", { class: "text-center" }, [
                        _cache[13] || (_cache[13] = createTextVNode(" Partical Mass Function ")),
                        createVNode(VIcon, {
                          class: "float-right cursor-pointer",
                          icon: "mdi-cog",
                          onClick: ($event) => isChartSettingsActive.value = true
                        }, null, 8, ["onClick"])
                      ])).cacheIndex = 0, setBlockTracking(1), _cache[0])
                    ]),
                    _: 1
                  }, 8, ["data", "options"]),
                  createVNode(VDialog, {
                    modelValue: unref(isChartSettingsActive),
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => isRef(isChartSettingsActive) ? isChartSettingsActive.value = $event : null),
                    "max-width": "300",
                    "min-height": "400"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, null, {
                        default: withCtx(() => [
                          createVNode(VCardTitle, {
                            tag: "h2",
                            class: "font-weight-bold bg-primary d-flex align-center justify-space-between"
                          }, {
                            default: withCtx(() => [
                              _cache[14] || (_cache[14] = createTextVNode(" 設定 ")),
                              createVNode(VBtn, {
                                icon: "mdi-close",
                                density: "compact",
                                variant: "text",
                                onClick: _cache[1] || (_cache[1] = ($event) => isChartSettingsActive.value = false)
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(VTabs, {
                            modelValue: unref(settingsTab),
                            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => isRef(settingsTab) ? settingsTab.value = $event : null),
                            class: "flex-0-0-100",
                            items: settingsTabItems,
                            "bg-color": "blue-grey-darken-2",
                            color: "white",
                            grow: "",
                            "hide-slider": ""
                          }, {
                            default: withCtx(() => [
                              (openBlock(), createElementBlock(Fragment, null, renderList(settingsTabItems, (page) => {
                                return createVNode(VTab, {
                                  key: page.value,
                                  class: "text-body-1",
                                  value: page.value,
                                  "base-color": "blue-grey-lighten-3",
                                  variant: "tonal",
                                  ripple: false
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(page.text), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["value"]);
                              }), 64))
                            ]),
                            _: 1
                          }, 8, ["modelValue"]),
                          createVNode(VCardText, { class: "overflow-y-auto overflow-x-hidden pt-2" }, {
                            default: withCtx(() => [
                              unref(settingsTab) === "chart" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                                createVNode(VSwitch, {
                                  modelValue: unref(chartGrid),
                                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => isRef(chartGrid) ? chartGrid.value = $event : null)
                                }, {
                                  prepend: withCtx(({ id }) => [
                                    createVNode(VLabel, {
                                      for: id.value,
                                      class: "ps-0 opacity-100 text-black",
                                      style: { "width": "100px" },
                                      text: "格線"
                                    }, null, 8, ["for"])
                                  ]),
                                  _: 1
                                }, 8, ["modelValue"]),
                                createVNode(__nuxt_component_1, {
                                  label: "延伸範圍",
                                  min: "0",
                                  max: "100",
                                  suffix: "%",
                                  "model-value": unref(extendedRatio),
                                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => extendedRatio.value = +$event),
                                  onKeydown: unref(extendedRatioKeydown)
                                }, {
                                  prepend: withCtx(({ props, text }) => [
                                    createBaseVNode("div", mergeProps(props, { class: "text-left" }), toDisplayString(text), 17)
                                  ]),
                                  _: 1
                                }, 8, ["model-value", "onKeydown"]),
                                createVNode(__nuxt_component_1, {
                                  label: "數量",
                                  min: "50",
                                  max: "2000",
                                  step: "50",
                                  "model-value": unref(points),
                                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => points.value = +$event),
                                  onKeydown: unref(pointsKeydown)
                                }, {
                                  prepend: withCtx(({ props, text }) => [
                                    createBaseVNode("div", mergeProps(props, { class: "text-left" }), toDisplayString(text), 17)
                                  ]),
                                  _: 1
                                }, 8, ["model-value", "onKeydown"])
                              ], 64)) : unref(settingsTab) === "calc" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                                createVNode(VSwitch, {
                                  modelValue: unref(discreteState).calc_.toPercentage_,
                                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => unref(discreteState).calc_.toPercentage_ = $event)
                                }, {
                                  prepend: withCtx(({ id }) => [
                                    createVNode(VLabel, {
                                      for: id.value,
                                      class: "ps-0 opacity-100 text-black",
                                      style: { "width": "100px" },
                                      text: "百分比"
                                    }, null, 8, ["for"])
                                  ]),
                                  _: 1
                                }, 8, ["modelValue"]),
                                createVNode(__nuxt_component_1, {
                                  label: "小數位數",
                                  min: "0",
                                  max: "10",
                                  step: "1",
                                  "model-value": unref(place),
                                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => place.value = +$event)
                                }, {
                                  prepend: withCtx(({ props, text }) => [
                                    createBaseVNode("div", mergeProps(props, { class: "text-left" }), toDisplayString(text), 17)
                                  ]),
                                  _: 1
                                }, 8, ["model-value"])
                              ], 64)) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  _cache[9] || (setBlockTracking(-1, true), (_cache[9] = createVNode(__nuxt_component_0, {
                    class: "w-100 font-weight-bold",
                    label: "計算結果",
                    icon: "information-outline"
                  }, {
                    default: withCtx(() => [
                      createVNode(VTooltip, {
                        activator: "parent",
                        location: "bottom"
                      }, {
                        default: withCtx(() => [
                          createBaseVNode("div", null, " L=min(p1,p2)=" + toDisplayString(unref(sortedVars)[0]), 1),
                          createBaseVNode("div", null, " R=max(p1,p2)=" + toDisplayString(unref(sortedVars)[1]), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })).cacheIndex = 9, setBlockTracking(1), _cache[9]),
                  (openBlock(), createElementBlock(Fragment, null, renderList(results, (param) => {
                    return createVNode(__nuxt_component_1, {
                      key: param.name,
                      class: "flex-0-0",
                      param,
                      readonly: "",
                      variant: "solo",
                      flat: "",
                      suffix: unref(cdfSuffix),
                      "model-value": unref(probResults)[param.value]
                    }, null, 8, ["param", "suffix", "model-value"]);
                  }), 64))
                ]),
                _: 1
              }),
              createVNode(VCol, {
                class: "border rounded-md px-2 py-4",
                cols: "4"
              }, {
                default: withCtx(() => [
                  _cache[10] || (setBlockTracking(-1, true), (_cache[10] = withDirectives(createVNode(__nuxt_component_0, {
                    class: "font-weight-bold",
                    label: "參數",
                    icon: "information-outline"
                  }, null, 512), [
                    [Tooltip, "最大、最小值將自動調整", "bottom"]
                  ])).cacheIndex = 10, setBlockTracking(1), _cache[10]),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(discreteState).paramRanges_, (param) => {
                    return openBlock(), createBlock(__nuxt_component_1, {
                      key: param.name,
                      param,
                      "model-value": unref(discreteState).args_[param.name],
                      "onUpdate:modelValue": ($event) => unref(discreteState).setArg_(param.name, +$event)
                    }, null, 8, ["param", "model-value", "onUpdate:modelValue"]);
                  }), 128)),
                  createVNode(VDivider, { class: "my-3" }),
                  withDirectives(createVNode(__nuxt_component_0, {
                    class: "font-weight-bold",
                    label: "變數",
                    icon: "information-outline"
                  }, null, 512), [
                    [Tooltip, unref(varsTooltip), "bottom"]
                  ]),
                  createVNode(__nuxt_component_1, {
                    label: "p1=",
                    param: unref(discreteState).varDomain_,
                    "model-value": unref(discreteState).vars_[0],
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => unref(discreteState).setVars_(0, $event))
                  }, null, 8, ["param", "model-value"]),
                  createVNode(__nuxt_component_1, {
                    label: "p2=",
                    param: unref(discreteState).varDomain_,
                    "model-value": unref(discreteState).vars_[1],
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => unref(discreteState).setVars_(1, $event))
                  }, null, 8, ["param", "model-value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
