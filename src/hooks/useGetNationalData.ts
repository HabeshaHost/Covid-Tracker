import { useCallback, useEffect, useState } from "react";
import { NationalData } from "../api/types";
import {
  fetchNationalHistoricData,
  fetchNationalSingleData,
} from "../api/requests";

interface GetNationalDataType {
  selectedDate?: string;
}

const useGetNationalData = ({
  selectedDate,
}: GetNationalDataType) => {
  const [data, setData] = useState<NationalData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(null);
    try {
      const data = selectedDate
        ? await fetchNationalSingleData(selectedDate)
        : await fetchNationalHistoricData();
      setData(data);
    } catch (err: any) {
      setIsError(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isError };
};

export default useGetNationalData;
