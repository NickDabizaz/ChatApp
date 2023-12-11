import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ChatDashboard from "./pages/ChatDashboard.jsx";
import ContactDashboard from "./pages/ContactDashboard.jsx";
import ProfileDashboard from "./pages/ProfileDashboard.jsx";
import dataHandler from "./dataHandler.jsx";

const { loadData } = dataHandler;

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        children: [
          { index: true, element: <ChatDashboard />, loader: loadData },
          {
            path: "/contact",
            element: <ContactDashboard />,
            loader: loadData,
          },
          {
            path: "/profile",
            element: <ProfileDashboard />,
            loader: loadData,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
        loader: loadData,
      },
      {
        path: "/register",
        element: <RegisterPage />,
        loader: loadData,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
