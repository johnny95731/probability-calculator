import { isNullish } from '../helpers';

export type Range = {
  /**
   * Minimum of the range.
   */
  min?: number,
  /**
   * Maximum of the range.
   */
  max?: number,
  /**
   * Same as step attribute in <input> tag. Minimum distance between two valid
   * values.
   */
  step?: number | 'any'
}

/**
 * Parameter of a probability distribution.
 */
export type Param = {
  /**
   * Name of a parameter.
   */
  name: string,
  /**
   * Minimum of the range. If the value starts with `#`, then it refers to
   * another parameter.
   */
  min?: number | ((args: Record<string, number>) => number),
  /**
   * Minimum of the range. If the value starts with `#`, then it refers to
   * another parameter.
   */
  max?: number | ((args: Record<string, number>) => number),
  /**
   * Same as step attribute in <input> tag. Minimum distance between two valid
   * values.
   */
  step?: number | 'any'
  /**
   * Tooltip of a parameter
   */
  tooltip?: string,
  /**
   * Default/Initial value. If not specified, min will be used as a default.
   * If both default and min are not specified, 0 will be used as a default.
   */
  default?: number
}

/**
 * A probability distribution.
 */
export interface Distribution {
  /**
   * Parameter names of a probability distribution.
   */
  readonly params: Readonly<Param[]>;

  /**
   * Get the domain of variable.
   */
  domain(args: Record<string, number>): Range

  // # Statistics values
  /**
   * Check whether variable x is in support or not.
   */
  isInDomain(args: Record<string, number>, x: number): boolean
  /**
   * Probability density function for continuous distributions and
   * probability mass function for discrete distributions.
   */
  pdf(args: Record<string, number>, x: number): number
  /**
   * Cumulative distribution function: P(X<=x).
   */
  cdf(args: Record<string, number>, x: number): number

  // # Statistics values
  /**
   * Expected value of a probability distribution.
   */
  mean(args: Record<string, number>): number | null
  /**
   * Variance of a probability distribution.
   */
  variance(args: Record<string, number>): number | null
}

export type Cummulative = 'below' | 'above' | 'between' | 'outside';

export type DisplayResult<T extends 'discrete' | 'continuous'> =
  (T extends 'discrete' ? {
    /**
     * Probability below the point (exclusive).
     */
    belowExcl: number,
    aboveExcl: number
  } : unknown) &
  Record<Cummulative, number> & {
  left: number,
  right: number,
}


export const storeArgsInitializer = <T extends Distribution, F extends readonly string[]>(
  distributions: Record<F[number], T>,
  names: F
) => {
  const args = {} as Record<F[number], Record<string, number>>;
  const vars = {} as Record<F[number], [number, number]>;

  for (let i = 0; i < names.length; i++) {
    const name = names[i] as F[number];
    const distribObj = distributions[name];

    args[name] = distribObj.params
      .reduce((prev, param) => {
        prev[param.name] = param.default ??
                (typeof param.min ==='number' ? param.min : 0);
        return prev;
      }, {} as Record<string, number>);

    const domain = distribObj.domain(args[name]);
    if (
      distribObj.isInDomain(args[name], -1) &&
          distribObj.isInDomain(args[name], 1)
    )
      vars[name] = [-1, 1];
    else if (!isNullish(domain.min) && !isNullish(domain.max))
      vars[name] = [domain.min, domain.max];
    else if (
      distribObj.isInDomain(args[name], 0) &&
          distribObj.isInDomain(args[name], 1)
    )
      vars[name] = [0, 1];
    else if (!isNullish(domain.min)) {
      vars[name] = [domain.min, domain.min+1];
    } else if (!isNullish(domain.max)) {
      vars[name] = [domain.max-1, domain.max];
    } else {
      vars[name] = [-1, 1];
    }
  }
  return {
    args,
    vars
  };
};
