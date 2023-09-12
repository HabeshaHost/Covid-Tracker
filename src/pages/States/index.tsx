import React, { useState, useEffect, useMemo } from "react";
import { StateData, StateMetadata } from "../../api/types";
import { Table, Spin, Alert } from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { toNumber } from "lodash";
import useGetStateData from "../../hooks/useGetStateData";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import AppWrapper from "../../components/Wrappers/AppWrapper";
import queryString from "query-string";
import { STATE_META_DATA_KEY } from "../../utils/constants";
import { getFromSessionStorage } from "../../utils/getFromSessionStorage";

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}

const containerStyle: React.CSSProperties = {
  margin: "16px",
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  background: "#fff",
};

const statesMetaData =
  getFromSessionStorage<StateMetadata[]>(STATE_META_DATA_KEY) ?? [];

const States: React.FC = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const { date } = useParams();

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
      title: "Cases",
      dataIndex: ["cases", "total", "value"],
      key: "cases",
      sorter: (a, b) =>
        toNumber(a.cases.total.value) - toNumber(b.cases.total.value),
    },
    {
      title: "Testing",
      dataIndex: ["testing", "total", "value"],
      key: "testing",
    },
    {
      title: "Outcomes",
      dataIndex: ["outcomes", "hospitalized", "currently", "value"],
      key: "outcomes",
    },
    {
      title: "In ICU",
      dataIndex: ["outcomes", "hospitalized", "inIcu", "currently", "value"],
      key: "inIcu",
    },
    {
      title: "On Ventilator",
      dataIndex: [
        "outcomes",
        "hospitalized",
        "onVentilator",
        "currently",
        "value",
      ],
      key: "onVentilator",
    },
    {
      title: "Death",
      dataIndex: ["outcomes", "death", "total", "value"],
      key: "death",
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
      <div style={containerStyle}>
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
