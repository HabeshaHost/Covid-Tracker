import dayjs from "dayjs";

export const updateOrAppendDateToPath = (path: string, newDate: string): string => {
  const segments = path.split("/");
  if (dayjs(segments[segments.length - 1]).isValid()) {
    segments[segments.length - 1] = newDate;
  } else {
    segments.push(newDate);
  }
  return segments.filter(segment => segment !== "").join("/");
};