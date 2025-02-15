/**
 * Check if a number is a valid probability value (in range [0, 1]).
 */
export const isValidProb = (val: number) => {
  return val >= 0 && val <= 1;
};

// Random Event (probability)
export type REventParamNameEnum = {
  /**
   * Event.
   */
  a: 'A',
  /**
   * Another event.
   */
  b: 'B',
  /**
   * Union
   */
  u: 'A⋃B',
  /**
   * Intersection
   */
  i: 'A⋂B',
  /**
   * Symmetric difference
   */
  s: 'AΔB',
  /**
   * Complement (A prime)
   */
  p: 'A\'',
  /**
   * Conditional probability, A|B
   */
  c: 'A|B',
  /**
   * Conditional probability (condition event and interested event are inverse),
   * B|A
   */
  ci: 'B|A',
}

export type REventParamKey = keyof REventParamNameEnum;
export type REventParamLabel = REventParamNameEnum[keyof REventParamNameEnum];
export const rEventArgKeys = [
  'a', 'b', 'u', 'i', 's', 'p', 'c', 'ci'
] as const satisfies REventParamKey[];

/**
 * Two-way map of parameter names
 */
export const rEventParamNameBiMap = {
  a: 'A',
  b: 'B',
  u: 'A⋃B',
  i: 'A⋂B',
  p: 'A\'',
  c: 'A|B',
  ci: 'B|A'
} as Record<REventParamKey, REventParamLabel> & Record<REventParamLabel, REventParamKey>;
rEventArgKeys.forEach(key => rEventParamNameBiMap[rEventParamNameBiMap[key]] = key);

export type REventArgs = Partial<Record<REventParamKey, number>>;

export type REventOption = {
  /**
   * Names of parameter.
   */
  keys_: REventParamKey[],
  /**
   * Validator of arguments
   */
  validator_: Validator[],
  /**
   * Formula text with specific argument.
   */
  formula_: (args: REventArgs) => string[]
};

export const createREventOption = (
  argsNames_: REventOption['keys_'],
  formula: REventOption['formula_'],
): REventOption => {
  const hasUnion = argsNames_.includes('u');
  const hasIntersection = argsNames_.includes('i');
  const validators = [probValidator];
  if (hasUnion) validators.push(unionValidator);
  if (hasIntersection) validators.push(intersectionValidator);
  return {
    keys_: argsNames_,
    validator_: validators,
    formula_: formula,
  };
};


/**
 * Validator of arguments
 */
export type Validator = (args: REventArgs) => null | string;

export const probValidator: Validator = (args) => {
  return Object.values(args).every(val => isValidProb(val)) ? null : '事件機率需介於0~1。';
};

export const unionValidator: Validator = (args) => {
  // Nullish `.a` and/or `.b` values gives `true` => ignore argument if not exists
  const isValid = !(args.a! > args.u!) && !(args.b! > args.u!);
  return isValid ? null : '事件聯集的機率不能小於個別事件發生的機率。';
};
export const intersectionValidator: Validator = (args) => {
  // Nullish value gives `true` => ignore argument if not exists
  const isValid = !(args.a! < args.i!) && !(args.b! < args.i!);
  return isValid ? null : '事件交集的機率不能大於個別事件發生的機率。';
};
