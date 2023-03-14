import React from "react";

const MainPage = React.lazy(() => import("../views/mainPage"));
const ProfilePage = React.lazy(() => import("../views/profilePage"));
const Settings = React.lazy(() => import("../views/settings"));
const Login = React.lazy(() => import("../views/login"));
const Signup = React.lazy(() => import("../views/signup"));
const HomePage = React.lazy(() => import("../views/homePage"));
const Workspace = React.lazy(() => import("../views/workspace"));
const AllWorkspaces = React.lazy(() => import("../views/allWorkpages"));

export const routes = [
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
];

export const privateRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/workspace/:workspaceId",
    element: <Workspace />,
  },
  {
    path: "/workspace",
    element: <AllWorkspaces />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/profile/:profileName",
    element: <ProfilePage />,
  },
];
