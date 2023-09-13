import React, { FC, ReactNode, useEffect, useState } from "react";
import { Divider, Layout, Space, Typography } from "antd";
import TopMenu from "../TopMenu";
import Filters from "../Filters";
import { Footer } from "antd/es/layout/layout";

const { Header, Content } = Layout;
const { Text, Link } = Typography;

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
    backgroundColor: "#00000",
    borderBottom: "2px solid #000033",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "0 0 12px 12px",
    borderWidth: "0 0 2px 0",
    position: "fixed",
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
      <Header style={getHeaderStyle(windowWidth)}>
        <h1
          style={{
            margin: "0",
            fontSize: getHeaderStyle(windowWidth).fontSize,
            color: getHeaderStyle(windowWidth).color,
          }}>
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
      <Footer style={{ textAlign: "center", padding: "24px" }}>
        <Space direction="vertical">
          <Text>Covid Tracker ©2023</Text>
          <Divider />
          <Space>
            <Link href="#about">About</Link>
            <Link href="#faq">FAQ</Link>
            <Link href="#contact">Contact Us</Link>
            <Link href="#privacy-policy">Privacy Policy</Link>
            <Link href="#terms-of-service">Terms of Service</Link>
          </Space>
          <Text type="secondary">
            Data provided for informational purposes, not for medical advice.
          </Text>
        </Space>
      </Footer>
    </Layout>
  );
};

export default AppWrapper;
