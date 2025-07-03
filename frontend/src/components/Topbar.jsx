import react from "react";
import { useLocation} from "react-router-dom";
import { Link } from "react-router-dom";
import {CgProfile} from "react-icons/cg"
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const pageNames = {
    "/": "Home",
    "/portfolio": "Portfolio",
    "/market": "Market",
    "/models": "Models",
    "/reports": "Reports",
    "/account" : "Account",
};

export default function TopBar() {
    const location = useLocation();
    const pageName = pageNames[location.pathname] || "Page";

    return (
        <div className="topbar">
            <span className="app-name">ED&P</span>
            <span className="app-name">{pageName}</span>
            
            <Link to="/account">
                <CgProfile/>
            </Link>
            
            
        </div>
    )
}