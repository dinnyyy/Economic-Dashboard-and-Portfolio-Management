import { useState } from "react";
import React from "react";
import "../css/portfolio.css"

function Portfolio() {
  const [trades, setTrades] = useState([])

  const calculatePositions = (trades) => {
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
      <button onClick={null}>Add trade</button>

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