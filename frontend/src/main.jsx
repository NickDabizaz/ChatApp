import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
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
          { index: true, element: <ChatDashboard /> },
          {
            path: "/contact",
            element: <ContactDashboard />
          },
          {
            path: "/profile",
            element: <ProfileDashboard />
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
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);