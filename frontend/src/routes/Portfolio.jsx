import { useEffect, useState } from "react";
import React from "react";
import "../components/Portoflio/portfolio.css"
import AddTrade from "../components/Portoflio/AddTrade";
import { useAuth } from "../AuthContext"; // if you store user info here
import DeleteTrade from "../components/Portoflio/DeleteTrade";
import EditTrade from "../components/Portoflio/EditTrade";

function Portfolio() {
  const [trades, setTrades] = useState([]);
  const [portfolioId, setPortfolioId] = useState(null);
  const { userId } = useAuth(); // You may need to add this to your AuthContext

  useEffect(() => {
    fetch(`http://localhost:8000/users/${userId}/portfolios/`)
      .then(res => res.json())
      .then(data => {
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
    
    // Sort trades by date in ascending order (oldest first) for correct position calculation
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const positions = Object.values(sortedTrades.reduce((acc, trade) => {
      const symbol = trade.symbol;
      
      if (!acc[symbol]) {
        acc[symbol] = {
          symbol,
          quantity: 0,
          totalCost: 0,
          avgPrice: 0
        };
      }
      
      // Handle BUY trades
      if (trade.action === 'BUY') {
        acc[symbol].quantity += trade.quantity;
        acc[symbol].totalCost += trade.quantity * trade.price;
      }
      
      // Handle SELL trades
      if (trade.action === 'SELL') {
        const previousQuantity = acc[symbol].quantity;
        const sellQuantity = trade.quantity;
        
        // Check if we have enough shares to sell
        if (previousQuantity >= sellQuantity) {
          // Calculate the ratio of shares being sold
          const sellRatio = sellQuantity / previousQuantity;
          
          // Reduce quantity
          acc[symbol].quantity -= sellQuantity;
          
          // Reduce cost basis proportionally
          acc[symbol].totalCost *= (1 - sellRatio);
        } else {
          // Selling more than we have - this shouldn't happen in real trading
          // but we'll handle it gracefully
          acc[symbol].quantity = 0;
          acc[symbol].totalCost = 0;
        }
      }
      
      // Calculate average price (only for positive positions)
      if (acc[symbol].quantity > 0) {
        acc[symbol].avgPrice = acc[symbol].totalCost / acc[symbol].quantity;
      }
      
      return acc;
    }, {}));
    
    return positions.filter(position => position.quantity > 0);
  };

  const calculatePortfolioSummary = (trades) => {
    const positions = calculatePositions(trades);
    const totalValue = positions.reduce((sum, pos) => sum + (pos.quantity * pos.avgPrice), 0);
    const totalTrades = trades.length;
    const buyTrades = trades.filter(t => t.action === 'BUY').length;
    const sellTrades = trades.filter(t => t.action === 'SELL').length;
    
    return {
      totalValue,
      totalTrades,
      buyTrades,
      sellTrades,
      positionsCount: positions.length
    };
  };

  const summary = calculatePortfolioSummary(trades);

  return (
    <div className="portfolio">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px' }}>
        <h1 style={{ textAlign: 'left', margin: 0 }}>Your portfolio</h1>
      </div>
      
      {/* Portfolio Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        width: '100%', 
        maxWidth: '1200px', 
        marginBottom: '30px' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Total Value</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${summary.totalValue.toFixed(2)}</div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Total Trades</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{summary.totalTrades}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            {summary.buyTrades} buys, {summary.sellTrades} sells
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Active Positions</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{summary.positionsCount}</div>
        </div>
      </div>
      
      <h2 style={{ textAlign: 'left', width: '100%', maxWidth: '1200px', marginBottom: 20 }}>Positions</h2>
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
              <tr key={trade.trades_id}>
                <td>{trade.symbol}</td>
                <td>{trade.quantity}</td>
                <td>{trade.price}</td>
                <td>{trade.date}</td>
                <td>
                  <span className={`trade-action-badge ${trade.action === 'BUY' ? 'trade-action-buy' : 'trade-action-sell'}`}>
                    {trade.action}
                  </span>
                </td>
                <td>{trade.quantity * trade.price}</td>
                <td style={{display: "flex", justifyContent: 'space-between', alignItems: 'center' }}><DeleteTrade 
                  tradeId={trade.trades_id} 
                  onTradeDeleted={() => {
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
                /><EditTrade 
                  tradeId={trade.trades_id} 
                  portfolioId={portfolioId}
                  tradePrice={trade.price}
                  tradeSymbol={trade.symbol}
                  tradeQuantity={trade.quantity}
                  tradeAction={trade.action}
                  onTradeDeleted={() => {
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
                /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Portfolio;