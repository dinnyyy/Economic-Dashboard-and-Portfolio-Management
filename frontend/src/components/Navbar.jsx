import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../App.css";
import { IconContext } from "react-icons";
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import {CgProfile} from "react-icons/cg"

export default function Navbar() {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);
  return (

    <>
        <IconContext.Provider value={{color: "#2c3e50"}}>

            <nav className="nav-menu-inactive">
                <ul className="nav-menu-items">
                    <li className="navbar-toggle">
                        <Link to="#" className="menu-bars" onClick={showSidebar}>
                            <MdOutlineKeyboardDoubleArrowRight />
                        </Link>
                    </li>
                    {SidebarData.map((item, index) => {
                        return ( 
                            <li key={index} className={item.cName}>
                                <Link to={item.path} title={item.title}>
                                    {item.icon}
                                </Link>
                            </li>
                        )
                    })}
                    <li className="account-btn nav-text">
                        <Link to="/account" title="Account">
                            <CgProfile/> 
                        </Link>
                    </li>
                </ul>
                
            </nav>
            <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
                <ul className="nav-menu-items" onClick={showSidebar}>
                    <li className="navbar-toggle">
                        <Link to="#" className="menu-bars">
                            <MdOutlineKeyboardDoubleArrowLeft />
                        </Link>
                    </li>
                    {SidebarData.map((item, index) => {
                        return ( 
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}
                    <li className="account-btn nav-text">
                        <Link to="/account">
                            <CgProfile/> 
                            <span>Account</span>
                        </Link>
                    </li>

                    
                </ul>
                
            </nav>

            
        </IconContext.Provider>
    </>

  );
}