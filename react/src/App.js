import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { privateRoutes, routes } from "./utils/routes";
import { Layout, Skeleton } from "antd";
import SideBar from "./components/common/sideBar";
import TopBar from "./components/common/topBar";

import "./styles/common.css";
import Panel from "./views/panel";

const App = () => {
  const { name, isLoggedIn, isAdmin } = useSelector((store) => ({
    name: store.name,
    isLoggedIn: store.isLoggedIn,
    isAdmin: store.isAdmin,
  }));

  return (
    <>
      <Suspense fallback={<Skeleton active />}>
        <Router>
          <Layout>
            {isLoggedIn && <SideBar isAdmin={isAdmin}></SideBar>}
            <Layout>
              <TopBar name={name} isLoggedIn={isLoggedIn} />
              <Routes>
                {!isLoggedIn
                  ? routes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                      />
                    ))
                  : privateRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                      />
                    ))}

                {isAdmin === true && isLoggedIn && (
                  <Route path="/panel" element={<Panel />} />
                )}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          </Layout>
        </Router>
      </Suspense>
    </>
  );
};

export default App;
