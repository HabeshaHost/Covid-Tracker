import { isEmpty } from "lodash";
import { NationalData, StateData, StateMetadata } from "./types";
import axiosInstance from "./utils/axiosInstance";

export const fetchNationalHistoricData = async (): Promise<NationalData[]> =>
  (await axiosInstance.get("/us/daily")).data;

export const fetchNationalSingleData = async (
  date: string
): Promise<NationalData[]> => [
  (await axiosInstance.get(`/us/daily/${date}`)).data,
];

export const fetchAllStateMetadata = async (): Promise<StateMetadata[]> =>
  (await axiosInstance.get("/states"))?.data;

export const fetchStateData = async (
    states: string[],
    date?: string
  ): Promise<StateData[]> => {
    if (isEmpty(states)) {
      return [];
    }
  
    const stateCodes = states.join(',');
    let url = `/states/daily?stateCodes=${stateCodes}`;
  
    if (date) {
      url += `&date=${date}`;
    }
  
    const response = await axiosInstance.get(url);
    return response.data;
  };

