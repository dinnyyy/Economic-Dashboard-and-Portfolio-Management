import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../App.css";
import { IconContext } from "react-icons";


export default function MySidebar() {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);
  return (

    <>
        <IconContext.Provider value={{color: "undefined"}}>

            <nav className="nav-menu-inactive">
                <ul className="nav-menu-items">
                    <li className="navbar-toggle">
                        <Link to="#" className="menu-bars" onClick={showSidebar}>
                            <FaIcons.FaBars />
                        </Link>
                    </li>
                    {SidebarData.map((item, index) => {
                        return ( 
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
            <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
                <ul className="nav-menu-items" onClick={showSidebar}>
                    <li className="navbar-toggle">
                        <Link to="#" className="menu-bars">
                            <AiIcons.AiOutlineClose />
                        </Link>
                    </li>
                    {SidebarData.map((item, index) => {
                        return ( 
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    {item.title}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </IconContext.Provider>
    </>

  );
}