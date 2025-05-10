import { defineStore } from 'pinia';
import { clip } from 'utils/numeric';
import { rEventParamNameBiMap, createREventOption, isValidProb } from 'utils/probability';
import type { REventArgs, REventOption, REventParamKey, REventParamLabel, Validator } from 'utils/probability';

/**
 * The target value that be calculated.
 */
export const targets = [
  'A', 'A⋂B', 'A⋃B', 'AΔB'
] as const satisfies REventParamLabel[];
export type Target = typeof targets[number];

export const optionsOfTargets = {
  'A': [
    createREventOption(['p'], (args) => {
      return [
        '1 - P(A\')',
        `1 - ${args.p}`,
        // @ts-expect-error
        `${1 - args.p}`,
      ];
    }),
    createREventOption(['b', 'i'], (args) => {
      return [
        'P(A⋂B) / P(B)',
        `${args.i} / ${args.b}`,
        // @ts-expect-error
        `${args.i / args.b}`,
      ];
    }),
    createREventOption(['b', 'u'], (args) => {
      return [
        'P(A⋂B\') / P(B\')',
        '(P(A⋃B) - P(B)) / (1 - P(B))',
        `(${args.u} - ${args.b}) / (1 - ${args.b})`,
        // @ts-expect-error
        `${(args.u - args.b) / (1 - args.b)}`,
      ];
    }),
  ],
  'A⋂B': [
    createREventOption(['a', 'u'], (args) => {
      return [
        '(P(A⋃B) - P(A)) * P(A) / (1 - P(A))',
        `(${args.u} - ${args.a}) * ${args.a} / (1 - ${args.a})`,
        // @ts-expect-error
        `${(args.u - args.a) * args.a / (1 - args.a)}`,
      ];
    }),
    createREventOption(['b', 'u'], (args) => {
      return [
        '(P(A⋃B) - P(B)) * P(B) / (1 - P(B))',
        `(${args.u} - ${args.b}) * ${args.b} / (1 - ${args.b})`,
        // @ts-expect-error
        `${(args.u - args.b) * args.b / (1 - args.b)}`,
      ];
    }),
    createREventOption(['a', 'b'], (args) => {
      return [
        'P(A) * P(B)',
        `${args.a} * ${args.b}`,
        // @ts-expect-error
        `${args.a * args.b}`,
      ];
    }),
  ],
  'A⋃B': [
    createREventOption(['a', 'i'], (args) => {
      return [
        'P(A) + P(B) - P(A⋂B)',
        'P(A) + P(A⋂B) / P(A) - P(A⋂B)',
        `${args.a} + ${args.i} / ${args.a} - ${args.i}`,
        // @ts-expect-error
        `${args.a + args.i / args.a - args.i}`,
      ];
    }),
    createREventOption(['b', 'i'], (args) => {
      return [
        'P(A) + P(B) - P(A⋂B)',
        'P(A⋂B) / P(B) + P(B) - P(A⋂B)',
        `${args.b} + ${args.i} / ${args.b} - ${args.i}`,
        // @ts-expect-error
        `${args.i / args.b + args.b - args.i}`,
      ];
    }),
    createREventOption(['a', 'b'], (args) => {
      return [
        'P(A) + P(B) - P(A⋂B)',
        'P(A) + P(B) - P(A) * P(B)',
        `${args.a} + ${args.b} - ${args.a} * ${args.b}`,
        // @ts-expect-error
        `${args.b / args.a + args.a - args.b}`,
      ];
    }),
  ],
  'AΔB': [
    createREventOption(['a', 'i'], (args) => {
      return [
        'P(A) + P(B) - 2 * P(A⋂B)',
        'P(A) + P(A⋂B) / P(A) - 2 * P(A⋂B)',
        `${args.a} + ${args.i} / ${args.a} - 2 * ${args.i}`,
        // @ts-expect-error
        `${args.a + args.i / args.a - 2 * args.i}`,
      ];
    }),
    createREventOption(['b', 'i'], (args) => {
      return [
        'P(A) + P(B) - 2 * P(A⋂B)',
        'P(A⋂B) / P(B) + P(B) - 2 * P(A⋂B)',
        `${args.i} / ${args.b} + ${args.b} - 2 * ${args.i}`,
        // @ts-expect-error
        `${args.b + args.i / args.b - 2 * args.i}`,
      ];
    }),
    createREventOption(['a', 'b'], (args) => {
      return [
        'P(A) + P(B) - 2 * P(A⋂B)',
        'P(A) + P(B) - 2 * P(A) * P(B)',
        `${args.a} + ${args.b} - 2 * ${args.a} * ${args.b}`,
        // @ts-expect-error
        `${args.a + args.b - 2 * args.a * args.b}`,
      ];
    }),
  ]
} as const satisfies Record<Target, REventOption[]>;

type State = Record<Target, REventArgs[]> & {
  /**
   * Target value.
   */
  target: Target,
  /**
   * Index of (parameter) option
   */
  optionIdx: number,
}

const useIndependentStore = defineStore('independent', {
  state: () => {
    const state = {
      target: targets[0],
      optionIdx: 0,
    } as State;

    for (const target of targets) {
      state[target] = [];
      optionsOfTargets[target].forEach((option, i) => {
        state[target][i] = option.keys.reduce((prev, key) => {
          prev[key] = 0;
          return prev;
        }, {} as REventArgs);
      });
    }
    return state;
  },
  getters: {
    optionItem(): REventOption {
      return optionsOfTargets[this.target][this.optionIdx];
    },
    params(): {key: REventParamKey, label: REventParamLabel}[] {
      return this.optionItem.keys.map(key => ({
        key,
        label: rEventParamNameBiMap[key],
      }));
    },
    formula(): ReturnType<REventOption['formula']> {
      return this.optionItem.formula(this.args);
    },
    /**
     * Current value of arguments
     */
    args():REventArgs {
      return this[this.target][this.optionIdx];
    },
    result(): number {
      const formula = this.formula;
      return +formula[formula.length - 1];
    },
    errorMessage(): ReturnType<Validator> {
      const resultMessage = isValidProb(this.result) ?
        null :
        `計算結果 P(${this.target})=${this.result} 無效。`;
      return [
        resultMessage,
        ...this.optionItem.validator.map(v => v(this.args))
      ].join('\n');
    }
  },
  actions: {
    updateTarget(newTarget: Target) {
      this.target = newTarget;
      this.optionIdx = 0;
    },
    setOption(idx: number | string) {
      this.optionIdx = +idx;
    },
    setArg(key: REventParamKey, newVal: number | string) {
      if (!isNaN(+newVal))
        this.args[key] = clip(newVal, 0, 1);
    }
  }
});
export default useIndependentStore;
