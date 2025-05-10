import { EPSILON, sign, SQRT2PI, sum } from './numeric';

/**
 * Calculate the binomial coefficoent C(n, k)
 * @param n Number of all objects.
 * @param k Number of objects that be choosed.
 */
export const binomialCoeff = (n: number, k: number): number => {
  if (!Number.isInteger(n)) {
    let prod = n / k;
    for (let i = 1; i < k; i++) prod *= (n - i) / i;
    return prod;
  } else {
    const minCount = Math.min(k, n-k);
    let prod = 1;
    for (let i = 1; i <= minCount; i++) prod *= (n - i + 1) / i;
    return prod;
  }
};

/**
 * Gauss error function that corresponding erfc with a maximum relative error
 * less than 2**(-53).
 *
 * Dia, Yaya D. (2023). "Approximate Incomplete Integrals, Application to
 * Complementary Error Function". SSRN Electronic Journal.
 * doi:10.2139/ssrn.4487559. ISSN 1556-5068.
 */
export const erf = (() => {
  const b1 = [ // b_{1,i}
    12.0616688728624,
    8.443197810039685,
    6.361616309538805,
    5.135785305856815,
    4.486403295234087
  ];
  const b2 = [ // b_{2,i}
    3.47954057099519,
    3.720684439602251,
    3.902257040299241,
    4.032968931092625,
    4.112409429574509
  ];
  const c1 = [ // c_{1,i}
    5.807556131303016,
    12.07402036406381,
    9.30596659485888,
    9.126616176736732,
    9.194356128869691
  ];
  const c2 = [ // c_{2,i}
    2.710785400451478,
    3.474695137774395,
    4.005615092022595,
    5.167227058178125,
    5.959087954466332
  ];
  return (val: number): number => {
    const abs = Math.abs(val);
    const square = val * val;
    // exp{-x^2} * c0 / (x + b0)
    let prod = Math.exp(-square) * 0.5641895835477563 / (abs + 2.069550231329142);
    for (let i = 0; i < 5; i++) {
      prod *= (
        (square + c2[i] * abs + c1[i]) /
        (square + b2[i] * abs + b1[i])
      );
    }
    return sign(val) * (1 - prod);
  };
})();

/**
 * Gaussian hypergeometric function 2F1(a, b; c; x)
 */
export const hypergeometric2F1 = (
  a: number, b: number, c: number, x: number
): number => {
  if (x === 0) return 1;
  if (a * b === 0) return 1;
  let idx = 1,
    sum = 1, // zeroth term
    increment = (a * b / c) * x; // first term
  while (Math.abs(increment) > Math.abs(EPSILON * sum)) {
    sum += increment;
    increment *= ((++a) * (++b / ++c)) * x / (idx+1);
    idx++;
  }
  return sum;
};


/**
 * Gamma function approximation by Lanczos approximation whith
 *
 *     G = 8 and N = 12.
 * Only calculate the sumnation part.
 */
const lanczosG8N12 = {
  g: 8,
  coeffs_: [
    0.9999999999999999,
    1975.373902357885,
    -4397.382392792243,
    3462.632845986272,
    -1156.985143163117,
    154.5381505025278,
    -6.253671612368916,
    0.03464276245473681,
    -7.477617197444298e-7,
    6.30412538218523e-8,
    -2.7405717035683877e-8,
    4.048694881756761e-9
  ] as const as number[],
  /**
   * Summation part A_g(z).
   */
  sum_(a: number): number {
    if (isNaN(a) || a <= 0) return NaN;
    const coeffs = this.coeffs_;
    let sum = coeffs[0];
    for (let i = 1; i < coeffs.length; i++)
      sum += coeffs[i] / a++;
    return sum;
  }
};

export const gamma = (a: number): number => {
  if ( a > 171.6144788718229 ) {
    return Infinity;
  }
  if ( a < -170.5674972726612 ) {
    return 0.0;
  }
  if (a < 0.5)
    return Math.PI / (Math.sin(Math.PI * a) * gamma(1 - a)); // Reflection formula
  const g = lanczosG8N12.g;
  const factors = [
    (a-.5) * Math.log(a + g - .5),
    .5 - a - g,
    Math.log(lanczosG8N12.sum_(a))
  ];
  return SQRT2PI * Math.exp(sum(factors));
};

/**
 * Beta function B(a,b) by Spouge's approximation of gamma function.
 */
export const beta = (() => {
  const C = SQRT2PI * Math.exp(.5 - lanczosG8N12.g);
  return (a: number, b: number): number => {
    if (isNaN(a+b) || a <= 0 || b <= 0) return NaN;
    if (a === 1) return 1 / b;
    if (b === 1) return 1 / a;
    if (a < 0.5) return Math.PI / (b * Math.sin(Math.PI * a) * beta(1-a, a+b));
    const g = lanczosG8N12.g,
      s = lanczosG8N12.sum_(a) * (lanczosG8N12.sum_(b) / lanczosG8N12.sum_(a+b)),
      c = a + b + g - .5;
    a -= .5;
    b -= .5;
    return C * ((a+g) / c)**a * ((b+g) / c)**b / Math.sqrt(c) * s;
  };
})();

/**
 * Incomplete beta function.
 *                x
 * B_x(a, b) = integral t**(a-1) * (1-t)**(b-1) dt
 *                0
 */
export const betainc = (() => {
  const getCoeff = (x: number, a: number, b: number, idx: number): number => {
    let m: number;
    if (idx % 2) {
      m = (idx-1) / 2;
      return (
        -(a+m) * (a+b+m) * x /
        ((a+idx-1) * (a+idx))
      );
    } else {
      m = idx / 2;
      return (
        m * (b-m) * x /
        ((a+idx-1) * (a+idx))
      );
    }
  };
  return function betainc(
    x: number,
    a: number,
    b: number,
    regularized: boolean = true
  ): number {
    if (a <= 0 || b <= 0) return NaN;
    if (Number.isNaN(x) || x < 0 || x > 1) return NaN;
    if (x === 0) return 0;
    if (x === 1) return regularized ? 1 : beta(a, b);
    // Calculate continued fraction
    let complement = false,
      scale = regularized ? beta(a, b) : 1,
      numeratorM2 = 0, // A_{idx-2}
      numeratorM1 = 1, // A_{idx-1}, A_0 = b_0 = 1
      denominatorM2 =  1, // B_{idx-2}
      denominatorM1 = 1, // B_{idx-1}
      idx = 1,
      coeff: number, // a_n
      numerator: number,
      denominator: number,
      resultM1: number, // x_{n-1}
      result = Infinity; // x_n = A_n / B_n
    if (x > (a+1) / (a+b+2)) { // Compute directly may be slow.
      complement = true;
      if (!regularized) scale = beta(a, b);
      x = 1 - x;
      [a, b] = [b, a];
    }
    const factor = x**a * (1-x)**b / a / (regularized ? scale : 1);
    do {
      resultM1 = result;
      // calculate new data
      coeff = getCoeff(x, a, b, idx++);
      // A_n = b_n * numeratorM1 + a_n * numeratorM2
      numerator = numeratorM1 + coeff * numeratorM2;
      // B_n = b_n * denominatorM1 + a_n * denominatorM2
      denominator = denominatorM1 + coeff * denominatorM2;
      result = factor * numerator / denominator;
      // save previous
      numeratorM2 = numeratorM1;
      numeratorM1 = numerator;
      denominatorM2 = denominatorM1;
      denominatorM1 = denominator;
    } while (Math.abs(result - resultM1) > Math.abs(EPSILON * (result || 1)));
    if (complement)
      result = (regularized ? 1 : scale) - result;
    return result;
  };
})();
