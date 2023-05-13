import os from "os";

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

async function debounce(
  fn: (...args: any[]) => any,
  timeout: number
): Promise<void> {
  return new Promise((resolve) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      await fn();
      resolve();
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
