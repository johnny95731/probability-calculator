import { a1 as defineStore } from "./CLygsIoC.js";
import { X as binomialCoeff, Q as betainc, c as clip, Y as sum, U as storeArgsInitializer, W as PLACE, r as round } from "./ChaVi1sj.js";
const Bernoulli = {
  params: [
    {
      name: "p",
      tooltip: "單次成功機率",
      min: 0,
      max: 1,
      default: 0.8,
      step: "any"
    }
  ],
  domain() {
    return {
      min: 0,
      max: 1,
      step: 1
    };
  },
  isInDomain(_, x) {
    return x === 0 || x === 1;
  },
  pdf(args, x) {
    const { p } = args;
    if (!this.isInDomain(args, x)) return 0;
    else if (x === 1) return p;
    else return 1 - p;
  },
  cdf(args, x) {
    if (x < 0) return 0;
    else if (x < 1) return 1 - args["p"];
    else return 1;
  },
  mean(args) {
    return args["p"];
  },
  variance(args) {
    const { p } = args;
    return p * (1 - p);
  }
};
const Binomial = {
  params: [
    {
      name: "n",
      tooltip: "隨機試驗次數",
      min: 1,
      default: 20,
      step: 1
    },
    {
      name: "p",
      tooltip: "單次成功機率",
      min: 0,
      max: 1,
      default: 0.5,
      step: "any"
    }
  ],
  domain(args) {
    return {
      min: 0,
      max: args.n,
      step: 1
    };
  },
  isInDomain(args, x) {
    return Number.isInteger(x) && x >= 0 && x <= args.n;
  },
  pdf(args, k) {
    const { n, p } = args;
    if (!this.isInDomain(args, k) || p === 0 || p === 1) return 0;
    return binomialCoeff(n, k) * p ** k * (1 - p) ** (n - k);
  },
  cdf(args, k) {
    const { n, p } = args;
    if (k > n) return 1;
    else if (k < 0) return 0;
    return betainc(1 - p, n - k, 1 + k);
  },
  mean(args) {
    const { n, p } = args;
    return n * p;
  },
  variance(args) {
    const { n, p } = args;
    return n * p * (1 - p);
  }
};
const Uniform = {
  params: [
    {
      name: "min",
      tooltip: "最小值",
      max: (args) => args.max,
      default: 1,
      step: "any"
    },
    {
      name: "max",
      tooltip: "最大值",
      min: (args) => args.min,
      default: 100,
      step: "any"
    }
  ],
  domain(args) {
    return {
      ...args,
      step: 1
    };
  },
  isInDomain(args, x) {
    const { min, max } = args;
    return Number.isInteger(x) && min <= x && x <= max;
  },
  counts(args) {
    const { min, max } = args;
    return max - min + 1;
  },
  pdf(args, x) {
    if (!this.isInDomain(args, x)) return 0;
    else return 1 / this.counts(args);
  },
  cdf(args, x) {
    const { min } = args;
    return clip((Math.floor(x) - min + 1) / this.counts(args), 0, 1);
  },
  mean(args) {
    const { min, max } = args;
    return (min + max) / 2;
  },
  variance(args) {
    return (this.counts(args) ** 2 - 1) / 2;
  }
};
const Geometric = {
  params: [
    {
      name: "p",
      tooltip: "單次成功機率",
      min: 0,
      max: 1,
      default: 0.5,
      step: "any"
    }
  ],
  domain() {
    return {
      min: 1,
      step: 1
    };
  },
  isInDomain(_, k) {
    return Number.isInteger(k) && k >= 1;
  },
  pdf(args, k) {
    const { p } = args;
    if (!this.isInDomain(args, k)) return 0;
    else return (1 - p) ** (k - 1) * p;
  },
  cdf(args, k) {
    const { p } = args;
    if (k < 1) return 0;
    else
      return 1 - (1 - p) ** Math.floor(k);
  },
  mean(args) {
    const { p } = args;
    return 1 / p;
  },
  variance(args) {
    const { p } = args;
    return (1 - p) / p ** 2;
  }
};
const Hypergeometric = {
  params: [
    {
      name: "N",
      tooltip: "樣品總數量",
      min: 0,
      default: 100
    },
    {
      name: "K",
      tooltip: "符合樣品數量",
      min: 0,
      max: (args) => args["N"],
      default: 50
    },
    {
      name: "n",
      tooltip: "抽樣次數",
      min: 0,
      max: (args) => args["N"],
      default: 50
    }
  ],
  domain(args) {
    const { N, K, n } = args;
    return {
      min: Math.max(0, n + K - N),
      max: Math.min(n, K),
      step: 1
    };
  },
  isInDomain(args, k) {
    const { N, K, n } = args;
    return Number.isInteger(k) && k >= Math.max(0, n + K - N) && k <= Math.min(n, K);
  },
  pdf(args, k) {
    const { N, K, n } = args;
    if (!this.isInDomain(args, k)) return 0;
    else return binomialCoeff(K, k) / binomialCoeff(N, n) * binomialCoeff(N - K, n - k);
  },
  cdf(args, k) {
    k = Math.floor(k);
    const { N, K, n } = args;
    const start = Math.max(0, n + K - N);
    if (k < start) return 0;
    else if (k >= Math.min(n, K)) return 1;
    else
      return sum(
        Array.from({ length: k - start + 1 }),
        (prev, _, i) => prev + this.pdf(args, start + i)
      );
  },
  mean(args) {
    const { N, K, n } = args;
    return n * K / N;
  },
  variance(args) {
    const { N, K, n } = args;
    return n * K / N * (N - K) / N * (N - n) / (N - 1);
  }
};
const NegativeHypergeometric = {
  params: [
    {
      name: "N",
      tooltip: "樣品總數量",
      min: 0,
      default: 50
    },
    {
      name: "K",
      tooltip: "符合樣品數量",
      min: 0,
      max: (args) => args["N"],
      default: 25
    },
    {
      name: "r",
      tooltip: "抽到不符合樣品的次數",
      min: 0,
      max: (args) => args["N"] - args["K"],
      default: 15
    }
  ],
  domain(args) {
    const { K } = args;
    return {
      min: 0,
      max: K,
      step: 1
    };
  },
  isInDomain(args, k) {
    const { K } = args;
    return Number.isInteger(k) && k >= 0 && k <= K;
  },
  pdf(args, k) {
    const { N, K, r } = args;
    if (!this.isInDomain(args, k)) return 0;
    else return binomialCoeff(K + r - 1, k) / binomialCoeff(N, K) * binomialCoeff(N - r - k, K - k);
  },
  cdf(args, k) {
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
  mean(args) {
    const { N, K, r } = args;
    return r * K / (N - K + 1);
  },
  variance(args) {
    const { N, K, r } = args;
    return r * (N + 1) * K / ((N - K + 1) * (N - K + 2)) * (1 - r / (N - K + 1));
  }
};
const discDistribs = [
  ["Bernoulli", Bernoulli],
  ["Binomial", Binomial],
  ["Geometric", Geometric],
  ["Hypergeometric", Hypergeometric],
  ["NegativeHypergeometric", NegativeHypergeometric],
  ["Uniform", Uniform]
];
const useDiscreteStore = defineStore("discrete", {
  state: () => {
    const { args_, vars_ } = storeArgsInitializer(discDistribs);
    return {
      _currentIdx: 0,
      _args: args_,
      _vars: vars_,
      calc_: {
        place_: PLACE,
        toPercentage_: true
      },
      chart_: {
        points_: 200,
        extended_: 10
      }
    };
  },
  getters: {
    paramRanges_() {
      return this.distribution_.params.map(({ name, min, max, step }) => {
        return {
          name,
          min: typeof min === "number" ? min : min == null ? void 0 : min(this.args_),
          max: typeof max === "number" ? max : max == null ? void 0 : max(this.args_),
          step
        };
      });
    },
    varDomain_() {
      return this.distribution_.domain(this.args_);
    },
    args_() {
      return this._args[this._currentIdx];
    },
    vars_() {
      return this._vars[this._currentIdx];
    },
    distribution_() {
      return discDistribs[this._currentIdx][1];
    }
  },
  actions: {
    setCurrent_(val) {
      this._currentIdx = val;
    },
    setArg_(name, val) {
      if (!isNaN(+val))
        this.args_[name] = +val;
    },
    setVars_(idx, val) {
      if (!isNaN(+val))
        this.vars_[idx] = +val;
    },
    pdf_(x) {
      const { calc_: { place_ } } = this;
      return round(this.distribution_.pdf(this.args_, x), place_);
    },
    calcProb_(vars) {
      const { calc_: { place_, toPercentage_ } } = this;
      const distrib = this.distribution_;
      const leftPoint = Math.min(...vars);
      const rightPoint = Math.max(...vars);
      const scale = toPercentage_ ? 100 : 1;
      const L = scale * distrib.pdf(this.args_, leftPoint);
      const R = scale * distrib.pdf(this.args_, rightPoint);
      const below = scale * distrib.cdf(this.args_, leftPoint);
      const above = scale * (1 - distrib.cdf(this.args_, rightPoint - 1));
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
        outside: round(outside, place_)
      };
    }
  }
});
export {
  discDistribs as d,
  useDiscreteStore as u
};
