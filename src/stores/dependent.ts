import { defineStore } from 'pinia';
import { clip } from 'utils/numeric';
import { createREventOption, isValidProb, rEventParamNameBiMap } from 'utils/probability';
import type { REventArgs, REventOption, REventParamKey, REventParamLabel, Validator } from 'utils/probability';

/**
 * The target value that be calculated.
 */
export const targets = [
  'A', 'A⋂B', 'A⋃B', 'AΔB', 'A|B'
] as const satisfies REventParamLabel[];;
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
    createREventOption(['b', 'i', 'u'], (args) => {
      return [
        'P(A⋃B) - P(B) + P(A⋂B)',
        `${args.u} - ${args.b} + ${args.i}`,
        // @ts-expect-error
        `${args.u - args.b + args.i}`,
      ];
    }),
    createREventOption(['b', 'ci'], (args) => {
      return [
        'P(A⋂B) / P(B|A)',
        `${args.i} / ${args.ci}`,
        // @ts-expect-error
        `${args.i / args.ci}`,
      ];
    }),
  ],
  'A⋂B': [
    createREventOption(['a', 'b', 'u'], (args) => {
      return [
        'P(A) + P(B) - P(A⋃B)',
        `${args.a} + ${args.b} - ${args.u}`,
        // @ts-expect-error
        `${args.a + args.b - args.u}`,
      ];
    }),
    createREventOption(['b', 'c'], (args) => {
      return [
        'P(B) * P(A|B)',
        `${args.b} * ${args.c}`,
        // @ts-expect-error
        `${args.b * args.c}`,
      ];
    }),
    createREventOption(['a', 'ci'], (args) => {
      return [
        'P(A) * P(B|A)',
        `${args.a} * ${args.ci}`,
        // @ts-expect-error
        `${args.a * args.ci}`,
      ];
    }),
  ],
  'A⋃B': [
    createREventOption(['a', 'b', 'i'], (args) => {
      return [
        'P(A) + P(B) - P(A⋂B)',
        `${args.a} + ${args.b} - ${args.i}`,
        // @ts-expect-error
        `${args.a + args.b - args.i}`,
      ];
    }),
    createREventOption(['a', 'b', 'c'], (args) => {
      return [
        'P(A) + P(B) - P(A⋂B)',
        'P(A) + P(B) - P(B) * P(A|B)',
        `${args.a} + ${args.b} - ${args.b} * ${args.c}`,
        // @ts-expect-error
        `${args.a + args.b - args.b * args.c}`,
      ];
    }),
    createREventOption(['a', 'b', 'ci'], (args) => {
      return [
        'P(A) + P(B) - P(A⋂B)',
        'P(A) + P(B) - P(A) * P(B|A)',
        `${args.a} + ${args.b} - ${args.a} * ${args.ci}`,
        // @ts-expect-error
        `${args.a + args.b - args.a * args.ci}`,
      ];
    }),
  ],
  'A|B': [
    createREventOption(['b', 'i'], (args) => {
      return [
        'P(A⋂B) / P(B)',
        'P(A) + P(A⋂B) / P(A) - 2 * P(A⋂B)',
        `${args.a} + ${args.i} / ${args.a} - 2 * ${args.i}`,
        // @ts-expect-error
        `${args.a + args.i / args.a - 2 * args.i}`,
      ];
    }),
    createREventOption(['a', 'i', 'u'], (args) => {
      return [
        'P(A⋂B) / P(B)',
        'P(A⋂B) / (P(A⋃B) - P(A) + P(A⋂B))',
        `${args.i} / (${args.u} - ${args.a} + ${args.i})`,
        // @ts-expect-error
        `${args.i / (args.u - args.a + args.i)}`,
      ];
    }),
    createREventOption(['a', 'b', 'u'], (args) => {
      return [
        'P(A⋂B) / P(B)',
        '(P(A) + P(B) - P(A⋃B)) / P(B)',
        `(${args.a} + ${args.b} - ${args.u}) / ${args.b}`,
        // @ts-expect-error
        `${(args.a + args.b - args.u) / args.b}`,
      ];
    }),
    createREventOption(['a', 'b', 'ci'], (args) => {
      return [
        'P(B|A) * P(A) / P(B)',
        `${args.ci} * ${args.a} / ${args.b}`,
        // @ts-expect-error
        `${args.ci * args.a / args.b}`,
      ];
    }),
  ],
  'AΔB': [
    createREventOption(['a', 'b', 'i'], (args) => {
      return [
        'P(A) + P(B) - 2 * P(A⋂B)',
        `${args.a} + ${args.b} - 2 * ${args.i}`,
        // @ts-expect-error
        `${args.a + args.b - 2 * args.i}`,
      ];
    }),
    createREventOption(['a', 'b', 'u'], (args) => {
      return [
        'P(A) + P(B) - 2 * P(A⋂B)',
        'P(A) + P(B) - 2 * (P(A) + P(B) - P(A⋃B))',
        `${args.a} + ${args.b} - 2 * (${args.a} + ${args.b} -${args.u})`,
        // @ts-expect-error
        `${args.a + args.b - 2 * (args.a + args.b - args.u)}`,
      ];
    }),
  ],
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

const useDependentStore = defineStore('dependent', {
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
export default useDependentStore;
