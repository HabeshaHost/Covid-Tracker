import React, { useEffect, useState } from "react";
import { StateMetadata } from "../../api/types";
import { useQuery } from "@tanstack/react-query";
import { fetchAllStateMetadata } from "../../api/requests";
import {
  DatePicker,
  Form,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
  Switch,
  Table,
} from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import type {
  ExpandableConfig,
  TableRowSelection,
} from "antd/es/table/interface";
import type { ColumnsType, TableProps } from "antd/es/table";
import { DownOutlined } from "@ant-design/icons";
import { find, some, union } from "lodash";
import { NavigateOptions, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { STATE_META_DATA_KEY } from "../../utils/constants";
import { getFromSessionStorage } from "../../utils/getFromSessionStorage";

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
  description: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Address",
    dataIndex: "address",
    filters: [
      {
        text: "London",
        value: "London",
      },
      {
        text: "New York",
        value: "New York",
      },
    ],
    onFilter: (value, record) => record.address.indexOf(value as string) === 0,
  },
  {
    title: "Action",
    key: "action",
    sorter: true,
    render: () => (
      <Space size="middle">
        <a>Delete</a>
        <a>
          <Space>
            More actions
            <DownOutlined />
          </Space>
        </a>
      </Space>
    ),
  },
];

type TablePaginationPosition =
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight";

const Filters: React.FC = () => {
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [ellipsis, setEllipsis] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState<string>();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const currentQuery = queryString.parse(search);

  const states =
    getFromSessionStorage<StateMetadata[]>(STATE_META_DATA_KEY) ?? [];

  const defaultValue = states
    .filter(({ stateCode }) =>
      String(currentQuery.states).split(",")?.includes(stateCode.toLowerCase())
    )
    .map(({ name }) => name);

  const [selectedStates, setSelectedStates] = useState<string[]>(defaultValue);

  const handleBorderChange = (enable: boolean) => {
    setBordered(enable);
  };

  const handleLoadingChange = (enable: boolean) => {
    setLoading(enable);
  };

  const handleTitleChange = (enable: boolean) => {
    setShowTitle(enable);
  };

  const scroll: { x?: number | string; y?: number | string } = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll) {
    scroll.x = "100vw";
  }

  const tableColumns = columns.map((item) => ({ ...item, ellipsis }));
  if (xScroll === "fixed") {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = "right";
  }
  
  const changeStates = (newStates: string[]) => {
    console.log(newStates)
    setSelectedStates(newStates);
    const selectedStateCodes = states
      .filter(({ name }) => newStates.includes(name))
      .map(({ stateCode }) => stateCode.toLowerCase());

    const newQuery = {
      ...currentQuery,
      states: selectedStateCodes.join(","),
    };
    const newQueryString = queryString.stringify(newQuery);
    navigate(`${pathname}?${newQueryString}`, {
      replace: true,
    });
  };

  return (
    <Form
      layout="inline"
      className="components-table-demo-control-bar"
      style={{ marginBottom: 16 }}>
      <Select
        mode="multiple"
        size="middle"
        placeholder="Please select"
        onChange={changeStates}
        value={selectedStates} // Use value prop for controlled component
        style={{ width: "100%" }}
        options={states?.map(({ name }) => ({
          value: name,
          label: name,
        }))}
      />
      <Form.Item label="Cases">
        <Switch checked={bordered} onChange={handleBorderChange} />
      </Form.Item>
      <Form.Item label="Tests">
        <Switch checked={loading} onChange={handleLoadingChange} />
      </Form.Item>
      <Form.Item label="Outcomes">
        <Switch checked={showTitle} onChange={handleTitleChange} />
      </Form.Item>
    </Form>
  );
};

export default Filters;
