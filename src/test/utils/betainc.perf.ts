import { round, EPSILON, beta } from 'utils/numeric';
import betaincStd from '@stdlib/math-base-special-betainc';
import { maxErrorTest, performanceTest, simpleValNError } from './perf';


const random = (low: number = 0, high: number = 1): number => {
  return Math.random() * (high - low) + low;
};

/**
 * Gaussian hypergeometric function 2F1(a, b; c; x)
 */
const hypergeometric2F1 = (
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
 * A special case of Gauss hypergeometric function: 2F1(a, 1-b; a+1; x)
 */
const betaincSeries = (
  a: number, b: number, x: number, init: number
): number => {
  if (b === 1) return init;
  b = 1 - b;
  let idx = 1,
    sum = init, // zeroth term
    increment = init * (b++  * (a / ++a)) * x; // first term
  while (Math.abs(increment) > Math.abs(EPSILON * sum)) {
    sum += increment;
    increment *= (b++ * (a / ++a)) * (x / ++idx);
  }
  return sum;
};



/**
 * Incomplete beta function
 *                x
 * B_x(a, b) = integral t**(a-1) * (1-t)**(b-1) dt
 *                0
 */
const betainc1 = (
  x: number, a: number, b: number,
  regularized: boolean = true
): number => {
  if (a <= 0 || b <= 0) return NaN;
  if (Number.isNaN(x) || x < 0 || x > 1) return NaN;
  if (x === 0) return 0;
  if (x === 1) return regularized ? 1 : beta(a, b);
  if (x > (a+1) / (a+b+2)) { // Compute directly may be slow.
    const beta_ = beta(a, b);
    return (beta_ - betainc1(1-x, b, a, false)) / (regularized ? beta_ : 1);
  }
  return betaincSeries(a, b, x, x**a / a) / (regularized ? beta(a, b) : 1);
};

const betainc2 = (
  x: number, a: number, b: number,
  regularized: boolean = true
): number => {
  if (a <= 0 || b <= 0) return NaN;
  if (Number.isNaN(x) || x < 0 || x > 1) return NaN;
  if (x === 0) return 0;
  if (x === 1) return regularized ? 1 : beta(a, b);
  if (x > (a+1) / (a+b+2)) { // Compute directly may be slow.
    const beta_ = beta(a, b);
    return (beta_ - betainc2(1-x, b, a, false)) / (regularized ? beta_ : 1);
  }
  return (x**a * (1-x)**(b-1) / a) * hypergeometric2F1(a+b, 1, a+1, x) / (regularized ? beta(a, b) : 1);
};

const betainc3 = (
  x: number, a: number, b: number,
  regularized: boolean = true
): number => {
  if (a <= 0 || b <= 0) return NaN;
  if (Number.isNaN(x) || x < 0 || x > 1) return NaN;
  if (x === 0) return 0;
  if (x === 1) return regularized ? 1 : beta(a, b);
  let complement = false,
    beta_ = regularized ? beta(a, b) : 1,
    result: number;
  if (x > (a+1) / (a+b+2)) { // Compute directly may be slow.
    complement = true;
    if (!regularized) beta_ = beta(a, b);
    x = 1-x;
    [a, b] = [b, a];
  }
  const factor = x**a * (1-x)**b / a / (regularized ? beta(a, b) : 1);
  result = factor * hypergeometric2F1(1, 1-b, a+1, x/(x-1));
  if (complement)
    result = (regularized ? 1 : beta_) - result;
  return result;
};

const betainc4 = (() => {
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
  return function betainc4(
    x: number, a: number, b: number,
    regularized: boolean = true,
  ): number {
    if (a <= 0 || b <= 0) return NaN;
    if (Number.isNaN(x) || x < 0 || x > 1) return NaN;
    if (x === 0) return 0;
    if (x === 1) return regularized ? 1 : beta(a, b);
    // Calculate continued fraction
    let complement = false,
      beta_ = regularized ? beta(a, b) : 1,
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
      if (!regularized) beta_ = beta(a, b);
      x = 1-x;
      [a, b] = [b, a];
    }
    const factor = x**a * (1-x)**b / a / (regularized ? beta_ : 1);
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
      result = (regularized ? 1 : beta_) - result;
    return result;
  };
})();

const betainc5 = (() => {
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
  return function betainc5(
    x: number, a: number, b: number,
    regularized: boolean = true
  ): number {
    if (a <= 0 || b <= 0) return NaN;
    if (Number.isNaN(x) || x < 0 || x > 1) return NaN;
    if (x === 0) return 0;
    if (x === 1) return regularized ? 1 : beta(a, b);
    if (x > (a+1) / (a+b+2)) { // Compute directly may be slow.
      const beta_ = beta(a, b);
      return (beta_ - betainc5(1-x, b, a, false)) / (regularized ? beta_ : 1);
    }
    // Calculate continued fraction
    let numeratorM2 = 1, // A_{idx-2}
      numeratorM1 = 1, // A_{idx-1} = b_0 = 1
      denominatorM2 =  0, // B_{idx-2}
      denominatorM1 = 1, // B_{idx-1}
      idx = 1,
      coeff = getCoeff(x, a, b, idx), // a_n
      // A_n = b_n * numeratorM1 + a_n * numeratorM2
      numerator = numeratorM1 + coeff * numeratorM2,
      // B_n = b_n * denominatorM1 + a_n * denominatorM2
      denominator = denominatorM1 + coeff * denominatorM2,
      resultM1 = Infinity, // x_{n-1}
      result = numerator / denominator; // x_n = A_n / B_n
    while (Math.abs(result - resultM1) > EPSILON) {
      // save previous
      resultM1 = result;
      numeratorM2 = numeratorM1;
      numeratorM1 = numerator;
      denominatorM2 = denominatorM1;
      denominatorM1 = denominator;
      // calculate new data
      coeff = getCoeff(x, a, b, ++idx);
      numerator = numeratorM1 + coeff * numeratorM2;
      denominator = denominatorM1 + coeff * denominatorM2;
      result = numerator / denominator;
    }
    return x**a * (1-x)**b / (a * result * (regularized ? beta(a, b) : 1));
  };
})();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const betaincAssign = (
  x: number, a: number, b: number,
  regularized: boolean = true
): number => {
  if (Math.max(a,b) > 250 || b - a > 100) return betainc2(x,a,b,regularized);
  else return betainc1(x,a,b,regularized);
};


const regularized = true;
// /*
const fnsErr = [
  betainc1,
  betainc2,
  // betainc3,
  betainc4,
  // betainc5,
  // betaincAssign,
];
const b = 1;
for (let a=b; a < b+50; a+= 10) {
  for (let x = 0.1; x < 1; x+=.1) {
    x = round(x, 5);
    if (x > 1) x = 1;
    console.log(`Increasing a. x=${x}`);
    maxErrorTest(
      fnsErr,
      betaincStd,
      Array.from({length: 50000 }, _ => [x, random(0, 500), random(0, 500), regularized]),
    );
    console.log(`Increasing b. x=${x}`);
    maxErrorTest(
      fnsErr,
      betaincStd,
      Array.from({length: 50000 }, _ => [x, random(0, 500), random(0, 500), regularized]),
    );
    // console.log(`Increasing both a and b. x=${x} a=${a}`);
    // maxErrorTest(Array.from({length: 10000 }, (_, i) =>
    //   [x, a + random(-1,1), a + random(-1,1)])
    // );
  }
} // */


const data = [0.1, 468.04, 6.37, false];
const fns_ = [
  betainc1,
  betainc2,
  betainc4,
];
simpleValNError(fns_, betaincStd, data);

// /*
const c = 0;
const fnsPerf = [
  betaincStd,
  betainc1,
  betainc2,
  // betainc3,
  betainc4,
  // betainc5,
  // betaincAssign,
];
for (let a=c; a < c+10; a+= 10) {
  for (let x = 0.1; x < 1; x+=0.1) {
    x = round(x, 5);
    if (x > 1) x = 1;
    // await performanceTest(
    //   `betainc x=${x} a ascending. base=${a}`,
    //   Array.from({length: 1000 }, (_, i) => [x, a+100+random(), random(0,a)])
    // );
    // await performanceTest(
    //   `betainc x=${x} b ascending. base=${a}`,
    //   Array.from({length: 1000 }, (_, i) => [x, random(0,a), a+100+random()])
    // );
    // await performanceTest(
    //   `betainc x=${x} both ascending. base=${a}`,
    //   Array.from({length: 1000 }, (_, i) => [x, a+random(0, 1), a+random(0, 1)])
    // );
    await performanceTest(
      `betainc x=${x} random(0, 1000)`,
      fnsPerf,
      () => [x, random(0, 300), random(0, 300), regularized]
    );
    await performanceTest(
      `betainc x=${x} random integers. base=${a}`,
      fnsPerf,
      () => [x, round(random(1, 300)), round(random(1, 300)), regularized]
    );
  }
} // */
