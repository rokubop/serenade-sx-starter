import os from "os";

const NUMBERS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
  "twenty one",
  "twenty two",
  "twenty three",
  "twenty four",
  "twenty five",
  "twenty six",
  "twenty seven",
  "twenty eight",
  "twenty nine",
  "thirty",
  "thirty one",
  "thirty two",
  "thirty three",
  "thirty four",
  "thirty five",
  "thirty six",
  "thirty seven",
  "thirty eight",
  "thirty nine",
  "forty",
  "forty one",
  "forty two",
  "forty three",
  "forty four",
  "forty five",
  "forty six",
  "forty seven",
  "forty eight",
  "forty nine",
  "fifty",
  "fifty one",
  "fifty two",
  "fifty three",
  "fifty four",
  "fifty five",
  "fifty six",
  "fifty seven",
  "fifty eight",
  "fifty nine",
  "sixty",
  "sixty one",
  "sixty two",
  "sixty three",
  "sixty four",
  "sixty five",
  "sixty six",
  "sixty seven",
  "sixty eight",
  "sixty nine",
  "seventy",
  "seventy one",
  "seventy two",
  "seventy three",
  "seventy four",
  "seventy five",
  "seventy six",
  "seventy seven",
  "seventy eight",
  "seventy nine",
  "eighty",
  "eighty one",
  "eighty two",
  "eighty three",
  "eighty four",
  "eighty five",
  "eighty six",
  "eighty seven",
  "eighty eight",
  "eighty nine",
  "ninety",
  "ninety one",
  "ninety two",
  "ninety three",
  "ninety four",
  "ninety five",
  "ninety six",
  "ninety seven",
  "ninety eight",
  "ninety nine",
  "one hundred",
];

/**
 * Type safe version of `Object.entries`
 */
function entriesOf<T extends Record<PropertyKey, unknown>>(
  obj: T
): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

/**
 * Type safe version of `Object.keys`
 */
function keysOf<T extends Record<PropertyKey, unknown>>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * For iterating object key/values with type safety
 */
function forEachKeyVal<
  Obj extends Record<PropertyKey, unknown>,
  Callback extends (key: keyof Obj, value: Obj[keyof Obj]) => void
>(obj: Obj, fn: Callback) {
  return entriesOf(obj).forEach(([key, value]) => fn(key, value));
}

// you can use native api.delay() instead
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait a short amount of time before executing a function
 * to deduplicate multiple calls to the same function
 */
let timer: NodeJS.Timeout;

async function debounce<T>(
  fn: (...args: any[]) => Promise<T>,
  timeout: number
): Promise<T> {
  return new Promise((resolve, reject) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    }, timeout);
  });
}

function chunkArray<T>(array: T[], chunkSize: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

function isLinux() {
  return os.platform() === "linux";
}

function isMac() {
  return os.platform() === "darwin";
}
function isWindows() {
  return os.platform() === "win32";
}

export {
  NUMBERS,
  chunkArray,
  debounce,
  entriesOf,
  forEachKeyVal,
  isLinux,
  isMac,
  isWindows,
  keysOf,
  sleep,
};
