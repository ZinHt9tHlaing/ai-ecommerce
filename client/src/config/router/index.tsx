import HomePage from "@/pages/user/HomePage";
import { createBrowserRouter } from "react-router";
import AuthPath from "../path/authPath";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import MainLayoutPage from "@/pages/layout/MainLayoutPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayoutPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: AuthPath.LOGIN,
        element: <LoginPage />,
      },
      {
        path: AuthPath.REGISTER,
        element: <RegisterPage />,
      },
    ],
  },
]);
