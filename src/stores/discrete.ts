import { defineStore } from 'pinia';
import * as Discrete from 'utils/distributions/discrete';
import { PLACE, round } from 'utils/numeric';
import { storeArgsInitializer } from 'utils/distributions/common';
import type { DisplayResult, Range } from 'utils/distributions/common';
import type { valueof } from 'utils/type-helpers';


export const discreteNames = [
  'Bernoulli',
  'Binomial',
  'Geometric',
  'Hypergeometric',
  'NegativeHypergeometric',
  'Uniform'
] as const;

export type DiscreteDistributions = typeof discreteNames[number]

type State = {
  /**
   * Currently displayed probability distribution.
   */
  current_: DiscreteDistributions;
  /**
   * Arguments of probability distributions.
   */
  __args_: Record<DiscreteDistributions, Record<string, number>>;
  /**
   * Variables of probability distributions.
   */
  __vars_: Record<DiscreteDistributions, [number, number]>;
  /**
   * Calculation settings.
   */
  calc_: {
    /**
     * Place value of digit.
     */
    place_: number;
    /**
     * Is displaying probabilities in percentage or not.
     */
    toPercentage_: boolean;
  },
  /**
   * Chart settings.
   */
  chart_: {
    /**
     * Maximum points of chart.
     */
    points_: number;
    /**
     * Extended width from leftPoint and rightPoint that displayed.
     */
    extended_: number;
  }
}

const useDiscreteStore = defineStore('discrete', {
  state: (): State => {
    const {args, vars} = storeArgsInitializer(Discrete, discreteNames);
    return {
      current_: discreteNames[0],
      __args_: args,
      __vars_: vars,
      calc_: {
        place_: PLACE,
        toPercentage_: true,
      },
      chart_: {
        points_: 200,
        extended_: 10,
      }
    };
  },
  getters: {
    paramRanges(): (Range & {name: string})[] {
      return this.distribution.params.map(({name, min, max, step}) => {
        return {
          name,
          min: typeof min === 'number' ? min : min?.(this.args),
          max: typeof max === 'number' ? max : max?.(this.args),
          step
        };
      });
    },
    varDomain(): Range {
      return this.distribution.domain(this.args);
    },
    args(): Record<string, number> {
      return this.__args_[this.current_];
    },
    vars(): number[] {
      return this.__vars_[this.current_];
    },
    distribution(): valueof<typeof Discrete>{
      return Discrete[this.current_];
    }
  },
  actions: {
    setCurrent(val: string) {
      // @ts-expect-error
      this.current_ = discreteNames.includes(val) ? val : discreteNames[0];
    },
    setArg(name: string, val: number) {
      if (!isNaN(+val))
        this.args[name] = +val;
    },
    setVars(idx: number, val: number | string) {
      if (!isNaN(+val))
        this.vars[idx] = +val;
    },
    pdf(x: number): number {
      const { calc_: {place_} } = this;
      return round(this.distribution.pdf(this.args, x), place_);
    },
    calcProb(vars: number[]): DisplayResult<'discrete'> {
      const { calc_: {place_, toPercentage_} } = this;
      const distrib = this.distribution;
      // Find boundaries.
      const leftPoint = Math.min(...vars);
      const rightPoint = Math.max(...vars);
      const scale = toPercentage_ ? 100 : 1;

      const L = scale * distrib.pdf(this.args, leftPoint),
        R = scale * distrib.pdf(this.args, rightPoint);
      const below = scale * distrib.cdf(this.args, leftPoint);
      const above = scale * (1 - distrib.cdf(this.args, rightPoint-1));
      const outside = below + above;
      const between = scale - outside + L + R;
      return {
        left: round(L, place_),
        right: round(R, place_),
        below: round(below, place_),
        above: round(above, place_),
        belowExcl: round(below - L, place_),
        aboveExcl: round(above - R, place_),
        between: round(between, place_),
        outside: round(outside, place_),
      };
    }
  }
});
export default useDiscreteStore;
