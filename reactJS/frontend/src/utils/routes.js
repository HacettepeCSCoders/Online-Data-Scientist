import React from "react";
import MainPage from "../views/mainPage";
import ProfilePage from "../views/profilePage";
import Settings from "../views/settings";
const Login = React.lazy(() => import("../views/login"));
const Signup = React.lazy(() => import("../views/signup"));
const HomePage = React.lazy(() => import("../views/homePage"));
const Workspace = React.lazy(() => import("../views/workspace"));
const AllWorkspaces = React.lazy(() => import("../views/allWorkpages"));

export const routes = [
  {
    path: "/login",
    element: <Login />,
    isPrivate: false,
  },
  {
    path: "/signup",
    element: <Signup />,
    isPrivate: false,
  },
  {
    path: "/home",
    element: <HomePage />,
    isPrivate: true,
  },
  {
    path: "/workspace/:workspaceId",
    element: <Workspace />,
    isPrivate: true,
  },
  {
    path: "/workspace",
    element: <AllWorkspaces />,
    isPrivate: true,
  },
  {
    path: "/settings",
    element: <Settings />,
    isPrivate: true,
  },
  {
    path: "/",
    element: <MainPage />,
    isPrivate: false,
  },
  {
    path: "/:profileName",
    element: <ProfilePage />,
    isPrivate: true,
  },
];

export const privateRoutes = [];
