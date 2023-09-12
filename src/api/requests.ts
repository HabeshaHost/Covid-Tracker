import { isEmpty } from "lodash";
import { NationalResponse, StateDataResponse, StateMetadata } from "./types";
import axiosInstance from "./utils/axiosInstance";

export const fetchNationalHistoricData = async (
  date?: string
): Promise<NationalResponse> => {
  return (await axiosInstance.get(`/us/daily${date ? `/${date}` : ""}`)).data;
}
  

export const fetchAllStateMetadata = async (): Promise<StateMetadata[]> =>
  (await axiosInstance.get("/states"))?.data;

export const fetchStateData = async (
  states: string[],
  date?: string,
  page?: number,
  pageSize?: number
): Promise<StateDataResponse> => {
  if (isEmpty(states)) {
    return {
      data: [],
      pageSize: 0,
      page: 10,
      total: 0,
    };
  }

  const stateCodes = states.join(",");

  let url = `/states/daily?stateCodes=${stateCodes}`;
  if (date) {
    url += `&date=${date}`;
  }
  if (page) {
    url += `&page=${page}`;
  }
  if (pageSize) {
    url += `&pageSize=${pageSize}`;
  }

  const response = await axiosInstance.get(url);
  return response.data;
};
