import { camelCase, isObject, mapKeys } from "lodash";

export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  } else if (isObject(obj)) {
    return mapKeys(
      Object.keys(obj).reduce((result: Record<string, any>, key) => {
        result[key] = toCamelCase((obj as Record<string, any>)[key]);
        return result;
      }, {} as Record<string, any>),
      (_, key) => camelCase(key)
    );
  }
  return obj;
}
