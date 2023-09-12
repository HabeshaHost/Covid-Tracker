import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import axios from "axios";
import { toCamelCase } from "./helpers/toCamelCase";
import { paginate } from "./helpers/pagination";

const app = express();
const BASE_URL = "https://api.covidtracking.com/v2";

app.use(cors());
app.use(express.json());

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

const handleError = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await next();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const constructUrl = (stateCode: string, date?: string) => {
  return date
    ? `/states/${stateCode.toLowerCase()}/${date}.json`
    : `/states/${stateCode.toLowerCase()}/daily.json`;
};

app.use(handleError);

app.get("/api/us/daily/:date?", async (req, res) => {
  const { date } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const url = `/us/daily${date ? `/${date}` : ""}.json`;

  try {
    const response = await axiosInstance.get(url);
    const data = toCamelCase(response.data.data);

    const paginatedData = paginate(date ? [{ ...data }] : data, {
      page,
      pageSize,
    });
    return res.json({
      page,
      pageSize,
      total: data.length,
      data: paginatedData.data,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.get("/api/states", async (req, res) => {
  const response = await axiosInstance.get("/states.json");
  res.json(toCamelCase(response.data.data));
});

app.get("/api/states/daily", async (req, res) => {
  const stateCodes = (req.query.stateCodes as string).split(",");
  const date = req.query.date as string;
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  if (!stateCodes || !Array.isArray(stateCodes)) {
    return res.status(200).json([]);
  }

  const promises = stateCodes.map(async (stateCode) => {
    const url = constructUrl(stateCode, date);
    const response = await axiosInstance.get(url);
    return toCamelCase(response.data.data);
  });

  const arrayOfArrays = await Promise.all(promises);
  const flatArray = arrayOfArrays.flat();
  const paginatedResult = paginate(flatArray, { page, pageSize });
  res.json(paginatedResult);
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
