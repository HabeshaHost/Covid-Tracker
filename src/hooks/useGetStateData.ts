import { useCallback, useEffect, useState } from "react";
import { StateData } from "../api/types";
import { fetchStateData } from "../api/requests";

interface GetStateDataType {
  selectedDate?: string,
  selectedStates?: string[]
}

const useGetStateData = ({ selectedDate, selectedStates }: GetStateDataType) => {
  const [data, setData] = useState<StateData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(null);
    try {
      const data = selectedStates ? selectedDate
        ? await fetchStateData(selectedStates, selectedDate)
        : await fetchStateData(selectedStates) : []
      setData(data);
    } catch (err: any) {
      setIsError(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedStates]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isError };
};

export default useGetStateData;
