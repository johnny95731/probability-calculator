import { v as openBlock, x as createElementBlock, a0 as createStaticVNode, a1 as defineStore, d as defineComponent, Y as renderSlot, M as createCommentVNode, y as createBaseVNode, K as Fragment, J as renderList, C as createTextVNode, z as toDisplayString, i as computed, F as createBlock, B as withCtx, A as createVNode, G as unref, H as setBlockTracking, t as useHead, N as withDirectives, a2 as vShow } from "./CLygsIoC.js";
import { _ as _export_sfc } from "./1tPrXgE0.js";
import { V as VCol, d as VDivider, e as VRow, b as __nuxt_component_0$1, _ as __nuxt_component_1 } from "./Aa-mRKeE.js";
import { c as clip } from "./ChaVi1sj.js";
import { u as useLayoutTabsStore } from "./J586zhkH.js";
import { V as VContainer } from "./BfKDNlkB.js";
import "./iovqoryD.js";
import "./D7h6Q_jA.js";
import "./BOPhn_H-.js";
import "./CUPcO2LI.js";
const _sfc_main$5 = {};
const _hoisted_1$3 = {
  xmlns: "http://www.w3.org/2000/svg",
  version: "1.1",
  viewBox: "0 0 360 240",
  "stroke-width": "1",
  width: "100%",
  fill: "none",
  style: { "aspect-ratio": "9 / 5" }
};
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$3, _cache[0] || (_cache[0] = [
    createStaticVNode('<circle cx="130" cy="120" r="100" fill="#ff7"></circle><circle cx="230" cy="120" r="100" fill="#7ff"></circle><path d="M180 33 a100 100 0 0 0 0 174 a100 100 0 0 0 0 -174 z" fill="#7fff80"></path><circle cx="130" cy="120" r="100" stroke="#000"></circle><circle cx="230" cy="120" r="100" stroke="#000"></circle><rect x="0" y="0" width="360" height="240" stroke="#000"></rect><g text-anchor="middle" stroke="none" fill="#000" font-size="30px" font-weight="bold"><text x="90" y="132">A</text><text x="180" y="132">A⋂B</text><text x="270" y="132">B</text></g>', 7)
  ]));
}
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$5, [["render", _sfc_render]]), { __name: "EulerDiagram" });
const isValidProb = (val) => {
  return val >= 0 && val <= 1;
};
const rEventArgKeys = [
  "a",
  "b",
  "u",
  "i",
  "s",
  "p",
  "c",
  "ci"
];
const rEventParamNameBiMap = {
  a: "A",
  b: "B",
  u: "A⋃B",
  i: "A⋂B",
  p: "A'",
  c: "A|B",
  ci: "B|A"
};
rEventArgKeys.forEach((key) => rEventParamNameBiMap[rEventParamNameBiMap[key]] = key);
const createREventOption = (argsNames_, formula) => {
  const hasUnion = argsNames_.includes("u");
  const hasIntersection = argsNames_.includes("i");
  const validators = [probValidator];
  if (hasUnion) validators.push(unionValidator);
  if (hasIntersection) validators.push(intersectionValidator);
  return {
    keys: argsNames_,
    validator: validators,
    formula
  };
};
const probValidator = (args2) => {
  return Object.values(args2).every((val) => isValidProb(val)) ? null : "事件機率需介於0~1。";
};
const unionValidator = (args2) => {
  const isValid = !(args2.a > args2.u) && !(args2.b > args2.u);
  return isValid ? null : "事件聯集的機率不能小於個別事件發生的機率。";
};
const intersectionValidator = (args2) => {
  const isValid = !(args2.a < args2.i) && !(args2.b < args2.i);
  return isValid ? null : "事件交集的機率不能大於個別事件發生的機率。";
};
const targets$1 = [
  "A",
  "A⋂B",
  "A⋃B",
  "AΔB"
];
const optionsOfTargets$1 = {
  "A": [
    createREventOption(["p"], (args2) => {
      return [
        "1 - P(A')",
        `1 - ${args2.p}`,
        // @ts-expect-error
        `${1 - args2.p}`
      ];
    }),
    createREventOption(["b", "i"], (args2) => {
      return [
        "P(A⋂B) / P(B)",
        `${args2.i} / ${args2.b}`,
        // @ts-expect-error
        `${args2.i / args2.b}`
      ];
    }),
    createREventOption(["b", "u"], (args2) => {
      return [
        "P(A⋂B') / P(B')",
        "(P(A⋃B) - P(B)) / (1 - P(B))",
        `(${args2.u} - ${args2.b}) / (1 - ${args2.b})`,
        // @ts-expect-error
        `${(args2.u - args2.b) / (1 - args2.b)}`
      ];
    })
  ],
  "A⋂B": [
    createREventOption(["a", "u"], (args2) => {
      return [
        "(P(A⋃B) - P(A)) * P(A) / (1 - P(A))",
        `(${args2.u} - ${args2.a}) * ${args2.a} / (1 - ${args2.a})`,
        // @ts-expect-error
        `${(args2.u - args2.a) * args2.a / (1 - args2.a)}`
      ];
    }),
    createREventOption(["b", "u"], (args2) => {
      return [
        "(P(A⋃B) - P(B)) * P(B) / (1 - P(B))",
        `(${args2.u} - ${args2.b}) * ${args2.b} / (1 - ${args2.b})`,
        // @ts-expect-error
        `${(args2.u - args2.b) * args2.b / (1 - args2.b)}`
      ];
    }),
    createREventOption(["a", "b"], (args2) => {
      return [
        "P(A) * P(B)",
        `${args2.a} * ${args2.b}`,
        // @ts-expect-error
        `${args2.a * args2.b}`
      ];
    })
  ],
  "A⋃B": [
    createREventOption(["a", "i"], (args2) => {
      return [
        "P(A) + P(B) - P(A⋂B)",
        "P(A) + P(A⋂B) / P(A) - P(A⋂B)",
        `${args2.a} + ${args2.i} / ${args2.a} - ${args2.i}`,
        // @ts-expect-error
        `${args2.a + args2.i / args2.a - args2.i}`
      ];
    }),
    createREventOption(["b", "i"], (args2) => {
      return [
        "P(A) + P(B) - P(A⋂B)",
        "P(A⋂B) / P(B) + P(B) - P(A⋂B)",
        `${args2.b} + ${args2.i} / ${args2.b} - ${args2.i}`,
        // @ts-expect-error
        `${args2.i / args2.b + args2.b - args2.i}`
      ];
    }),
    createREventOption(["a", "b"], (args2) => {
      return [
        "P(A) + P(B) - P(A⋂B)",
        "P(A) + P(B) - P(A) * P(B)",
        `${args2.a} + ${args2.b} - ${args2.a} * ${args2.b}`,
        // @ts-expect-error
        `${args2.b / args2.a + args2.a - args2.b}`
      ];
    })
  ],
  "AΔB": [
    createREventOption(["a", "i"], (args2) => {
      return [
        "P(A) + P(B) - 2 * P(A⋂B)",
        "P(A) + P(A⋂B) / P(A) - 2 * P(A⋂B)",
        `${args2.a} + ${args2.i} / ${args2.a} - 2 * ${args2.i}`,
        // @ts-expect-error
        `${args2.a + args2.i / args2.a - 2 * args2.i}`
      ];
    }),
    createREventOption(["b", "i"], (args2) => {
      return [
        "P(A) + P(B) - 2 * P(A⋂B)",
        "P(A⋂B) / P(B) + P(B) - 2 * P(A⋂B)",
        `${args2.i} / ${args2.b} + ${args2.b} - 2 * ${args2.i}`,
        // @ts-expect-error
        `${args2.b + args2.i / args2.b - 2 * args2.i}`
      ];
    }),
    createREventOption(["a", "b"], (args2) => {
      return [
        "P(A) + P(B) - 2 * P(A⋂B)",
        "P(A) + P(B) - 2 * P(A) * P(B)",
        `${args2.a} + ${args2.b} - 2 * ${args2.a} * ${args2.b}`,
        // @ts-expect-error
        `${args2.a + args2.b - 2 * args2.a * args2.b}`
      ];
    })
  ]
};
const useIndependentStore = defineStore("independent", {
  state: () => {
    const state = {
      target: targets$1[0],
      optionIdx: 0
    };
    for (const target of targets$1) {
      state[target] = [];
      optionsOfTargets$1[target].forEach((option, i) => {
        state[target][i] = option.keys.reduce((prev, key) => {
          prev[key] = 0;
          return prev;
        }, {});
      });
    }
    return state;
  },
  getters: {
    optionItem() {
      return optionsOfTargets$1[this.target][this.optionIdx];
    },
    params() {
      return this.optionItem.keys.map((key) => ({
        key,
        label: rEventParamNameBiMap[key]
      }));
    },
    formula() {
      return this.optionItem.formula(this.args);
    },
    /**
     * Current value of arguments
     */
    args() {
      return this[this.target][this.optionIdx];
    },
    result() {
      const formula = this.formula;
      return +formula[formula.length - 1];
    },
    errorMessage() {
      const resultMessage = isValidProb(this.result) ? null : `計算結果 P(${this.target})=${this.result} 無效。`;
      return [
        resultMessage,
        ...this.optionItem.validator.map((v) => v(this.args))
      ].join("\n");
    }
  },
  actions: {
    updateTarget(newTarget) {
      this.target = newTarget;
      this.optionIdx = 0;
    },
    setOption(idx) {
      this.optionIdx = +idx;
    },
    setArg(key, newVal) {
      if (!isNaN(+newVal))
        this.args[key] = clip(newVal, 0, 1);
    }
  }
});
const _hoisted_1$2 = { class: "formula-table" };
const _hoisted_2 = { key: 0 };
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "FormulaTable",
  props: {
    title: {},
    formula: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("table", _hoisted_1$2, [
        _ctx.title || _ctx.$slots.title ? (openBlock(), createElementBlock("caption", _hoisted_2, [
          renderSlot(_ctx.$slots, "title", {}, () => [
            createTextVNode(toDisplayString(_ctx.title), 1)
          ])
        ])) : createCommentVNode("", true),
        createBaseVNode("tbody", null, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.formula, (row, i) => {
            return openBlock(), createElementBlock("tr", { key: i }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(row, (text) => {
                return openBlock(), createElementBlock("td", {
                  key: `${i}-${text}`
                }, toDisplayString(text), 1);
              }), 128))
            ]);
          }), 128))
        ])
      ]);
    };
  }
});
const FormulaTable = Object.assign(_sfc_main$4, { __name: "FormulaTable" });
const _hoisted_1$1 = { class: "w-50 mx-auto" };
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "IndependentEvent",
  setup(__props) {
    const independentState = useIndependentStore();
    const targetItems = targets$1.map((target) => ({
      title: `P(${target})`,
      value: target
    }));
    const argOptionItems = targets$1.reduce((prev, target) => {
      prev[target] = optionsOfTargets$1[target].map((option, i) => ({
        title: option.keys.map((key) => `P(${rEventParamNameBiMap[key]})`).join(", "),
        value: i
      }));
      return prev;
    }, {});
    const currentArgs = computed({
      get() {
        return independentState[independentState.target][independentState.optionIdx];
      },
      set([key, naeVal]) {
        independentState.setArg(key, naeVal);
      }
    });
    const formula = computed(() => {
      return independentState.formula.map((text, i) => {
        if (i === 0) {
          return [`P(${independentState.target})`, "= " + text];
        }
        return [null, "= " + text];
      });
    });
    return (_ctx, _cache) => {
      const _component_EulerDiagram = __nuxt_component_0;
      const _component_ParamLabel = __nuxt_component_0$1;
      const _component_ParamInput = __nuxt_component_1;
      return openBlock(), createBlock(VRow, null, {
        default: withCtx(() => [
          createVNode(VCol, { class: "border rounded-md px-2 py-4 text-center" }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_1$1, [
                _cache[1] || (_cache[1] = createTextVNode(" Euler Diagram ")),
                createVNode(_component_EulerDiagram)
              ]),
              createVNode(_component_ParamLabel, {
                class: "w-100 font-weight-bold",
                label: "計算結果"
              }),
              createVNode(_component_ParamInput, {
                class: "mx-auto",
                label: "計算結果",
                type: "text",
                prependText: `P(${unref(independentState).target})=`,
                readonly: "",
                variant: "solo",
                flat: "",
                "model-value": unref(independentState).result,
                message: unref(independentState).errorMessage
              }, null, 8, ["prependText", "model-value", "message"]),
              createVNode(FormulaTable, {
                class: "mx-auto",
                title: "算式",
                formula: formula.value
              }, {
                title: withCtx(() => [
                  createVNode(_component_ParamLabel, {
                    class: "w-100 font-weight-bold",
                    label: "算式"
                  })
                ]),
                _: 1
              }, 8, ["formula"])
            ]),
            _: 1
          }),
          createVNode(VCol, {
            class: "border rounded-md px-2 py-4",
            cols: "4"
          }, {
            default: withCtx(() => [
              createVNode(_component_ParamInput, {
                type: "select",
                label: "目標",
                items: unref(targetItems),
                "model-value": unref(independentState).target,
                "onUpdate:modelValue": unref(independentState).updateTarget
              }, null, 8, ["items", "model-value", "onUpdate:modelValue"]),
              createVNode(VDivider, { class: "my-3" }),
              _cache[0] || (setBlockTracking(-1, true), (_cache[0] = createVNode(_component_ParamLabel, {
                class: "w-100 font-weight-bold",
                label: "參數"
              })).cacheIndex = 0, setBlockTracking(1), _cache[0]),
              createVNode(_component_ParamInput, {
                type: "select",
                label: "選項",
                items: unref(argOptionItems)[unref(independentState).target],
                "model-value": unref(independentState).optionIdx,
                "onUpdate:modelValue": unref(independentState).setOption
              }, null, 8, ["items", "model-value", "onUpdate:modelValue"]),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(independentState).params, ({ key, label }) => {
                return openBlock(), createBlock(_component_ParamInput, {
                  key,
                  label,
                  prependText: `P(${label})=`,
                  min: "0",
                  max: "1",
                  step: "any",
                  "model-value": currentArgs.value[key],
                  "onUpdate:modelValue": ($event) => unref(independentState).setArg(key, $event)
                }, null, 8, ["label", "prependText", "model-value", "onUpdate:modelValue"]);
              }), 128))
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
const IndependentEvent = Object.assign(_sfc_main$3, { __name: "EventProbabilityIndependentEvent" });
const targets = [
  "A",
  "A⋂B",
  "A⋃B",
  "AΔB",
  "A|B"
];
const optionsOfTargets = {
  "A": [
    createREventOption(["p"], (args2) => {
      return [
        "1 - P(A')",
        `1 - ${args2.p}`,
        // @ts-expect-error
        `${1 - args2.p}`
      ];
    }),
    createREventOption(["b", "i", "u"], (args2) => {
      return [
        "P(A⋃B) - P(B) + P(A⋂B)",
        `${args2.u} - ${args2.b} + ${args2.i}`,
        // @ts-expect-error
        `${args2.u - args2.b + args2.i}`
      ];
    }),
    createREventOption(["b", "ci"], (args2) => {
      return [
        "P(A⋂B) / P(B|A)",
        `${args2.i} / ${args2.ci}`,
        // @ts-expect-error
        `${args2.i / args2.ci}`
      ];
    })
  ],
  "A⋂B": [
    createREventOption(["a", "b", "u"], (args2) => {
      return [
        "P(A) + P(B) - P(A⋃B)",
        `${args2.a} + ${args2.b} - ${args2.u}`,
        // @ts-expect-error
        `${args2.a + args2.b - args2.u}`
      ];
    }),
    createREventOption(["b", "c"], (args2) => {
      return [
        "P(B) * P(A|B)",
        `${args2.b} * ${args2.c}`,
        // @ts-expect-error
        `${args2.b * args2.c}`
      ];
    }),
    createREventOption(["a", "ci"], (args2) => {
      return [
        "P(A) * P(B|A)",
        `${args2.a} * ${args2.ci}`,
        // @ts-expect-error
        `${args2.a * args2.ci}`
      ];
    })
  ],
  "A⋃B": [
    createREventOption(["a", "b", "i"], (args2) => {
      return [
        "P(A) + P(B) - P(A⋂B)",
        `${args2.a} + ${args2.b} - ${args2.i}`,
        // @ts-expect-error
        `${args2.a + args2.b - args2.i}`
      ];
    }),
    createREventOption(["a", "b", "c"], (args2) => {
      return [
        "P(A) + P(B) - P(A⋂B)",
        "P(A) + P(B) - P(B) * P(A|B)",
        `${args2.a} + ${args2.b} - ${args2.b} * ${args2.c}`,
        // @ts-expect-error
        `${args2.a + args2.b - args2.b * args2.c}`
      ];
    }),
    createREventOption(["a", "b", "ci"], (args2) => {
      return [
        "P(A) + P(B) - P(A⋂B)",
        "P(A) + P(B) - P(A) * P(B|A)",
        `${args2.a} + ${args2.b} - ${args2.a} * ${args2.ci}`,
        // @ts-expect-error
        `${args2.a + args2.b - args2.a * args2.ci}`
      ];
    })
  ],
  "A|B": [
    createREventOption(["b", "i"], (args2) => {
      return [
        "P(A⋂B) / P(B)",
        "P(A) + P(A⋂B) / P(A) - 2 * P(A⋂B)",
        `${args2.a} + ${args2.i} / ${args2.a} - 2 * ${args2.i}`,
        // @ts-expect-error
        `${args2.a + args2.i / args2.a - 2 * args2.i}`
      ];
    }),
    createREventOption(["a", "i", "u"], (args2) => {
      return [
        "P(A⋂B) / P(B)",
        "P(A⋂B) / (P(A⋃B) - P(A) + P(A⋂B))",
        `${args2.i} / (${args2.u} - ${args2.a} + ${args2.i})`,
        // @ts-expect-error
        `${args2.i / (args2.u - args2.a + args2.i)}`
      ];
    }),
    createREventOption(["a", "b", "u"], (args2) => {
      return [
        "P(A⋂B) / P(B)",
        "(P(A) + P(B) - P(A⋃B)) / P(B)",
        `(${args2.a} + ${args2.b} - ${args2.u}) / ${args2.b}`,
        // @ts-expect-error
        `${(args2.a + args2.b - args2.u) / args2.b}`
      ];
    }),
    createREventOption(["a", "b", "ci"], (args2) => {
      return [
        "P(B|A) * P(A) / P(B)",
        `${args2.ci} * ${args2.a} / ${args2.b}`,
        // @ts-expect-error
        `${args2.ci * args2.a / args2.b}`
      ];
    })
  ],
  "AΔB": [
    createREventOption(["a", "b", "i"], (args2) => {
      return [
        "P(A) + P(B) - 2 * P(A⋂B)",
        `${args2.a} + ${args2.b} - 2 * ${args2.i}`,
        // @ts-expect-error
        `${args2.a + args2.b - 2 * args2.i}`
      ];
    }),
    createREventOption(["a", "b", "u"], (args2) => {
      return [
        "P(A) + P(B) - 2 * P(A⋂B)",
        "P(A) + P(B) - 2 * (P(A) + P(B) - P(A⋃B))",
        `${args2.a} + ${args2.b} - 2 * (${args2.a} + ${args2.b} -${args2.u})`,
        // @ts-expect-error
        `${args2.a + args2.b - 2 * (args2.a + args2.b - args2.u)}`
      ];
    })
  ]
};
const useDependentStore = defineStore("dependent", {
  state: () => {
    const state = {
      target: targets[0],
      optionIdx: 0
    };
    for (const target of targets) {
      state[target] = [];
      optionsOfTargets[target].forEach((option, i) => {
        state[target][i] = option.keys.reduce((prev, key) => {
          prev[key] = 0;
          return prev;
        }, {});
      });
    }
    return state;
  },
  getters: {
    optionItem() {
      return optionsOfTargets[this.target][this.optionIdx];
    },
    params() {
      return this.optionItem.keys.map((key) => ({
        key,
        label: rEventParamNameBiMap[key]
      }));
    },
    formula() {
      return this.optionItem.formula(this.args);
    },
    /**
     * Current value of arguments
     */
    args() {
      return this[this.target][this.optionIdx];
    },
    result() {
      const formula = this.formula;
      return +formula[formula.length - 1];
    },
    errorMessage() {
      const resultMessage = isValidProb(this.result) ? null : `計算結果 P(${this.target})=${this.result} 無效。`;
      return [
        resultMessage,
        ...this.optionItem.validator.map((v) => v(this.args))
      ].join("\n");
    }
  },
  actions: {
    updateTarget(newTarget) {
      this.target = newTarget;
      this.optionIdx = 0;
    },
    setOption(idx) {
      this.optionIdx = +idx;
    },
    setArg(key, newVal) {
      if (!isNaN(+newVal))
        this.args[key] = clip(newVal, 0, 1);
    }
  }
});
const _hoisted_1 = { class: "w-50 mx-auto" };
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "DependentEvent",
  setup(__props) {
    const dependentState = useDependentStore();
    const targetItems = targets.map((target) => ({
      title: `P(${target})`,
      value: target
    }));
    const argOptionItems = targets.reduce((prev, target) => {
      prev[target] = optionsOfTargets[target].map((option, i) => ({
        title: option.keys.map((key) => `P(${rEventParamNameBiMap[key]})`).join(", "),
        value: i
      }));
      return prev;
    }, {});
    const currentArgs = computed({
      get() {
        return dependentState[dependentState.target][dependentState.optionIdx];
      },
      set([key, naeVal]) {
        dependentState.setArg(key, naeVal);
      }
    });
    const formula = computed(() => {
      return dependentState.formula.map((text, i) => {
        if (i === 0) {
          return [`P(${dependentState.target})`, "= " + text];
        }
        return [null, "= " + text];
      });
    });
    return (_ctx, _cache) => {
      const _component_EulerDiagram = __nuxt_component_0;
      const _component_ParamLabel = __nuxt_component_0$1;
      const _component_ParamInput = __nuxt_component_1;
      return openBlock(), createBlock(VRow, null, {
        default: withCtx(() => [
          createVNode(VCol, { class: "border rounded-md px-2 py-4 text-center" }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_1, [
                _cache[1] || (_cache[1] = createTextVNode(" Euler Diagram ")),
                createVNode(_component_EulerDiagram)
              ]),
              createVNode(_component_ParamLabel, {
                class: "w-100 font-weight-bold",
                label: "計算結果"
              }),
              createVNode(_component_ParamInput, {
                class: "mx-auto",
                label: "計算結果",
                type: "text",
                prependText: `P(${unref(dependentState).target})=`,
                readonly: "",
                variant: "solo",
                flat: "",
                "model-value": unref(dependentState).result,
                message: unref(dependentState).errorMessage
              }, null, 8, ["prependText", "model-value", "message"]),
              createVNode(FormulaTable, {
                class: "mx-auto",
                title: "算式",
                formula: unref(formula)
              }, {
                title: withCtx(() => [
                  createVNode(_component_ParamLabel, {
                    class: "w-100 font-weight-bold",
                    label: "算式"
                  })
                ]),
                _: 1
              }, 8, ["formula"])
            ]),
            _: 1
          }),
          createVNode(VCol, {
            class: "border rounded-md px-2 py-4",
            cols: "4"
          }, {
            default: withCtx(() => [
              createVNode(_component_ParamInput, {
                type: "select",
                label: "目標",
                items: unref(targetItems),
                "model-value": unref(dependentState).target,
                "onUpdate:modelValue": unref(dependentState).updateTarget
              }, null, 8, ["items", "model-value", "onUpdate:modelValue"]),
              createVNode(VDivider, { class: "my-3" }),
              _cache[0] || (setBlockTracking(-1, true), (_cache[0] = createVNode(_component_ParamLabel, {
                class: "w-100 font-weight-bold",
                label: "參數"
              })).cacheIndex = 0, setBlockTracking(1), _cache[0]),
              createVNode(_component_ParamInput, {
                type: "select",
                label: "選項",
                items: unref(argOptionItems)[unref(dependentState).target],
                "model-value": unref(dependentState).optionIdx,
                "onUpdate:modelValue": unref(dependentState).setOption
              }, null, 8, ["items", "model-value", "onUpdate:modelValue"]),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(dependentState).params, ({ key, label }) => {
                return openBlock(), createBlock(_component_ParamInput, {
                  key,
                  label,
                  prependText: `P(${label})=`,
                  min: "0",
                  max: "1",
                  step: "any",
                  "model-value": unref(currentArgs)[key],
                  "onUpdate:modelValue": ($event) => unref(dependentState).setArg(key, $event)
                }, null, 8, ["label", "prependText", "model-value", "onUpdate:modelValue"]);
              }), 128))
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
const DependentEvent = Object.assign(_sfc_main$2, { __name: "EventProbabilityDependentEvent" });
const args = [
  "A",
  "B",
  "B|A"
];
const useBayesStore = defineStore("bayes", {
  state: () => {
    return args.reduce((prev, name) => {
      prev[name] = 0;
      return prev;
    }, {});
  },
  getters: {
    result() {
      return this.A * this["B|A"] / this.B;
    }
  },
  actions: {
    updateArg(key, newVal) {
      this[key] = clip(newVal, 0, 1);
    }
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BayesTheorem",
  setup(__props) {
    const labels = args.map((name) => `P(${name})=`);
    const bayesState = useBayesStore();
    return (_ctx, _cache) => {
      const _component_ParamLabel = __nuxt_component_0$1;
      const _component_ParamInput = __nuxt_component_1;
      return openBlock(), createBlock(VRow, null, {
        default: withCtx(() => [
          createVNode(VCol, {
            class: "border rounded-md px-2 py-4 bg-white",
            cols: "5"
          }, {
            default: withCtx(() => [
              _cache[0] || (setBlockTracking(-1, true), (_cache[0] = createVNode(_component_ParamLabel, {
                class: "w-100 font-weight-bold",
                label: "參數"
              })).cacheIndex = 0, setBlockTracking(1), _cache[0]),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(args), (name, i) => {
                return openBlock(), createBlock(_component_ParamInput, {
                  key: name,
                  label: name,
                  "prepend-text": unref(labels)[i],
                  min: "0",
                  max: "1",
                  step: "any",
                  "model-value": unref(bayesState)[name],
                  "onUpdate:modelValue": ($event) => unref(bayesState).updateArg(name, $event)
                }, null, 8, ["label", "prepend-text", "model-value", "onUpdate:modelValue"]);
              }), 128)),
              createVNode(VDivider, { class: "my-3" })
            ]),
            _: 1
          }),
          createVNode(VCol, { class: "border rounded-md px-2 py-4 bg-white" }, {
            default: withCtx(() => [
              createVNode(_component_ParamLabel, {
                class: "w-100 font-weight-bold",
                label: "結果"
              }),
              createVNode(_component_ParamInput, {
                label: "結果",
                "prepend-text": "P(A|B)=",
                readonly: "",
                "model-value": unref(bayesState).result
              }, null, 8, ["model-value"])
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
const BayesTheorem = Object.assign(_sfc_main$1, { __name: "EventProbabilityBayesTheorem" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "event-probability",
  setup(__props) {
    useHead({
      title: "Probability Calculator - Event Probability"
    });
    const layoutTabState = useLayoutTabsStore();
    const currentIdx = computed(() => layoutTabState.tabIdx_);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(VContainer, {
        class: "d-flex flex-column h-100 pa-0 bg-white",
        "max-width": "950"
      }, {
        default: withCtx(() => [
          withDirectives(createVNode(IndependentEvent, null, null, 512), [
            [vShow, unref(currentIdx) === 0]
          ]),
          withDirectives(createVNode(DependentEvent, null, null, 512), [
            [vShow, unref(currentIdx) === 1]
          ]),
          withDirectives(createVNode(BayesTheorem, null, null, 512), [
            [vShow, unref(currentIdx) === 2]
          ])
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
