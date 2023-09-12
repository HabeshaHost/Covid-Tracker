import _ from "lodash";

interface PaginationParams {
  page: number;
  pageSize: number;
}

interface PaginatedResult<T> {
  page: number;
  pageSize: number;
  total: number;
  data: T[];
}

export const paginate = <T>(
  array: T[],
  params: PaginationParams
): PaginatedResult<T> => {
  const { page, pageSize } = params;

  const startIndex = (page - 1) * pageSize;
  const paginatedData = _.slice(array, startIndex, startIndex + pageSize);

  return {
    page,
    pageSize,
    total: array.length,
    data: paginatedData,
  };
};
