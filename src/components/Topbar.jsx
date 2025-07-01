import react from "react";
import { useLocation} from "react-router-dom";

const pageNames = {
    "/": "Home",
    "/portfolio": "Portfolio",
    "/market": "Market",
    "/models": "Models",
    "/reports": "Reports"
};

export default function TopBar() {
    const location = useLocation();
    const pageName = pageNames[location.pathname] || "Page";

    return (
        <div className="topbar">
            <span className="app-name">ED&P</span>
            <span className="app-name">{pageName}</span>
            <Link to={"/account"}>
                <p>Account</p>
            </Link>
        </div>
    )
}