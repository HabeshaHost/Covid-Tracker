import React, { useState, useEffect, useMemo } from "react";
import {
  StateData,
  StateMetadata,
  TestMetrics,
} from "../../api/types";
import { Table, Spin, Alert } from "antd";
import type { TableColumnsType } from "antd";
import useGetStateData from "../../hooks/useGetStateData";
import { useLocation, useParams } from "react-router-dom";
import AppWrapper from "../../components/Wrappers/AppWrapper";
import queryString from "query-string";
import { STATE_META_DATA_KEY } from "../../utils/constants";
import { getFromSessionStorage } from "../../utils/getFromSessionStorage";
import './index.css';

const testsFilters = [
  {
    text: "PCR",
    value: "pcr",
    children: [
      {
        text: "Total",
        value: "pcr->total",
      },
      {
        text: "Pending",
        value: "pcr->pending",
      },
      {
        text: "Encounters",
        value: "pcr->encounters",
      },
      {
        text: "Specimens",
        value: "pcr->specimens",
      },
      {
        text: "Positive",
        value: "pcr->positive",
      },
      {
        text: "Negative",
        value: "pcr->negative",
      },
    ],
  },
  {
    text: "Antibody",
    value: "antibody",
    children: [
      {
        text: "Total",
        value: "antibody->total",
      },
      {
        text: "Pending",
        value: "antibody->pending",
      },
      {
        text: "Encounters",
        value: "antibody->encounters",
      },
      {
        text: "Specimens",
        value: "antibody->specimens",
      },
      {
        text: "Positive",
        value: "antibody->positive",
      },
      {
        text: "Negative",
        value: "antibody->negative",
      },
    ],
  },
  {
    text: "Antigen",
    value: "antigen",
    children: [
      {
        text: "Total",
        value: "antigen->total",
      },
      {
        text: "Pending",
        value: "antigen->pending",
      },
      {
        text: "Encounters",
        value: "antigen->encounters",
      },
      {
        text: "Specimens",
        value: "antigen->specimens",
      },
      {
        text: "Positive",
        value: "antigen->positive",
      },
      {
        text: "Negative",
        value: "antigen->negative",
      },
    ],
  },
];

const statesMetaData =
  getFromSessionStorage<StateMetadata[]>(STATE_META_DATA_KEY) ?? [];

const States: React.FC = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const { date } = useParams();
  const [currentOutcomeFilter, setCurrentOutcomeFilter] = useState("");
  const [currentCaseFilter, setCurrentCaseFilter] = useState("");
  const [currentTestFilter, setCurrentTestFilter] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const { search } = useLocation();
  const currentQuery = queryString.parse(search);

  const { data, isLoading, isError, total } = useGetStateData({
    selectedDate: date,
    selectedStates,
    page: pagination.current,
    pageSize: pagination.pageSize,
  });

  useEffect(() => {
    const defaultValue = statesMetaData
      .filter(({ stateCode }) =>
        String(currentQuery.states)
          .split(",")
          ?.includes(stateCode.toLowerCase())
      )
      .map(({ stateCode }) => stateCode.toLowerCase());
    setSelectedStates(defaultValue);
  }, [search]);

  const memoizedData = useMemo(() => data, [data]);

  const columns: TableColumnsType<StateData> = [
    { title: "State", dataIndex: "state", key: "stateCode", sorter: true },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Outcomes",
      dataIndex: ["outcomes", currentOutcomeFilter, "currently", "value"],
      key: "outcomes",
      filters: [
        { text: "Hospitalized", value: "hospitalized" },
        { text: "Death", value: "death" },
        { text: "Recovered", value: "recovered" },
      ],
      filterMultiple: false,
      onFilter: (value) => {
        setCurrentOutcomeFilter(value as string);
        return true;
      },
    },
    {
      title: "Cases",
      dataIndex: ["cases", currentCaseFilter, "value"],
      key: "cases",
      filters: [
        { text: "Total", value: "total" },
        { text: "Confirmed", value: "confirmed" },
        { text: "Probable", value: "probable" },
      ],
      filterMultiple: false,
      onFilter: (value) => {
        setCurrentCaseFilter(value as string);
        return true;
      },
    },
    {
      title: "Tests",
      dataIndex: ["tests", ...currentTestFilter, "value"],
      key: "tests",
      filters: testsFilters,
      onFilter: (value, record: StateData) => {
        if (typeof value === "string") {
          const [testType, metric] = value.split("->");
          const typedTestType = testType as keyof StateData["tests"];
          const typedMetric = metric as keyof TestMetrics;
          const testValue = record.tests?.[typedTestType]?.[typedMetric]?.value;
          const filterExists = testValue !== undefined && testValue !== null;
          // Check if the filter value has changed
          if (
            currentTestFilter[0] !== testType ||
            currentTestFilter[1] !== metric
          ) {
            setCurrentTestFilter([testType, metric]);
          }
          return filterExists;
        }
        return false;
      },
      filterMultiple: false,
    },
  ];

  if (isLoading) {
    return <Spin tip="Loading..." />;
  }

  if (isError) {
    return <Alert message="An error occurred" type="error" />;
  }

  return (
    <AppWrapper showFilter>
      <div className="container-style">
        <Table
          columns={columns}
          dataSource={memoizedData?.map(({ state, ...rest }) => ({
            state: statesMetaData.filter(
              ({ stateCode }) => stateCode === state
            )[0].name,
            ...rest,
          }))}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
          }}
          onChange={({ pageSize, current }) =>
            setPagination({ pageSize: pageSize || 0, current: current || 0 })
          }
        />
      </div>
    </AppWrapper>
  );
};

export default States;
