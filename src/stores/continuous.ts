import { defineStore } from 'pinia';
import { Beta, ChiSquared, Exponential, F, Gamma, Laplace, LogNormal, Normal, Rayleigh, StudentsT, Uniform, Weibull } from '~/utils/distributions/continuous';
import { PLACE, round } from 'utils/numeric';
import { storeArgsInitializer } from 'utils/distributions/common';
import type { DisplayResult, Distribution, Range } from 'utils/distributions/common';


export const contiDistribs = [
  ['Beta', Beta],
  ['ChiSquared', ChiSquared],
  ['Exponential', Exponential],
  ['F', F],
  ['Gamma', Gamma],
  ['Laplace', Laplace],
  ['LogNormal', LogNormal],
  ['Normal', Normal],
  ['Rayleigh', Rayleigh],
  ['StudentsT', StudentsT],
  ['Uniform', Uniform],
  ['Weibull', Weibull]
] as const;

export type ContinuousDistributions = typeof contiDistribs[number][0]

type State = {
  /**
   * Index of selected probability distribution.
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
     * Points of chart.
     */
    points: number;
    /**
     * Extended width from leftPoint and rightPoint that displayed.
     */
    extended: number;
    /**
     * Place value of digit on labels.
     */
    place: number;
  }
}

const useContinuousStore = defineStore('continuous', {
  state: (): State => {
    const { args_, vars_ } = storeArgsInitializer(contiDistribs);
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
        place: 3,
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
      return contiDistribs[this._idx][1];
    }
  },
  actions: {
    setCurrent(val: number) {
      this._idx = val;
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
      const { calc: { place: place_ } } = this;
      return round(this.distrib.pdf(this.args, x), place_);
    },
    calcProb(vars: number[]): DisplayResult<'continuous'> {
      const { calc: { place, percentage } } = this;
      const distrib = this.distrib;
      // Find boundaries.
      const leftPoint = Math.min(...vars);
      const rightPoint = Math.max(...vars);
      const scale = percentage ? 100 : 1;

      const L = distrib.pdf(this.args, leftPoint);
      const R = distrib.pdf(this.args, rightPoint);
      const below = scale * distrib.cdf(this.args, leftPoint);
      const above = scale * (1 - distrib.cdf(this.args, rightPoint));
      const outside = below + above;
      const between = scale - outside;
      return {
        left: round(L, place),
        right: round(R, place),
        below: round(below, place),
        above: round(above, place),
        between: round(between, place),
        outside: round(outside, place),
      };
    }
  }
});
export default useContinuousStore;
