import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import Graph from "../components/dashboard/graph";

function Home() {
  const [portfolioId, setPortfolioId] = useState(null);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;

    // Fetch the user's portfolio
    fetch(`http://localhost:8000/users/${userId}/portfolios/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPortfolioId(data[0].portfolio_id);
        }
      })
      .catch(err => console.error("Failed to fetch portfolio:", err));
  }, [userId]);

  return (
    <div className="home">
      <h1>Dashboard</h1>
      {portfolioId ? (
        <Graph portfolioId={portfolioId} />
      ) : (
        <div>Loading portfolio data...</div>
      )}
    </div>
  );
}

export default Home;