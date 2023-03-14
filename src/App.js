import { Layout, Dropdown, Menu, Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
const { Header, Content } = Layout;
//frontend structure:
//App {
// HomePage{
//   PostApps;
//   BrowerApp;
// },
// LoginForm{
//   SigupForm
// }
// }
const App = () => {
  const [authed, setAuthed] = useState();

  useEffect(() => {
    //check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      message.success("Order placed!");
    }
  }, []);

  useEffect(() => {
    // only run after each render, componentDidMount
    const authToken = localStorage.getItem("authToken");
    setAuthed(authToken !== null);
  }, []);

  const handleLoginSuccess = () => {
    setAuthed(true);
  };

  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    setAuthed(false);
  };

  const renderContent = () => {
    if (authed === undefined) {
      // if there is no loggin
      return <></>;
    }

    if (!authed) {
      // if loggged in success, auth == true, rerender, this loginForm disappear
      // when the auth == false; now in log out state
      return <LoginForm onLoginSuccess={handleLoginSuccess} />;
      // go back to login page
    }

    return <HomePage />;
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogOut}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
          App Store
        </div>
        {authed && ( // only when authed == true will we see later section
          <div>
            <Dropdown trigger="click" overlay={userMenu}>
              <Button icon={<UserOutlined />} shape="circle" />
            </Dropdown>
          </div>
        )}
      </Header>
      <Content
        style={{ height: "calc(100% - 64px)", padding: 20, overflow: "auto" }}
      >
        {renderContent()}
      </Content>
    </Layout>
  );
};

export default App;
