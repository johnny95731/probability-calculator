import { defineStore } from 'pinia';
import * as Continuous from '~/utils/distributions/continuous';
import { PLACE, round } from 'utils/numeric';
import { storeArgsInitializer } from 'utils/distributions/common';
import type { DisplayResult, Range } from 'utils/distributions/common';
import type { valueof } from 'utils/type-helpers';


export const continuousNames = [
  'Beta',
  'ChiSquared',
  'Exponential',
  'F',
  'Gamma',
  'Laplace',
  'LogNormal',
  'Normal',
  'Rayleigh',
  'StudentsT',
  'Uniform',
  'Weibull'
] as const;

export type ContinuousDistributions = typeof continuousNames[number]

type State = {
  /**
   * Currently displayed probability distribution.
   */
  current_: ContinuousDistributions;
  /**
   * Arguments of probability distributions.
   */
  __args_: Record<ContinuousDistributions, Record<string, number>>;
  /**
   * Variables of probability distributions.
   */
  __vars_: Record<ContinuousDistributions, [number, number]>;
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
     * Points of chart.
     */
    points_: number;
    /**
     * Extended width from leftPoint and rightPoint that displayed.
     */
    extended_: number;
    /**
     * Place value of digit on labels.
     */
    place_: number;
  }
}

const useContinuousStore = defineStore('continuous', {
  state: (): State => {
    const {args, vars} = storeArgsInitializer(Continuous, continuousNames);
    return {
      current_: continuousNames[0],
      __args_: args,
      __vars_: vars,
      calc_: {
        place_: PLACE,
        toPercentage_: true,
      },
      chart_: {
        points_: 200,
        extended_: 10,
        place_: 3,
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
    distribution(): valueof<typeof Continuous>{
      return Continuous[this.current_];
    }
  },
  actions: {
    setCurrent(val: string) {
      // @ts-expect-error
      this.current_ = continuousNames.includes(val) ? val : continuousNames[0];
    },
    setArg(name: string, val: number | string) {
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
    calcProb(vars: number[]): DisplayResult<'continuous'> {
      const { calc_: {place_, toPercentage_} } = this;
      const distrib = this.distribution;
      // Find boundaries.
      const leftPoint = Math.min(...vars);
      const rightPoint = Math.max(...vars);
      const scale = toPercentage_ ? 100 : 1;

      const L = distrib.pdf(this.args, leftPoint),
        R = distrib.pdf(this.args, rightPoint);
      const below = scale * distrib.cdf(this.args, leftPoint);
      const above = scale * (1 - distrib.cdf(this.args, rightPoint));
      const outside = below + above;
      const between = scale - outside;
      return {
        left: round(L, place_),
        right: round(R, place_),
        below: round(below, place_),
        above: round(above, place_),
        between: round(between, place_),
        outside: round(outside, place_),
      };
    }
  }
});
export default useContinuousStore;
