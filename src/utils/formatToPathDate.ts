import dayjs from "dayjs";

export const formatToPathDate = (date: dayjs.Dayjs): string => {
  return dayjs(date).format("YYYY-MM-DD");
};
