import { useCallback, useEffect, useState } from "react";
import { StateData } from "../api/types";
import { fetchStateData } from "../api/requests";

interface GetStateDataType {
  selectedDate?: string,
  selectedStates: string[],
  page?: number,
  pageSize?: number
}

const useGetStateData = ({ selectedDate, selectedStates,page, pageSize }: GetStateDataType) => {
  const [data, setData] = useState<StateData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<Error | null>(null);
  const [total, setTotal] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(null);
    try {
      const data = await fetchStateData(selectedStates, selectedDate, page, pageSize);
      setData(data.data);
      setTotal(data.total);
    } catch (err: any) {
      setIsError(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedStates, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return { data, isLoading, isError, total };
};

export default useGetStateData;
