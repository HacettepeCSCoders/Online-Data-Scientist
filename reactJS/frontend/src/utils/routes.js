import React from "react";
const Login = React.lazy(() => import("../views/login"));
const Signup = React.lazy(() => import("../views/signup"));
const HomePage = React.lazy(() => import("../views/homePage"));
const Deneme = React.lazy(() => import("../views/deneme"));
const Workspace = React.lazy(() => import("../views/workspace"));

export const routes = [
  {
    path: "/",
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
    path: "/deneme",
    element: <Deneme />,
    isPrivate: true,
  },
  {
    path: "/workspace/:workspaceId",
    element: <Workspace />,
    isPrivate: true,
  },
];

export const privateRoutes = [];
