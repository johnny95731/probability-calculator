import type { ModelRef, WritableComputedRef } from 'vue';
import type { Nullish, Numberish } from './type-helpers';
import type { Range } from './distributions/common';

/**
 * Convert string(s) to Vuetify margin class format.
 */
export const toMargin = (str: string | string[]): string => {
  if (Array.isArray(str))
    return str.map(val => toMargin(val)).join(' ');
  if (str.includes(' '))
    return toMargin(str.split(' '));
  return `m${str}`;
};

/**
 * Custom keydown event on ArrowUp/ArrowDown
 */
export const vuetifyInputKeydownWrapper = (
  /**
   * Origin step
   */
  originStep: number,
  targetStep: number,
  ref: Ref<number> | ModelRef<number> | WritableComputedRef<number>,
  range?: Range
) => {
  const { min, max } = range ?? {};
  const unit = targetStep - originStep;
  if (!unit) return () => {};
  return (e: KeyboardEvent) => {
    // Default keydown event will +1/-1 on model. And update:model-value will be
    // triggered after keydown event.
    if (e.key === 'ArrowUp') {
      if (!(ref.value > +max! - targetStep)) // `undefined` will be true.
        ref.value += unit;
      else
        ref.value = max!;
    }
    else if (e.key === 'ArrowDown') {
      if(!(ref.value < +min! + targetStep)) // `undefined` will be true.
        ref.value -= unit;
      else
        ref.value = min!;
    }
  };
};

/**
 * Add a single space before capital letters (except first letter).
 */
export const sepByCap = (str: string): string => {
  return toSingleSpace(str.replace(/([A-Z])/g, ' $1').trim());
};

/**
 * Replace multiple spaces with a single space.
 */
export const toSingleSpace = (str: string): string => {
  return str.replace(/\s\s+/g, ' ');
};

/**
 * Check whether a value is `null` or `undefined`
 */
export const isNullish = (val: unknown) => val == null;

const isObject = (val: unknown) => {
  return val && typeof val === 'object' && !Array.isArray(val);
};

export const isArray = (val: unknown) => {
  return Array.isArray(val);
};

/**
 * Deeply merge objects.
 */
export const mergeObjects = (...objs: any[]) => { // eslint-disable-line
  if (!objs?.length) return {};
  const result = {} as Record<string, unknown>;
  for (;objs.length > 0;) {
    const source = objs.shift();
    if (isObject(source)){
      for (const key in source){
        if (isObject(source[key]) && !isPrototypePolluted(key)){
          if (!isObject(result[key])) result[key] = {};
          result[key] = mergeObjects(result[key], source[key]);
        } else if (isArray(source[key])) {
          if (!isArray(result[key])) {
            // @ts-expect-error
            result[key] = [].concat(source[key]);
          } else {
            result[key] = (result[key] as Array<unknown>).concat(source[key]);
          }
        } else {
          Object.assign(result, {[key]: source[key]});
        }
      }
    }
  }
  return result;
};

function isPrototypePolluted(key: string){
  return /__proto__|constructor|prototype/.test(key);
}

export function toCSSLength(str: string | Numberish | Nullish) {
  if (isNullish(str)) return;
  if (
    !isNaN(+str) || // Numberish
    ( // can be transform to a number.
      !isContainingUnit(str as string) &&
      !isNaN(parseFloat(str as string))
    )
  ) return `${parseFloat(str as string)}px`;
  return str as string;
}

/**
 * Check whether the string is containing a CSS length unit.
 */
function isContainingUnit(str: string) {
  return /p[xtc]|in|Q|%|[cem]m|v[hw]/.test(str);
};
