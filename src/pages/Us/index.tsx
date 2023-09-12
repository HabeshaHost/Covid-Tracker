import React, { useMemo } from "react";
import { NationalData } from "../../api/types";
import { Badge, Dropdown, Space, Table, Spin, Alert } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import useGetNationalData from "../../hooks/useGetNationalData";
import { useParams } from "react-router-dom";
import AppWrapper from "../../components/Wrappers/AppWrapper";
import useScreenSize from "../../hooks/useScreenSize";

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}

const Us: React.FC = () => {
  const { date } = useParams();

  const { data, isLoading, isError } = useGetNationalData({
    selectedDate: date,
  });

  const memoizedData = useMemo(() => data, [data]);

  const isSmallScreen = useScreenSize();

  const expandedRowRender = () => {
    const columns: TableColumnsType<ExpandedDataType> = [
      { title: "Date", dataIndex: "date", key: "date" },
      { title: "Name", dataIndex: "name", key: "name" },
      {
        title: "Status",
        key: "state",
        render: () => <Badge status="success" text="Finished" />,
      },
      { title: "Upgrade Status", dataIndex: "upgradeNum", key: "upgradeNum" },
      {
        title: "Action",
        dataIndex: "operation",
        key: "operation",
        render: () => (
          <Space size="middle">
            <a>Pause</a>
            <a>Stop</a>
            <Dropdown overlay={<></>}>
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        ),
      },
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i.toString(),
        date: "2014-12-24 23:12:00",
        name: "This is production name",
        upgradeNum: "Upgraded: 56",
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

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
          expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
          dataSource={memoizedData}
        />
      </div>
    </AppWrapper>
  );
};

export default Us;
