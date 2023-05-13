export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

/**
 * A workaround to include any string in a union type
 * while still preserving inference of literal string types.
 */
export type OrAnyString = string & {};

/**
 * Extracts the placeholders such as <%text%> from a string.
 */
export type ExtractPlaceholders<T extends string> =
  T extends `${infer Before}<%${infer Name}%>${infer After}`
    ? ExtractPlaceholders<Before> | Name | ExtractPlaceholders<After>
    : never;

/**
 * Enforces a very specific type
 *
 * A string that is branded will no longer be assignable to a string.
 * You must use `as Brand` to cast it to the branded type.
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * Serenade command ID - Branded type
 *
 * Use `as CommandID` if something should be a command ID.
 */
export type CommandID = serenade.CommandID;
