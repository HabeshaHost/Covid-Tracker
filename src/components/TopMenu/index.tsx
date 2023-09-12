import React from "react";
import {
  BankOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { DatePicker, Menu } from "antd";
import dayjs from "dayjs";
import { DATA_COLLECTION_END_DATE, MENU_STATES, MENU_US } from "../../utils/constants";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateOrAppendDateToPath } from "../../utils/updateOrAppendDateToPath";
import { formatToPathDate } from "../../utils/formatToPathDate";

const items: MenuProps["items"] = [
  {
    label: "Historic US Value",
    key: MENU_US,
    icon: <BankOutlined />,
  },
  {
    label: "States",
    key: MENU_STATES,
    icon: <BankOutlined />,
  },
];

const TopMenu: React.FC = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { date } = useParams();
  const location = useLocation();
  const initialMenu = location.pathname.includes(MENU_STATES)
    ? MENU_STATES
    : MENU_US;
  const formatedDate = dayjs(date);

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(`/${e.key}`)
  };

  const disableDates = (current: string) => {
    const currentDate = new Date(current);
    const lastDate = new Date(DATA_COLLECTION_END_DATE);
    return currentDate > lastDate;
  };
  
  const changeDate = (date: dayjs.Dayjs | null) => {
    const formattedDate = date ? formatToPathDate(date) : "";
    const newPathName = pathname === "/" ? "/us" : pathname;
    const updatedPath = updateOrAppendDateToPath(newPathName, formattedDate);
    navigate(`/${updatedPath}${search}`);
  };
  

  return (
    <div>
      <Menu
        onClick={onClick}
        selectedKeys={[initialMenu]}
        mode="horizontal"
        items={items}
      />
      <DatePicker
        onChange={(date) => changeDate(date)}
        disabledDate={(e) => disableDates(dayjs(e).format("YYYY-MM-DD"))}
        defaultPickerValue={dayjs(DATA_COLLECTION_END_DATE)}
        {...(date ? { defaultValue: formatedDate } : {})}
      />
    </div>
  );
};

export default TopMenu;
