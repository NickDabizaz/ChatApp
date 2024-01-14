import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import dataHandler from "./dataHandler.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import Navbar from "./components/Navbar.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import ChatPage from "./pages/ChatPage.tsx";
import WelcomePage from "./pages/WelcomePage.tsx";
import AppPage from "./pages/AppPage.tsx";

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
    path: "/",
    children: [
      { index: true, element: <LandingPage /> },
      { path: "/login", element: <LoginPage />, loader: loadData },
      { path: "/register", element: <RegisterPage />, loader: loadData },
      { path: "/app", element: <AppPage />, errorElement: <ErrorPage /> },
    ],
  },
]);

// const router = createBrowserRouter([
//   {
//     path: "/",
//     children: [
//       { index: true, element: <LandingPage /> },
//       { path: "/login", element: <LoginPage />, loader: loadData },
//       { path: "/register", element: <RegisterPage />, loader: loadData },
//       {
//         element: <Navbar />,
//         errorElement: <ErrorPage />,
//         children: [
//           {
//             path: "/home",
//             element: <HomePage />,
//             children: [
//               { index: true, element: <WelcomePage /> },
//               { path: "chat/:friendId", element: <ChatPage /> },
//             ],
//           },
//           { path: "/profile", element: <ProfilePage /> },
//         ],
//       },
//     ],
//   },
// ]);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <RouterProvider router={router}></RouterProvider>
//   </React.StrictMode>
// );

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
