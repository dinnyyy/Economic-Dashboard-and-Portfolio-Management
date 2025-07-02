import React from "react";
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

const AppLayout = () => (
  <>
    <TopBar />
    <Navbar />
    <div className="main-content">
      <Outlet />
    </div>
  </>
);

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
    element: <AppLayout />,
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
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);