import { clip, sum } from 'utils/numeric';
import { betainc, binomialCoeff } from 'utils/specials';
import type { Distribution } from 'utils/distributions/common';


export const Bernoulli: Distribution = {
  params: [
    {
      name: 'p',
      tooltip: '單次成功機率',
      min: 0,
      max: 1,
      default: 0.8,
      step: 'any',
    }
  ] as const,

  domain() {
    return {
      min: 0,
      max: 1,
      step: 1,
    };
  },

  isInDomain(_: Record<string, number>, x: number) {
    return x === 0 || x === 1;
  },

  pdf(args: Record<string, number>, x: number) {
    const { p } = args;
    if (!this.isInDomain(args, x)) return 0;
    else if (x === 1) return p;
    else return 1 - p;
  },
  cdf(args: Record<string, number>, x: number) {
    if (x < 0) return 0;
    else if (x < 1) return 1 - args['p'];
    else return 1;
  },

  mean(args: Record<string, number>) {
    return args['p'];
  },
  variance(args: Record<string, number>) {
    const { p } = args;
    return p * (1 - p);
  }
};

export const Binomial: Distribution = {
  params: [
    {
      name: 'n',
      tooltip: '隨機試驗次數',
      min: 1,
      default: 20,
      step: 1,
    },
    {
      name: 'p',
      tooltip: '單次成功機率',
      min: 0,
      max: 1,
      default: 0.5,
      step: 'any',
    }
  ] as const,

  domain(args: Record<string, number>) {
    return {
      min: 0,
      max: args.n,
      step: 1,
    };
  },

  isInDomain(args: Record<string, number>, x: number) {
    return Number.isInteger(x) && x >= 0 && x <= args.n;
  },

  pdf(args: Record<string, number>, k: number) {
    const { n, p } = args;
    if (!this.isInDomain(args, k) || p === 0 || p === 1) return 0;
    return binomialCoeff(n, k) * p**k * (1-p)**(n-k);
  },

  cdf(args: Record<string, number>, k: number) {
    const { n, p } = args;
    if (k > n) return 1;
    else if (k < 0) return 0;
    return betainc(1 - p, n - k, 1 + k);
  },

  mean(args: Record<string, number>) {
    const { n, p } = args;
    return n * p;
  },
  variance(args: Record<string, number>) {
    const { n, p } = args;
    return n * p * (1 - p);
  },
};

export type Uniform = Distribution & {
  /**
   * Number of supports elements.
   */
  counts(args: Record<string, number>): number
}
export const Uniform: Uniform = {
  params: [
    {
      name: 'min',
      tooltip: '最小值',
      max: (args: Record<string, number>) => args.max,
      default: 1,
      step: 'any',
    },
    {
      name: 'max',
      tooltip: '最大值',
      min: (args: Record<string, number>) => args.min,
      default: 100,
      step: 'any',
    }
  ] as const,

  domain(args: Record<string, number>) {
    return {
      ...args,
      step: 1,
    };
  },

  isInDomain(args: Record<string, number>, x: number) {
    const { min, max } = args;
    return Number.isInteger(x) && min <= x && x <= max;
  },

  counts(args: Record<string, number>): number {
    const { min, max } = args;
    return max - min + 1;
  },

  pdf(args: Record<string, number>, x: number) {
    if (!this.isInDomain(args, x)) return 0;
    else return 1 / this.counts(args);
  },

  cdf(args: Record<string, number>, x: number) {
    const { min } = args;
    return clip((Math.floor(x) - min + 1) / this.counts(args), 0, 1);
  },

  mean(args: Record<string, number>) {
    const { min, max } = args;
    return (min + max) / 2;
  },
  variance(args: Record<string, number>) {
    return ((this.counts(args))**2 - 1) / 2;
  },
};


export const Geometric: Distribution = {
  params: [
    {
      name: 'p',
      tooltip: '單次成功機率',
      min: 0,
      max: 1,
      default: 0.5,
      step: 'any',
    }
  ] as const,

  domain() {
    return {
      min: 1,
      step: 1,
    };
  },

  isInDomain(_, k: number) {
    return Number.isInteger(k) && k >= 1;
  },

  pdf(args: Record<string, number>, k: number) {
    const { p } = args;
    if (!this.isInDomain(args, k)) return 0;
    else return (1-p)**(k-1) * p;
  },

  cdf(args: Record<string, number>, k: number) {
    const { p } = args;
    if (k < 1) return 0;
    else
      return 1 - (1 - p)**(Math.floor(k));
  },

  mean(args: Record<string, number>) {
    const { p } = args;
    return 1 / p;
  },
  variance(args: Record<string, number>) {
    const { p } = args;
    return (1 - p) / p**2;
  },
};


export const Hypergeometric: Distribution = {
  params: [
    {
      name: 'N',
      tooltip: '樣品總數量',
      min: 0,
      default: 100,
    },
    {
      name: 'K',
      tooltip: '符合樣品數量',
      min: 0,
      max: (args: Record<string, number>) => args['N'],
      default: 50,
    },
    {
      name: 'n',
      tooltip: '抽樣次數',
      min: 0,
      max: (args: Record<string, number>) => args['N'],
      default: 50,
    }
  ] as const,

  domain(args: Record<string, number>) {
    const { N, K, n } = args;
    return {
      min: Math.max(0, n + K - N),
      max: Math.min(n, K),
      step: 1,
    };
  },

  isInDomain(args: Record<string, number>, k: number) {
    const { N, K, n } = args;
    return (
      Number.isInteger(k) &&
      k >= Math.max(0, n + K - N) &&
      k <= Math.min(n, K)
    );
  },

  pdf(args: Record<string, number>, k: number) {
    const { N, K, n } = args;
    if (!this.isInDomain(args, k)) return 0;
    else return (binomialCoeff(K, k) / binomialCoeff(N, n)) * binomialCoeff(N-K, n-k);
  },

  cdf(args: Record<string, number>, k: number) {
    k = Math.floor(k);
    const { N, K, n } = args;
    const start = Math.max(0, n+K-N);
    if (k < start) return 0;
    else if (k >= Math.min(n, K)) return 1;
    else
      return sum(
        Array.from({ length: k - start + 1 }),
        (prev, _, i) => prev + this.pdf(args, start + i)
      );
  },

  mean(args: Record<string, number>) {
    const { N, K, n } = args;
    return n * K / N;
  },
  variance(args: Record<string, number>) {
    const { N, K, n } = args;
    return (
      n * K / N *
      (N - K) / N *
      (N - n) / (N - 1)
    );
  },
};


export const NegativeHypergeometric: Distribution = {
  params: [
    {
      name: 'N',
      tooltip: '樣品總數量',
      min: 0,
      default: 50,
    },
    {
      name: 'K',
      tooltip: '符合樣品數量',
      min: 0,
      max: (args: Record<string, number>) => args['N'],
      default: 25,
    },
    {
      name: 'r',
      tooltip: '抽到不符合樣品的次數',
      min: 0,
      max: (args: Record<string, number>) => args['N'] - args['K'],
      default: 15,
    }
  ] as const,

  domain(args: Record<string, number>) {
    const { K } = args;
    return {
      min: 0,
      max: K,
      step: 1,
    };
  },

  isInDomain(args: Record<string, number>, k: number) {
    const { K } = args;
    return (
      Number.isInteger(k) &&
      k >= 0 &&
      k <= K
    );
  },

  pdf(args: Record<string, number>, k: number) {
    const { N, K, r } = args;
    if (!this.isInDomain(args, k)) return 0;
    else return (binomialCoeff(K+r-1, k) / binomialCoeff(N, K)) * binomialCoeff(N-r-k, K-k);
  },

  cdf(args: Record<string, number>, k: number) {
    k = Math.floor(k);
    const { K } = args;
    if (k < 0) return 0;
    else if (k >= K) return 1;
    else
      return sum(
        Array.from({ length: k + 1 }),
        (prev, _, i) => prev + this.pdf(args, i)
      );
  },

  mean(args: Record<string, number>) {
    const { N, K, r } = args;
    return r * K / (N - K + 1);
  },
  variance(args: Record<string, number>) {
    const { N, K, r } = args;
    return (
      r *
      (N + 1) * K / ((N - K + 1) * (N - K + 2)) *
      (1 - r / (N - K + 1))
    );
  },
};
