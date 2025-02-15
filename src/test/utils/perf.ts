import { Bench } from 'tinybench';

export const random = (low: number = 0, high: number = 1): number => {
  return Math.random() * (high - low) + low;
};

type Record = {
  fn: string
  max: number | string
  maxVal: number | string,
  maxArg?: string
  relMax: number | string
  relMaxVal: number | string,
  relMaxArg: string
  min: number | string
  minVal: number | string
  minArg?: number | string
}
type ErrorType = 'max' | 'relMax' | 'min'

const initError = (name: string): Record => ({
  fn: name,
  max: -Infinity,
  maxVal: 0,
  maxArg: '',
  relMax: -Infinity,
  relMaxVal: 0,
  relMaxArg: '',
  min: Infinity,
  minVal: 0,
  minArg: '',
});

export const simpleValNError = <T extends CallableFunction, F>(
  fns: T[],
  std: T,
  data: F[]
) => {
  fns.splice(0, 0, std);
  const names = Math.max(...fns.map(fn => fn.name.length));
  fns.forEach(fn =>
    console.log(
      fn.name.padEnd(names, ' '),
      fn(...data),
      Math.abs(fn(...data) - fns[0](...data)) / fns[0](...data))
  );
};

export const maxErrorTest = <T extends CallableFunction, F>(
  fns: T[],
  std: T,
  data: F[][],
  argFormatter?: ((args: typeof data[number]) => string)
) => {
  argFormatter ??= (args) => {
    return args.map(val =>
      typeof val === 'number' ? val.toFixed(2) : (val ? 'T' : 'F')
    ).join(',');
  };
  const erorrs = Array.from(fns, fn => initError(fn.name));
  data.forEach((args) => {
    const std_ = std(...args);
    const values: number[] = fns.map(fn => fn(...args));
    for (let i = 0; i < erorrs.length; i++) {
      const err = Math.abs(std_ - values[i]);
      const relErr = err / Math.abs(std_);
      if (err > +erorrs[i].max) {
        erorrs[i].max = err;
        erorrs[i].maxVal = values[i].toExponential(5);
        erorrs[i].maxArg = argFormatter(args);
      }
      if (relErr > +erorrs[i].relMax) {
        erorrs[i].relMax = relErr;
        erorrs[i].relMaxVal = values[i].toExponential(5);
        erorrs[i].relMaxArg = argFormatter(args);
      }
      if (err < +erorrs[i].min) {
        erorrs[i].min = err;
        erorrs[i].minVal = values[i].toExponential(5);
        erorrs[i].minArg = argFormatter(args);
      }
    }
  });
  for (let i = 0; i < erorrs.length; i++) {
    for (const key of ['max', 'relMax', 'min'] as const as ErrorType[])
      erorrs[i][key] = (erorrs[i][key] as number).toExponential(5);
  }
  console.table(erorrs);
  // console.log();
};

export const performanceTest = async <T extends CallableFunction, F>(
  testName: string,
  fns: T[],
  data: () => F[]
) => {
  const bench = new Bench({ name: testName, time: 100 });
  console.log(bench.name);
  fns.forEach(fn => {
    bench.add(fn.name, () => {
      fn(...data());
    });
  });
  await bench.run();
  console.table(bench.table());
  return [bench.name, bench.table()];
};
