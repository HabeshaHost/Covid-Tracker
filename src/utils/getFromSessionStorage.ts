import _ from "lodash";

export function getFromSessionStorage<T>(
  key: string,
): T | null {
  const item = sessionStorage.getItem(key);
  if (!item) {
    return null;
  }

  const parsedData = _.attempt(JSON.parse, item);
  if (_.isError(parsedData)) {
    console.error(`Invalid JSON string for key ${key}:`, parsedData);
    return null;
  }

  return parsedData;
}
