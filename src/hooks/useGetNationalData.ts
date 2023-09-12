import { useCallback, useEffect, useState } from "react";
import { NationalData } from "../api/types";
import {
  fetchNationalHistoricData,
} from "../api/requests";

interface GetNationalDataType {
  selectedDate?: string;
  page?: number,
  pageSize?: number
}

const useGetNationalData = ({
  selectedDate,
  page,
  pageSize
}: GetNationalDataType) => {
  const [data, setData] = useState<NationalData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<unknown>(null);
  const [total, setTotal] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(null);
    try {
      const responseData = await fetchNationalHistoricData(selectedDate);
      setData(responseData.data);
      setTotal(responseData.total);
    } catch (err: unknown) {
      setIsError(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return { data, isLoading, isError, total };
};

export default useGetNationalData;
