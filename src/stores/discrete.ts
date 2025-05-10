import { defineStore } from 'pinia';
import { Bernoulli, Binomial, Geometric, Hypergeometric, NegativeHypergeometric, Uniform } from 'utils/distributions/discrete';
import { PLACE, round } from 'utils/numeric';
import { storeArgsInitializer } from 'utils/distributions/common';
import type { DisplayResult, Distribution, Range } from 'utils/distributions/common';


export const discDistribs = [
  ['Bernoulli', Bernoulli],
  ['Binomial', Binomial],
  ['Geometric', Geometric],
  ['Hypergeometric', Hypergeometric],
  ['NegativeHypergeometric', NegativeHypergeometric],
  ['Uniform', Uniform]
] as const;

export type DiscreteDistributions = typeof discDistribs[number]

type State = {
  /**
   * Currently displayed probability distribution.
   */
  _idx: number;
  /**
   * Arguments of probability distributions.
   */
  _args: Record<number, Record<string, number>>;
  /**
   * Variables of probability distributions.
   */
  _vars: Record<number, [number, number]>;
  /**
   * Calculation settings.
   */
  calc: {
    /**
     * Place value of digit.
     */
    place: number;
    /**
     * Is displaying probabilities in percentage or not.
     */
    percentage: boolean;
  },
  /**
   * Chart settings.
   */
  chart: {
    /**
     * Maximum points of chart.
     */
    points: number;
    /**
     * Extended width from leftPoint and rightPoint that displayed.
     */
    extended: number;
  }
}

const useDiscreteStore = defineStore('discrete', {
  state: (): State => {
    const { args_, vars_ } = storeArgsInitializer(discDistribs);
    return {
      _idx: 0,
      _args: args_,
      _vars: vars_,
      calc: {
        place: PLACE,
        percentage: true,
      },
      chart: {
        points: 200,
        extended: 10,
      }
    };
  },
  getters: {
    paramRanges(): (Range & {name: string})[] {
      return this.distrib.params.map(({name, min, max, step}) => {
        return {
          name,
          min: typeof min === 'number' ? min : min?.(this.args),
          max: typeof max === 'number' ? max : max?.(this.args),
          step
        };
      });
    },
    varDomain(): Range {
      return this.distrib.domain(this.args);
    },
    args(): Record<string, number> {
      return this._args[this._idx];
    },
    vars(): number[] {
      return this._vars[this._idx];
    },
    distrib(): Distribution{
      return discDistribs[this._idx][1];
    }
  },
  actions: {
    setCurrent(val: number) {
      this._idx = val;
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
      const { calc: { place: place_ } } = this;
      return round(this.distrib.pdf(this.args, x), place_);
    },
    calcProb(vars: number[]): DisplayResult<'discrete'> {
      const { calc: { place, percentage } } = this;
      const distrib = this.distrib;
      // Find boundaries.
      const leftPoint = Math.min(...vars);
      const rightPoint = Math.max(...vars);
      const scale = percentage ? 100 : 1;

      const L = scale * distrib.pdf(this.args, leftPoint);
      const R = scale * distrib.pdf(this.args, rightPoint);
      const below = scale * distrib.cdf(this.args, leftPoint);
      const above = scale * (1 - distrib.cdf(this.args, rightPoint-1));
      const outside = below + above;
      const between = scale - outside + L + R;
      return {
        left: round(L, place),
        right: round(R, place),
        below: round(below, place),
        above: round(above, place),
        belowExcl: round(below - L, place),
        aboveExcl: round(above - R, place),
        between: round(between, place),
        outside: round(outside, place),
      };
    }
  }
});
export default useDiscreteStore;
