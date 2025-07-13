import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

function Account() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="account">
      <div className="content-wrapper">
        <h1>Account Settings</h1>
        <div className="account-info">
          <h2>Welcome to your account</h2>
          <p>Manage your account settings and preferences here.</p>
          
          <div className="account-actions">
            <button 
              onClick={handleLogout}
              className="logout-btn"
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '20px'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;