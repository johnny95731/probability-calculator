import { isNullish } from './helpers';

// Constants
export const EPSILON = 1e-13;
/**
 * Rounding to specific place value. Positive means decimal places
 * and negative means whole number places.
 */
export const PLACE = 7;

/**
 * sqrt(2 * pi)
 */
export const SQRT2PI = Math.sqrt(2 * Math.PI);

/**
 * sqrt(pi / 2)
 */
export const SQRTPI_2 = Math.sqrt(Math.PI / 2);



/**
 * Rounding a number to specifit place value.
 * @param num A number.
 * @param place Rounding to specific place value. Positive means decimal places
 * and negative means whole number places.
 * @default 0
 * @return Percentage number.
 */
export const round = (num: number, place: number = 0): number =>
  Math.round(10**place * num) / 10**place;

/**
 * Clip the number in the range [`min`, `max`].
 * If `max < min`, it will check `max` first.
 * If `min` and/or `max` is undefined, it will be regarded as `-Infinity` (
 * for `min`) or `Infinity` (for `max`)
 */
export function clip(val: MaybeRef<number | string>, min?: number, max?: number): number
/**
 * Clip the number in the range [`min`, `max`].
 * If `max < min`, it will check `max` first.
 * If `min` and/or `max` is undefined, it will be regarded as `-Infinity` (
 * for `min`) or `Infinity` (for `max`)
 */
export function clip(vals: MaybeRef<(number | string)[]>, min?: number, max?: number): number[]
export function clip(
  val: MaybeRef<number | string | (number | string)[]>,
  min?: number,
  max?: number
): number | number[] {
  val = unref(val);
  if (Array.isArray(val)) return val.map(x => clip(x, min, max));
  // The comparison is `true` means `max !== undefined`.
  if (+val > +max!) return max!;
  else if (+val < +min!) return min!;
  return +val;
};

/**
 * Count the length of decimals.
 */
export const countDecimals = (num: number)  => { // Twice faster
  if (Math.floor(num) === num) return 0;
  let str = Math.abs(num).toString();
  let counts = 0;
  if (str.indexOf('-') !== -1) {
    counts = +str.split('-')[1];
    str = str.split('e')[0];
  }
  return counts + (str.split('.')[1]?.length || 0);
};

export const sum = <T = number>(
  arr: T[],
  callback?: (prev: number, val: T, idx: number) => number
) => {
  return arr.reduce(callback ?? ((prev, val) => prev + +val), 0);
};

/**
 * Sign of a given value.
 */
export const sign = (val: number): number => {
  if (val > 0) return 1;
  if (val < 0) return -1;
  return 0;
};

export function sortArr(
  arr: MaybeRef<number[]>,
  callback?: ((a: number, b: number) => number)
): number[] {
  callback ??= (a, b) => a - b;
  const copy = JSON.parse(JSON.stringify(unref(arr))) as number[];
  return copy.sort(callback);
};

/**
 * Return evenly spaced values within a given interval (both side closed).
 * If only one argument is specified, the interval will be [0, start].
 * @param start Start of interval.
 * @param end End of interval.
 * @param step Spacing between values.
 * @param callback Remapping values: `callback(values of interval)`. The default
 * is identity function.
 */
export function arange(
  start: number,
  end?: number,
  step?: number,
  callback?: (val: number) => number,
): number[] {
  if (isNullish(end)) { // end is not given => generate numbers between [0, start].
    end = start;
    start = 0;
  }
  step ??= 1;
  if (
    (end < start && step > 0) ||
    (start > end && step < 0)
  ) [start, end] = [end, start];
  const num = Math.floor((end - start) / step);
  const result = linspace(start, start + step * (num-1), num, callback);
  result.push(end);
  return result;
}

/**
 * Return evenly spaced values within a given interval (both side closed).
 * @param start Start of interval.
 * @param end End of interval.
 * @param num Total numbers of values.
 * @param callback Handle values.
 */
export function linspace(
  start: number,
  end: number,
  num: number = 1000,
  callback?: (val: number) => number,
): number[] {
  if (isNaN(num) || !num) return [];
  if (start === end || num === 1) return [start];
  callback ??= (val) => val;
  const delta = (end - start) / (num - 1);
  const result = Array<number>(num);
  for (let i = 0; i < num; i++) result[i] = callback(start + i * delta);
  return result;
}
