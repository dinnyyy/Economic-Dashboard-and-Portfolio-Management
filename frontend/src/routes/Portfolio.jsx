import { useEffect, useState } from "react";
import React from "react";
import "../css/portfolio.css"
import AddTrade from "../components/Portoflio/AddTrade";
import { useAuth } from "../AuthContext"; // if you store user info here

function Portfolio() {
  const [trades, setTrades] = useState([]);
  const [portfolioId, setPortfolioId] = useState(null);
  const { userId } = useAuth(); // You may need to add this to your AuthContext

  useEffect(() => {
    console.log("userId:", userId);
    fetch(`http://localhost:8000/users/${userId}/portfolios/`)
      .then(res => res.json())
      .then(data => {
        console.log("Portfolios:", data);
        if (Array.isArray(data) && data.length > 0) {
          setPortfolioId(data[0].portfolio_id); // Use the first portfolio for now
        }
      });
  }, [userId]);

  useEffect(() => {
    if (!portfolioId) return;
    fetch(`http://localhost:8000/portfolios/${portfolioId}/trades/`)
      .then(res => res.json())
      .then(data => {
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => new Date(b.date) - new Date(a.date))
          : [];
        setTrades(sorted);
      })
      .catch(err => console.error("Failed to fetch trades", err));
  }, [portfolioId]);

  const calculatePositions = (trades) => {
    if (!Array.isArray(trades)) return [];
    return Object.values(trades.reduce((acc, trade) => {
      const symbol = trade.symbol;
      
      if (!acc[symbol]) {
        acc[symbol] = {
          symbol,
          quantity: 0,
          totalCost: 0,
          avgPrice: 0
        };
      }
      // Add/subtract quantity based on buy/sell
      const quantityChange = trade.action === 'BUY' ? trade.quantity : -trade.quantity;
      acc[symbol].quantity += quantityChange;
      // Track total cost for average price calculation
      if (trade.action === 'BUY') {
        acc[symbol].totalCost += trade.quantity * trade.price;
      }
      // Calculate average price (only for positive positions)
      if (acc[symbol].quantity > 0) {
        acc[symbol].avgPrice = acc[symbol].totalCost / acc[symbol].quantity;
      }
      
      return acc;
    }, {})).filter(position => position.quantity > 0); // Only show positive positions
  };

  return (
    <div className="portfolio">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px' }}>
        <h1 style={{ textAlign: 'left', margin: 0 }}>Your portfolio</h1>
      </div>
      <h2 style={{ textAlign: 'left', width: '100%', maxWidth: '1200px', margin: 0 }}>Positions</h2>
      <div className="positions-table">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Avg Price</th>
              <th>Current Price</th>
              <th>Todays change</th>
              <th>Value</th>
              <th>PnL</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {calculatePositions(trades).length === 0 ? (
              <tr>
                <td colSpan="8" style={{textAlign: 'center'}}>No positions to display</td>
              </tr>
            ) : (
              calculatePositions(trades).map(position => (
                <tr key={position.symbol}>
                  <td>{position.symbol}</td>
                  <td>{position.quantity}</td>
                  <td>${position.avgPrice.toFixed(2)}</td>
                  <td>{null}</td>
                  <td>{null}</td>
                  <td>${(position.quantity * position.avgPrice).toFixed(2)}</td>
                  <td>{null}</td>
                  <td>{null}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', marginTop: '30px' }}>
        <h2 style={{ textAlign: 'left', margin: 0 }}>Trades</h2>
        <AddTrade
          portfolioId={portfolioId}
          onTradeAdded={() => {
            if (!portfolioId) return;
            fetch(`http://localhost:8000/portfolios/${portfolioId}/trades/`)
              .then(res => res.json())
              .then(data => {
                const sorted = Array.isArray(data)
                  ? [...data].sort((a, b) => new Date(b.date) - new Date(a.date))
                  : [];
                setTrades(sorted);
              })
              .catch(err => console.error("Failed to fetch trades", err));
          }}
        />
      </div>

      <div className="trades-table">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Date</th>
              <th>Action</th>
              <th>Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {trades.length === 0 && (
              <tr>
                <td colSpan="6" style={{textAlign: 'center'}}>No data to display</td>
              </tr>
            )}
            {trades.map(trade =>(
              <tr key={trade.id}>
                <td>{trade.symbol}</td>
                <td>{trade.quantity}</td>
                <td>{trade.price}</td>
                <td>{trade.date}</td>
                <td>{trade.action}</td>
                <td>{trade.quantity * trade.price}</td>
                <td>DELETE</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Portfolio;