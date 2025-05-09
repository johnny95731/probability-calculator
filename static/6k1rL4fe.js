import { V as VCol, a as VLabel, _ as __nuxt_component_1, b as __nuxt_component_0$1, c as VTooltip, d as VDivider, e as VRow } from "./Aa-mRKeE.js";
import { u as useContinuousStore } from "./D7h6Q_jA.js";
import { _ as __nuxt_component_0, V as VDialog, a as VSwitch, T as Tooltip, d as defaultLineDataset } from "./BjjwOIE0.js";
import { r as round, i as isNullish, s as sortArr, l as linspace, v as vuetifyInputKeydownWrapper } from "./ChaVi1sj.js";
import { d as defineComponent, t as useHead, i as computed, r as ref, D as reactive, E as watch, v as openBlock, F as createBlock, B as withCtx, A as createVNode, G as unref, H as setBlockTracking, y as createBaseVNode, C as createTextVNode, I as isRef, x as createElementBlock, J as renderList, K as Fragment, z as toDisplayString, L as mergeProps, M as createCommentVNode, N as withDirectives } from "./CLygsIoC.js";
import { V as VContainer } from "./BfKDNlkB.js";
import { V as VIcon } from "./iovqoryD.js";
import { V as VCard, a as VCardTitle, b as VCardText } from "./CDB1RMSL.js";
import { V as VBtn, a as VTabs, b as VTab } from "./dwKav9SY.js";
import "./CzYvQyrK.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "continuous-distribution",
  setup(__props) {
    useHead({
      title: "Probability Calculator - Continuous Probability Distribution"
    });
    const continuousState = useContinuousStore();
    const varsTooltip = computed(() => {
      const distrib = continuousState.distribution_;
      const { min, max } = continuousState.varDomain_;
      const left = isNullish(min) ? "(-∞" : distrib.isInDomain(continuousState.args_, min) ? `[${min}` : `(${min}`;
      const right = isNullish(max) ? "∞)" : distrib.isInDomain(continuousState.args_, max) ? `${max}]` : `${max})`;
      return `Domain: ${left}, ${right}`;
    });
    const pdf = [
      {
        name: "pdf(L)=",
        value: "left"
      },
      {
        name: "pdf(R)=",
        value: "right"
      }
    ];
    const cummulation = [
      {
        name: "P(X≤L)=",
        value: "below"
      },
      {
        name: "P(X≥R)=",
        value: "above"
      },
      {
        name: "P(L≤X≤R)=",
        value: "between"
      },
      {
        name: "P(X≤L or X≥R)=",
        value: "outside"
      }
    ];
    const sortedVars = computed(() => sortArr(continuousState.vars_));
    const probResults = computed(() => {
      return continuousState.calcProb_(unref(sortedVars));
    });
    const cdfSuffix = computed(() => continuousState.calc_.toPercentage_ ? "%" : void 0);
    const chartData = computed(() => {
      const { calc_: { place_ }, chart_: { points_, extended_ } } = continuousState;
      const round_ = (val) => round(val, place_);
      const [L, R] = sortedVars.value;
      const ratio = extended_ / 200;
      const extendedLength = (R - L) * ratio;
      const countsOutside = round(points_ * ratio);
      const countsBetween = points_ - countsOutside;
      const xLabels = [
        ...linspace(L - extendedLength, L, countsOutside, round_),
        ...linspace(L, R, countsBetween, round_),
        ...linspace(R, R + extendedLength, countsOutside, round_)
      ];
      const below = Array(countsOutside);
      const between = Array(points_);
      const above = Array(countsBetween + 2 * countsOutside);
      if (countsOutside > 0) {
        between.length -= 1;
        xLabels.splice(between.length, 1);
        xLabels.splice(below.length, 1);
      }
      let i = 0, j = between.length - 1, k = below.length - 1;
      for (; i < countsOutside; i++, j++, k++) {
        below[i] = continuousState.pdf_(xLabels[i]);
        above[j] = continuousState.pdf_(xLabels[j]);
        between[k] = continuousState.pdf_(xLabels[k]);
      }
      for (; k < points_; k++) {
        between[k] = continuousState.pdf_(xLabels[k]);
      }
      const yData = [
        {
          ...defaultLineDataset,
          label: "below",
          data: below,
          borderColor: "#c00",
          backgroundColor: "#c003"
        },
        {
          ...defaultLineDataset,
          label: "between",
          data: between,
          borderColor: "#0c0",
          backgroundColor: "#0c03"
        },
        {
          ...defaultLineDataset,
          label: "above",
          data: above,
          borderColor: "#00c",
          backgroundColor: "#00c3"
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
        return continuousState.chart_.extended_;
      },
      set(val) {
        if (!isNaN(val))
          continuousState.chart_.extended_ = val;
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
        return continuousState.chart_.points_;
      },
      set(val) {
        if (!isNaN(val))
          continuousState.chart_.points_ = val;
      }
    });
    const pointsKeydown = vuetifyInputKeydownWrapper(
      50,
      100,
      points,
      { min: 50, max: 2e3 }
    );
    const chartPlace = computed({
      get() {
        return continuousState.chart_.place_;
      },
      set(val) {
        if (!isNaN(val) && Number.isInteger(val))
          continuousState.chart_.place_ = val;
      }
    });
    const place = computed({
      get() {
        return continuousState.calc_.place_;
      },
      set(val) {
        if (!isNaN(val) && Number.isInteger(val))
          continuousState.calc_.place_ = val;
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
              return round(this.getLabelForValue(val), chartPlace.value);
            }
          }
        },
        y: {
          min: 0,
          border: {
            display: false
          },
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
    watch(chartPlace, (newVal) => {
      chartOptions.scales.x.ticks.callback = function(val) {
        return round(this.getLabelForValue(val), newVal);
      };
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(VContainer, {
        class: "d-flex flex-column h-100 pa-0 bg-white",
        "max-width": "950"
      }, {
        default: withCtx(() => [
          createVNode(VRow, { noGutters: "" }, {
            default: withCtx(() => [
              createVNode(VCol, { class: "px-2 py-4 d-flex flex-wrap justify-space-evenly align-content-start" }, {
                default: withCtx(() => [
                  createVNode(__nuxt_component_0, {
                    data: unref(chartData),
                    options: unref(chartOptions)
                  }, {
                    title: withCtx(() => [
                      _cache[0] || (setBlockTracking(-1, true), (_cache[0] = createBaseVNode("div", { class: "text-center" }, [
                        _cache[15] || (_cache[15] = createTextVNode(" Partical Distributonp Function ")),
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
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => isRef(isChartSettingsActive) ? isChartSettingsActive.value = $event : null),
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
                              _cache[16] || (_cache[16] = createTextVNode(" 設定 ")),
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
                                  modelValue: unref(chartOptions).plugins.legend,
                                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(chartOptions).plugins.legend = $event)
                                }, {
                                  prepend: withCtx(({ id }) => [
                                    createVNode(VLabel, {
                                      for: id.value,
                                      class: "ps-0 opacity-100 text-black",
                                      style: { "width": "100px" },
                                      text: "顯示圖例"
                                    }, null, 8, ["for"])
                                  ]),
                                  _: 1
                                }, 8, ["modelValue"]),
                                createVNode(VSwitch, {
                                  modelValue: unref(chartGrid),
                                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => isRef(chartGrid) ? chartGrid.value = $event : null)
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
                                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => extendedRatio.value = +$event),
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
                                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => points.value = +$event),
                                  onKeydown: unref(pointsKeydown)
                                }, {
                                  prepend: withCtx(({ props, text }) => [
                                    createBaseVNode("div", mergeProps(props, { class: "text-left" }), toDisplayString(text), 17)
                                  ]),
                                  _: 1
                                }, 8, ["model-value", "onKeydown"]),
                                createVNode(__nuxt_component_1, {
                                  label: "小數位數",
                                  min: "0",
                                  max: "10",
                                  step: "1",
                                  "model-value": unref(chartPlace),
                                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => chartPlace.value = +$event)
                                }, {
                                  prepend: withCtx(({ props, text }) => [
                                    createBaseVNode("div", mergeProps(props, { class: "text-left" }), toDisplayString(text), 17)
                                  ]),
                                  _: 1
                                }, 8, ["model-value"])
                              ], 64)) : unref(settingsTab) === "calc" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                                createVNode(VSwitch, {
                                  modelValue: unref(continuousState).calc_.toPercentage_,
                                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => unref(continuousState).calc_.toPercentage_ = $event)
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
                                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => place.value = +$event)
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
                  _cache[11] || (setBlockTracking(-1, true), (_cache[11] = createVNode(__nuxt_component_0$1, {
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
                  })).cacheIndex = 11, setBlockTracking(1), _cache[11]),
                  (openBlock(), createElementBlock(Fragment, null, renderList(pdf, (param) => {
                    return createVNode(__nuxt_component_1, {
                      key: param.name,
                      class: "flex-0-0",
                      param,
                      readonly: "",
                      variant: "solo",
                      flat: "",
                      "model-value": unref(probResults)[param.value]
                    }, null, 8, ["param", "model-value"]);
                  }), 64)),
                  (openBlock(), createElementBlock(Fragment, null, renderList(cummulation, (param) => {
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
                  _cache[12] || (setBlockTracking(-1, true), (_cache[12] = withDirectives(createVNode(__nuxt_component_0$1, {
                    class: "font-weight-bold",
                    label: "參數",
                    icon: "information-outline"
                  }, null, 512), [
                    [Tooltip, "最大、最小值將自動調整", "bottom"]
                  ])).cacheIndex = 12, setBlockTracking(1), _cache[12]),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(continuousState).paramRanges_, (param) => {
                    return openBlock(), createBlock(__nuxt_component_1, {
                      key: param.name,
                      param,
                      "model-value": unref(continuousState).args_[param.name],
                      "onUpdate:modelValue": ($event) => unref(continuousState).setArg_(param.name, $event)
                    }, null, 8, ["param", "model-value", "onUpdate:modelValue"]);
                  }), 128)),
                  createVNode(VDivider, { class: "my-3" }),
                  withDirectives(createVNode(__nuxt_component_0$1, {
                    class: "font-weight-bold",
                    label: "變數",
                    icon: "information-outline"
                  }, null, 512), [
                    [Tooltip, unref(varsTooltip), "bottom"]
                  ]),
                  createVNode(__nuxt_component_1, {
                    label: "p1=",
                    param: unref(continuousState).varDomain_,
                    "model-value": unref(continuousState).vars_[0],
                    "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => unref(continuousState).setVars_(0, $event))
                  }, null, 8, ["param", "model-value"]),
                  createVNode(__nuxt_component_1, {
                    label: "p2=",
                    param: unref(continuousState).varDomain_,
                    "model-value": unref(continuousState).vars_[1],
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => unref(continuousState).setVars_(1, $event))
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
