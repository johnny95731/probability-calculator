
export type valueof<T> = T[keyof T]

export type MaybeArray<T> = T | T[];

/**
 * Abstract object.
 */
export type AbsObject = Record<string, unknown>

export type Numberish = number | `${number}`;
export type Nullish = null | undefined
