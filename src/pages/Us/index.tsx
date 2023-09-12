import React, { useMemo, useState } from "react";
import { NationalData } from "../../api/types";
import { Table, Spin, Alert } from "antd";
import type { TableColumnsType } from "antd";
import useGetNationalData from "../../hooks/useGetNationalData";
import { useParams } from "react-router-dom";
import AppWrapper from "../../components/Wrappers/AppWrapper";
import useScreenSize from "../../hooks/useScreenSize";

const Us: React.FC = () => {
  const { date } = useParams();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { data, isLoading, isError, total } = useGetNationalData({
    selectedDate: date,
    page: pagination.current,
    pageSize: pagination.pageSize,
  });
  
  const memoizedData = useMemo(() => data, [data]);

  const isSmallScreen = useScreenSize();

  const columns: TableColumnsType<NationalData> = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Cases", dataIndex: ["cases", "total", "value"], key: "Cases" },
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

  const containerStyle: React.CSSProperties = {
    margin: "16px",
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    background: "#fff",
    overflowX: isSmallScreen ? "auto" : "visible",
  };

  if (isLoading) {
    return <Spin tip="Loading..." />;
  }

  if (isError) {
    return <Alert message="An error occurred" type="error" />;
  }

  return (
    <AppWrapper>
      <div style={containerStyle}>
        <Table
          columns={columns}
          dataSource={memoizedData}
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

export default Us;
