import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
  createRoutesFromElements,
} from "react-router-dom";
import Portfolio from "./routes/Portfolio";
import Home from "./routes/Home";
import Reports from "./routes/Reports";
import Navbar from "./components/Navbar";
import Market from "./routes/Market";
import Models from "./routes/Models";
import "./App.css";
import Account from "./routes/account";
import TopBar from "./components/Topbar";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="app-body">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className={`main-content${sidebarOpen ? " sidebar-open" : ""}`}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route element={<AppLayout />}>
//       <Route path="/" element={<Home />} />
//       <Route path="/products" element={<Products />} />
//       <Route path="/reports" element={<Reports />} />
//     </Route>
//   )
// );

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    element: <PrivateRoute><AppLayout /></PrivateRoute>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "portfolio",
        element: <Portfolio />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "market",
        element: <Market />,
      },
      {
        path: "models",
        element: <Models />,
      },
      {
        path: "account",
        element: <Account />
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);