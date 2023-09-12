import React, { FC, ReactNode, useEffect, useState } from "react";
import { Layout } from "antd";
import TopMenu from "../TopMenu";
import Filters from "../Filters";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MENU_STATES, MENU_US } from "../../utils/constants";

const { Header, Content } = Layout;

interface AppWrapperProps {
  showFilter?: boolean;
  children: ReactNode;
}

const getHeaderStyle = (windowWidth: number): React.CSSProperties => {
  let fontSize = "1.5rem";
  let padding = "0.5rem 1rem";

  if (windowWidth >= 768) {
    fontSize = "2rem";
    padding = "1rem 2rem";
  }

  if (windowWidth >= 1024) {
    fontSize = "2.5rem";
    padding = "1.5rem 3rem";
  }

  return {
    padding,
    backgroundColor: "#007bff",
    borderBottom: "2px solid #0056b3",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "0 0 12px 12px",
    borderWidth: "0 0 2px 0",
    position: 'fixed',
    top: 0,
    width: "100%",
    zIndex: 1000,
  };
};


const AppWrapper: FC<AppWrapperProps> = ({ showFilter, children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);  
  
  return (
    <Layout>
      <Layout>
        <Header style={getHeaderStyle(windowWidth)}>
          <h1 style={{ margin: "0", fontSize: getHeaderStyle(windowWidth).fontSize, color: getHeaderStyle(windowWidth).color }}>
            Covid Tracking
          </h1>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}>
          <TopMenu />
          {showFilter && <Filters />}
          <div className="content-section">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppWrapper;



// useEffect(() => {
  //   const parsedQuery = queryString.parse(location.search);
  //   if (parsedQuery.states) {
  //     setSelectedStates(String(parsedQuery.states).split(","));
  //   }
  // }, [location.search]);

  // const constructPath = (menu: string, date: string | null) => {
  //   const basePath = menu === MENU_STATES ? MENU_STATES : MENU_US;
  //   return date ? `/${basePath}/${date}` : `/${basePath}`;
  // };

  // const constructQuery = (menu: string, states: string[]) => {
  //   return menu === MENU_STATES && states.length > 0
  //     ? `?states=${states.join(",")}`
  //     : "";
  // };

  // const updateURL = (newMenu: string) => {
  //   const newPath = constructPath(newMenu, selectedDate);
  //   const query = constructQuery(newMenu, selectedStates);
  //   navigate(newPath + query);
  // };

  // const handleMenuChange = (menu: string) => {
  //   setSelectedMenu(menu);
  //   updateURL(menu);
  // };

  // const handleDateChange = (date: string | null) => {
  //   setSelectedDate(date);
  //   updateURL(selectedMenu);
  // };

  // const handleStateChange = (stateCodes: StateMetadata[]) => {
  //   setSelectedStates(stateCodes.map(({ stateCode }) => stateCode));
  //   updateURL(selectedMenu);
  // };