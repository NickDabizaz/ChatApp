import React from "react";
import ReactDOM from "react-dom";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import dataHandler from "./dataHandler.tsx";
import LoginPage from "./pages/LoginPage.tsx";

const { loadData } = dataHandler;

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  index?: boolean;
  errorElement?: React.ReactNode;
}

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      { path: "/login", element: <LoginPage />, loader: loadData },
      { path: "/profile", element: <ProfilePage />, loader: loadData },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);
