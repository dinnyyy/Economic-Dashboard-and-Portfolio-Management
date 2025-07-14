import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IoGlobeOutline } from "react-icons/io5";
import { CiCalculator2 } from "react-icons/ci";
import { RiDashboardHorizontalFill } from "react-icons/ri";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <RiDashboardHorizontalFill />,
    cName: "nav-text",
  },
  {
    title: "Portfolio",
    path: "/portfolio",
    icon: <FaIcons.FaWallet />,
    cName: "nav-text",
  },
  {
    title: "Market",
    path: "/market",
    icon: <IoGlobeOutline />,
    cName: "nav-text",
  },
  {
    title: "Models",
    path: "/models",
    icon: <CiCalculator2 />,
    cName: "nav-text",
  },
  {
    title: "Reports",
    path: "/reports",
    icon: <FaIcons.FaFileAlt />,
    cName: "nav-text",
  },
];
