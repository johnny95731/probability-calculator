import { round, EPSILON, binomialCoeff, SQRT2PI } from 'utils/numeric';
import betaStd from '@stdlib/math-base-special-beta';
import { maxErrorTest, performanceTest, random, simpleValNError } from './perf';

/**
 * Gamma function approximation by Lanczos approximation whith
 *
 *     G = 8 and N = 12.
 * Only calculate the sumnation part.
 */
const lanczosG8N12 = {
  G: 8,
  coeffs: [
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
  sum(x: number): number {
    if (isNaN(x) || x <= 0) return NaN;
    const coeffs = this.coeffs;
    let sum = coeffs[0];
    for (let i = 1; i < coeffs.length; i++)
      sum += coeffs[i] / x++;
    return sum;
  }
};

/**
 * Spouge's approximation.
 */
const spouge = {
  /**
   * Get maximum error of approximation with n coefficients.
   */
  maxError_: (n: number) => 1 / ((2*Math.PI)**(n) * Math.sqrt(2*Math.PI*n)),
  /**
   * Evaluate the coefficients of Spouge's approximation by a given maximum error
   * or by a total number of coefficients.
   */
  updateCoeffs_(
    args?: {
      /**
       * Maximum error. If both arguments are not specified,
       */
      epsilon?: number,
      /**
       * Total number of coefficients. Higher priority
       */
      num?: number,
    }
  ) {
    let num: number;
    if (args?.num !== undefined && args?.num >= 1) num = args.num;
    else {
      const epsilon = args?.epsilon ?? 1e-10;
      num = 2;
      while(this.maxError_(++num) > epsilon);
    }
    const coeffs = [ SQRT2PI ]; // a_0
    let prod = 1;
    for (let k = 1; k < num; k++) {
      coeffs.push(
        prod * (num-k)**(k-.5) * Math.exp(num-k)
      );
      prod /= -k;
    }
    this.coeffs_ = coeffs;
    return coeffs;
  },
  /**
   * The summation coefficients of Spouge's approximation
   */
  coeffs_: [] as number[],
  /**
   * Gamma function approximation by Spouge's approximation.
   * Only calculate the summation part.
   */
  sum(x: number): number {
    if (isNaN(x) || x <= 0) return NaN;
    const coeffs = this.coeffs_;
    let sum = coeffs[0];
    for (let i = 1; i < coeffs.length; i++) {
      sum += coeffs[i] / ++x;
    }
    // return (x+n)**(x+.5) * Math.exp(-x-n) * sum;
    return sum;
  }
};
spouge.updateCoeffs_();

const C = SQRT2PI * Math.exp(.5 - lanczosG8N12.G);
/**
 * Beta function B(a, b)
 * @returns
 */
const betaLanczos = (a: number, b: number): number => {
  if (isNaN(a+b) || a <= 0 || b <= 0) return NaN;
  if (a === 1) return 1 / b;
  if (b === 1) return 1 / a;
  if (a < 0.5) return Math.PI / (b * Math.sin(Math.PI * a) * betaLanczos(1-a, a+b));
  const G = lanczosG8N12.G,
    s = lanczosG8N12.sum(a) * (lanczosG8N12.sum(b) / lanczosG8N12.sum(a+b)),
    c = a + b + G - .5;
  a -= .5;
  b -= .5;
  return C * ((a+G) / c)**a * ((b+G) / c)**b / Math.sqrt(c) * s;
};

/**
 * Beta function B(a,b) by Spouge's approximation of gamma function.
 * @returns
 */
const betaSpouge = (a: number, b: number): number => {
  if (isNaN(a+b) || a <= 0 || b <= 0) return NaN;
  if (a === 1) return 1 / b;
  if (b === 1) return 1 / a;
  if (a > b) [b, a] = [a, b];
  if (a < 0.5) return Math.PI / (b * Math.sin(Math.PI * a) * betaSpouge(1-a, a+b));
  a--;
  b--;
  const s = spouge.sum(a) * (spouge.sum(b) / spouge.sum(a+b+1)),
    n = spouge.coeffs_.length,
    c = a + b + n + 1,
    factor = (
      ((a+n)/c)**(a+.5) * ((b+n)/c)**(b+.5) / Math.sqrt(c) * Math.exp(1-n)
    );
  return s * factor;
};



/**
 * Beta function B(a,b) approximation by Stirling's approximation.
 * Error <1e-20 for a and b satisfied min(a,b) >= 50.
 */
const betaStirling = (a: number, b: number): number => {
  const c = a / (a + b);
  return SQRT2PI * c**(a-.5) * (1-c)**(b-.5) * Math.sqrt(a+b);
};


const betaAssign = (a: number, b: number): number => {
  if (isNaN(a+b) || a <= 0 || b <= 0) return NaN;
  if (a === 1) return 1 / b;
  if (b === 1) return 1 / a;
  if (Number.isInteger(a) && Number.isInteger(b) && a + b < 250)
    return (a+b) / ((a*b) * binomialCoeff(a+b, a));
  if (a > b) [b, a] = [a, b];
  // Spouge's approximation
  a--;
  b--;
  const s = spouge.sum(a) * (spouge.sum(b) / spouge.sum(a+b+1)),
    n = spouge.coeffs_.length,
    c = a + b + n + 1,
    factor = (
      ((a+n)/c)**(a+.5) * ((b+n)/c)**(b+.5) / Math.sqrt(c) *
        Math.exp(1-n)
    );
  return s * factor;
};

function binomial(a: number, b: number): number {
  return (a+b) / ((a*b) * binomialCoeff(a+b, a));
}


/*
const fnsErr = [
  betaLanczos,
  betaSpouge,
  betaStirling,
  // betaStirlingModify,
  // betaAssign,
  // beta,
];
const b = 0;
for (let a=b; a < b+110; a+= 10) {
  console.log('Increasing a.');
  maxErrorTest(
    fnsErr,
    betaStd,
    Array.from({length: 50000 }, _ => [random(a, a+50), random(a, a+50)] as const)
  );
  console.log('Increasing b.');
  maxErrorTest(
    fnsErr,
    betaStd,
    Array.from({length: 50000 }, _ => [random(a, a+50), random(a, a+50)] as const)
  );
  // console.log(`Increasing both a and b. x=${x} a=${a}`);
  // maxErrorTest(Array.from({length: 10000 }, (_, i) =>
  //   [x, a + random(-1,1), a + random(-1,1)])
  // );
} // */


/**
const fnsPerf = [
  betaStd,
  betaLanczos,
  betaSpouge,
  betaStirling,
];
const c = 0;
for (let a=c; a < c+1600; a+= 20) {
  await performanceTest(
    `betainc base=${a} a ascending`,
    fnsPerf,
    () => [a+100+random(), random(0,a)] as const
  );
  await performanceTest(
    `betainc base=${a} b ascending`,
    fnsPerf,
    () => [random(0,a), a+100+random()] as const
  );
  await performanceTest(
    `betainc base=${a} both ascending`,
    fnsPerf,
    () => [a+random(0, 1), a+random(0, 1)] as const
  );
  // await performanceTest(
  //   `betainc base=${a} random integers.`,
  //   // [int, Math.floor(10000 / int)]
  //   // [Math.floor(random(a, a+20)), Math.floor(random(0, 20))]
  //   () => {
  //     const int = Math.floor(random(a, a+20));
  //     return [int, 350 - int];
  //   }
  // );
} //  */
