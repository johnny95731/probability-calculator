import gammainc from '@stdlib/math-base-special-gammainc';
import { erf , beta as betaF, betainc, gamma } from 'utils/specials';
import { clip, SQRT2PI, SQRTPI_2 } from 'utils/numeric';
import type { Distribution } from 'utils/distributions/common';


export const Normal: Distribution = {
  params: [
    {
      name: 'mean',
      tooltip: '平均值μ',
      default: 0,
      step: 'any',
    },
    {
      name: 'sigma',
      tooltip: '標準差σ',
      min: 0,
      default: 1,
      step: 'any',
    }
  ] as const,

  domain() {
    return {
      step: 'any',
    };
  },

  isInDomain() {
    return true;
  },

  pdf(args: Record<string, number>, x: number) {
    const { mean, sigma } = args;
    return (
      Math.exp(((x - mean) / sigma)**2 / (-2)) / (Math.sqrt(2*Math.PI) * sigma)
    );
  },
  cdf(args: Record<string, number>, x: number) {
    const { mean, sigma } = args;
    return 0.5 * (1 + erf((x - mean) / (sigma * Math.SQRT2)));
  },

  mean(args: Record<string, number>) {
    return args.mean;
  },
  variance(args: Record<string, number>) {
    return args.sigma**2;
  }
};



export const Rayleigh: Distribution = {
  params: [
    {
      name: 'sigma',
      min: 0,
      default: 1,
      step: 'any',
    }
  ] as const,

  domain() {
    return {
      min: 0,
      step: 'any',
    };
  },

  isInDomain(_, x: number) {
    return x >= 0;
  },

  pdf(args: Record<string, number>, x: number) {
    if (!this.isInDomain(args, x)) return 0;
    const { sigma } = args;
    return x * Math.exp((x/sigma)**2 / -2) / sigma**2;
  },
  cdf(args: Record<string, number>, x: number) {
    const { sigma } = args;
    return 1 - Math.exp((x/sigma)**2 / -2);
  },

  mean(args: Record<string, number>) {
    return args.sigma * SQRTPI_2;
  },
  variance(args: Record<string, number>) {
    return ((4 - Math.PI) / 2) * args.sigma**2;
  }
};


export const Uniform: Distribution = {
  params: [
    {
      name: 'low',
      tooltip: '最小值',
      max: (args: Record<string, number>) => args.high,
      default: 1,
      step: 'any',
    },
    {
      name: 'high',
      tooltip: '最小值',
      min: (args: Record<string, number>) => args.low,
      default: 100,
      step: 'any',
    }
  ] as const,

  domain(args: Record<string, number>) {
    return {
      min: args.low,
      max: args.high,
      step: 'any',
    };
  },

  isInDomain(args: Record<string, number>, x: number) {
    const { low, high } = args;
    return low <= x && x <= high;
  },

  pdf(args: Record<string, number>, x: number) {
    if (!this.isInDomain(args, x)) return 0;
    const { low, high } = args;
    return 1 / (high - low);
  },
  cdf(args: Record<string, number>, x: number) {
    const { low, high } = args;
    if (low === high) return x >= low ? 1 : 0;
    return clip((x - low) / (high - low), 0, 1);
  },

  mean(args: Record<string, number>) {
    const { min, max } = args;
    return (max + min) / 2;
  },
  variance(args: Record<string, number>) {
    const { min, max } = args;
    return (max - min)**2 / 12;
  }
};


export const StudentsT: Distribution = {
  params: [
    {
      name: 'deg',
      tooltip: '自由度',
      min: 0,
      default: 1,
      step: 'any',
    },
  ] as const,

  domain() {
    return {
      step: 'any',
    };
  },

  isInDomain() {
    return true;
  },

  pdf(args: Record<string, number>, x: number) {
    if (!this.isInDomain(args, x)) return 0;
    const { deg } = args;
    const g = gamma((deg+1)/2) / gamma(deg/2);
    const c = (1 + x**2 /deg)**((deg+1)/2);
    return g / (Math.sqrt(deg * Math.PI) * c);
  },
  cdf(args: Record<string, number>, x: number) {
    const { deg } = args;
    if (x === 0) return 0.5;
    if (x > 0) {
      return 1 - .5 * betainc(deg / (x**2 + deg), deg/2, .5);
    } else {
      return .5 * betainc(deg / (x**2 + deg), deg/2, .5);
    }
  },

  mean(args: Record<string, number>) {
    const { deg } = args;
    if (deg > 1) return 0;
    else return null;
  },
  variance(args: Record<string, number>) {
    const { deg } = args;
    if (deg > 2) return deg / (deg - 2);
    else if (deg > 1) return Infinity;
    else return null;
  }
};


export const Beta: Distribution = {
  params: [
    {
      name: 'alpha',
      min: 0,
      max: 250,
      default: 1,
      step: 'any',
    },
    {
      name: 'beta',
      min: 0,
      max: 250,
      default: 1,
      step: 'any',
    }
  ] as const,

  domain() {
    return {
      min: 0,
      max: 1,
      step: 'any',
    };
  },

  isInDomain(_, x: number) {
    return 0 <= x && x <= 1;
  },

  pdf(args: Record<string, number>, x: number) {
    if (!this.isInDomain(args, x)) return 0;
    const { alpha, beta } = args;
    return (
      x**(alpha-1) * (1-x)**(beta-1) / betaF(alpha, beta)
    );
  },
  cdf(args: Record<string, number>, x: number) {
    if (x <= 0) return 0;
    else if (x >= 1) return 1;
    const { alpha, beta } = args;
    return betainc(x, alpha, beta);
  },

  mean(args: Record<string, number>) {
    const { alpha, beta } = args;
    return alpha / (alpha + beta);
  },
  variance(args: Record<string, number>) {
    const { alpha, beta } = args;
    const s = alpha + beta;
    return alpha * beta / (s*s * (s+1));
  }
};



export const ChiSquared: Distribution = {
  params: [
    {
      name: 'k',
      tooltip: '自由度',
      min: 0,
      default: 1,
      step: 'any',
    },
  ] as const,

  domain() {
    return {
      min: 0,
      step: 'any',
    };
  },

  isInDomain(_, x: number) {
    return x > 0;
  },

  pdf(args: Record<string, number>, x: number) {
    if (!this.isInDomain(args, x)) return 0;
    const { k } = args;
    return (x/2)**(k/2) * Math.exp(-x/2) / x / gamma(k / 2);
  },
  cdf(args: Record<string, number>, x: number) {
    if (x < 0) return 0;
    const { k } = args;
    return gammainc(x/2, k/2, true);
  },

  mean(args: Record<string, number>) {
    return args.k;
  },
  variance(args: Record<string, number>) {
    return 2 * args.k;
  }
};


export const Exponential: Distribution = {
  params: [
    {
      name: 'lambda',
      tooltip: 'Rate',
      min: 0,
      default: 1,
      step: 'any',
    },
  ] as const,

  domain() {
    return {
      min: 0,
      step: 'any',
    };
  },

  isInDomain(_, x: number) {
    return x >= 0;
  },

  pdf(args: Record<string, number>, x: number) {
    if (!this.isInDomain(args, x)) return 0;
    const { lambda } = args;
    return lambda * Math.exp(-lambda * x);
  },
  cdf(args: Record<string, number>, x: number) {
    if (x < 0) return 0;
    const { lambda } = args;
    return 1 - Math.exp(-lambda * x);
  },

  mean(args: Record<string, number>) {
    return 1 / args.lambda;
  },
  variance(args: Record<string, number>) {
    const { lambda } = args;
    return 1 / lambda**2;
  }
};


export const F: Distribution = {
  params: [
    {
      name: 'deg1',
      tooltip: '自由度',
      min: 0,
      default: 1,
      step: 'any',
    },
    {
      name: 'deg2',
      tooltip: '自由度',
      min: 0,
      default: 1,
      step: 'any',
    },
  ] as const,

  domain() {
    return {
      min: 0,
      step: 'any',
    };
  },

  isInDomain(args: Record<string, number>, x: number) {
    if (args.deg1 === 1)
      return x > 0;
    else
      return x >= 0;
  },

  pdf(args: Record<string, number>, x: number) {
    if (!this.isInDomain(args, x)) return 0;
    const { deg1, deg2 } = args;
    const c = deg1 * x / (deg1 * x + deg2);
    return Math.sqrt(c**deg1 * (1-c)**deg2) / x / betaF(deg1/2, deg2/2);
  },
  cdf(args: Record<string, number>, x: number) {
    if (x < 0) return 0;
    const { deg1, deg2 } = args;
    return betainc(deg1 * x / (deg1 * x + deg2), deg1/2, deg2/2);
  },

  mean(args: Record<string, number>) {
    const { deg2 } = args;
    if (deg2 > 2) return deg2 / (deg2 - 2);
    return null;
  },
  variance(args: Record<string, number>) {
    const { deg1, deg2 } = args;
    if (deg2 <= 4) return null;
    const dm2 = deg2 - 2;
    const numerator   = 2 * deg2**2 * (deg1 + dm2);
    const denominator = deg1 * dm2**2 * (deg2 - 4);
    return numerator / denominator;
  }
};



export const Laplace: Distribution = {
  params: [
    {
      name: 'mean',
      tooltip: '平均值',
      default: 0,
      step: 'any',
    },
    {
      name: 'scale',
      min: 0,
      default: 1,
      step: 'any',
    },
  ] as const,

  domain() {
    return {
      step: 'any',
    };
  },

  isInDomain() {
    return true;
  },

  pdf(args: Record<string, number>, x: number) {
    const { mean, scale } = args;
    return Math.exp(-Math.abs(x-mean) / scale) / (2 * scale);
  },
  cdf(args: Record<string, number>, x: number) {
    const { mean, scale } = args;
    const exp = Math.exp((x - mean) / scale);
    if (x < mean) return exp / 2;
    else return 1 - 1 / (2 * exp);
    // return .5 + .5 * Math.sign(x- mean) * (1 - Math.exp(-Math.abs(x- mean) / scale));
  },

  mean(args: Record<string, number>) {
    return args.mean;
  },
  variance(args: Record<string, number>) {
    return 2 * args.scale**2;
  }
};


export const Gamma: Distribution = {
  params: [
    {
      name: 'k',
      tooltip: '形狀母數',
      min: 0,
      default: 1,
      step: 'any',
    },
    {
      name: 'theta',
      tooltip: '比例母數',
      min: 0,
      default: 2,
      step: 'any',
    },
  ] as const,

  domain() {
    return {
      min: 0,
      step: 'any',
    };
  },

  isInDomain(_, x: number) {
    return x >= 0;
  },

  pdf(args: Record<string, number>, x: number) {
    if (!this.isInDomain(args, x)) return 0;
    const { k, theta } = args;
    return x**(k-1) * Math.exp(-x/theta) / (gamma(k) * theta**k);
  },
  cdf(args: Record<string, number>, x: number) {
    if (x < 0) return 0;
    const { k, theta } = args;
    return gammainc(x/theta, k);
  },

  mean(args: Record<string, number>) {
    const { k, theta } = args;
    return k * theta;
  },
  variance(args: Record<string, number>) {
    const { k, theta } = args;
    return k * theta**2;
  }
};


export const LogNormal: Distribution = {
  params: [
    {
      name: 'location',
      tooltip: '位置母數',
      default: 0,
      step: 'any',
    },
    {
      name: 'sigma',
      tooltip: '比例母數',
      min: 0,
      default: 1,
      step: 'any',
    },
  ] as const,

  domain() {
    return {
      min: 0,
      step: 'any',
    };
  },

  isInDomain(_, x: number) {
    return x >= 0;
  },

  pdf(args: Record<string, number>, x: number) {
    if (!this.isInDomain(args, x) || !x) return 0;
    const { location, sigma } = args;
    const lnx = Math.log(x);
    return Math.exp(((lnx - location) / sigma)**2 / -2) / (x * sigma * SQRT2PI);
  },
  cdf(args: Record<string, number>, x: number) {
    if (x <= 0) return 0;
    const { location, sigma } = args;
    const lnx = Math.log(x);
    return 0.5 * (1 + erf((lnx - location) / (sigma * Math.SQRT2)));
  },

  mean(args: Record<string, number>) {
    const { location, sigma } = args;
    return Math.exp(location + sigma**2 / 2);
  },
  variance(args: Record<string, number>) {
    const { location, sigma } = args;
    return (Math.exp(sigma**2) - 1) * Math.exp(2 * location + sigma**2);
  }
};


export const Weibull: Distribution = {
  params: [
    {
      name: 'scale',
      tooltip: '比例母數',
      min: 0,
      default: 1,
      step: 'any',
    },
    {
      name: 'k',
      tooltip: '形狀母數',
      min: 0,
      default: 1,
      step: 'any',
    },
  ] as const,

  domain() {
    return {
      min: 0,
      step: 'any',
    };
  },

  isInDomain(_, x: number) {
    return x >= 0;
  },

  pdf(args: Record<string, number>, x: number) {
    if (!this.isInDomain(args, x)) return 0;
    const { scale, k } = args;
    const c = x / scale;
    return k/scale * c**(k-1) * Math.exp(-1 * c**k);
  },
  cdf(args: Record<string, number>, x: number) {
    if (x <= 0) return 0;
    const { scale, k } = args;
    const c = x / scale;
    return 1 - Math.exp(-1*c**k);
  },

  mean(args: Record<string, number>) {
    const { scale, k } = args;
    return scale * gamma(1 + 1/k);
  },
  variance(args: Record<string, number>) {
    const { scale, k } = args;
    return scale**2 * gamma(1 + 2/k) - this.mean(args)!**2;
  }
};
