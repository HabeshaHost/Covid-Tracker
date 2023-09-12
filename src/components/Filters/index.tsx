import React, { useState } from "react";
import { StateMetadata } from "../../api/types";
import { Form, Select, Switch } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { STATE_META_DATA_KEY } from "../../utils/constants";
import { getFromSessionStorage } from "../../utils/getFromSessionStorage";

const Filters: React.FC = () => {
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
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

  const changeStates = (newStates: string[]) => {
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
        value={selectedStates}
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
