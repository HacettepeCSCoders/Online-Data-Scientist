import React, {Suspense} from "react";
import {BrowserRouter as Router, Navigate, Route, Routes,} from "react-router-dom";
import {routes} from "./utils/routes";
import {Layout, Skeleton} from "antd";
import SideBar from "./components/common/sideBar";
import TopBar from "./components/common/topBar";

import "./styles/common.css";

const App = () => {
    return (
        <>
            <Suspense fallback={<Skeleton active/>}>
                <Router>
                    <Layout>
                        <SideBar></SideBar>
                        <Layout>
                            <TopBar></TopBar>
                            <Routes>
                                {routes.map((route) => (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        element={route.element}
                                    />
                                ))}
                                <Route path="*" element={<Navigate to="/"/>}/>
                            </Routes>
                        </Layout>
                    </Layout>
                </Router>
            </Suspense>
        </>
    );
};

export default App;
