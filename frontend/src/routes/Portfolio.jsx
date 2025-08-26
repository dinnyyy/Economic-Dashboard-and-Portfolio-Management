import { useEffect, useState, useCallback } from "react";
import React from "react";
import "../components/Portoflio/portfolio.css"
import AddTrade from "../components/Portoflio/AddTrade";
import { useAuth } from "../AuthContext"; 
import DeleteTrade from "../components/Portoflio/DeleteTrade";
import EditTrade from "../components/Portoflio/EditTrade";

// Helper: fetch stock quote from Alpha Vantage
async function fetchStockQuote(symbol, useMock = false) {
  // If mock data is enabled, return mock data immediately
  if (useMock) {
    return getMockStockData(symbol);
  }

  try {
    const API_KEY = "VXMZ61DD58G6IW4L"; // ⚠️ visible in frontend
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

    console.log(`Fetching quote for ${symbol}...`);
    const res = await fetch(url);
    const data = await res.json();
    
    console.log(`Raw API response for ${symbol}:`, data);
    
    // Check for API error messages
    if (data["Error Message"]) {
      console.warn(`API Error for ${symbol}:`, data["Error Message"]);
      return getMockStockData(symbol);
    }
    
    // Check for rate limit message
    if (data["Note"]) {
      console.warn(`Rate limit hit for ${symbol}:`, data["Note"]);
      return getMockStockData(symbol);
    }

    const quote = data["Global Quote"];
    console.log(`Quote data for ${symbol}:`, quote);

    if (!quote || !quote["05. price"]) {
      console.warn(`No valid quote data for ${symbol}:`, quote);
      return getMockStockData(symbol);
    }

    const result = {
      symbol,
      currentPrice: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: quote["10. change percent"]
    };
    
    console.log(`Processed quote for ${symbol}:`, result);
    return result;
    
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return getMockStockData(symbol);
  }
}

// Fallback function to provide mock data when API fails
function getMockStockData(symbol) {
  console.log(`Using mock data for ${symbol}`);
  // Generate some realistic-looking mock data
  const basePrice = 100 + Math.random() * 200; // Random price between 100-300
  const change = (Math.random() - 0.5) * 10; // Random change between -5 and +5
  const changePercent = ((change / basePrice) * 100).toFixed(2);
  
  const mockData = {
    symbol,
    currentPrice: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: `${change >= 0 ? '+' : ''}${changePercent}%`
  };
  
  console.log(`Generated mock data for ${symbol}:`, mockData);
  return mockData;
}

function Portfolio() {
  const [trades, setTrades] = useState([]);
  const [portfolioId, setPortfolioId] = useState(null);
  const [positions, setPositions] = useState([]);
  const [stockDataLoading, setStockDataLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const { userId } = useAuth();

  // Comprehensive refresh function that updates both trades and recalculates portfolio data
  const refreshPortfolioData = useCallback(async () => {
    if (!portfolioId) return;
    
    try {
      const response = await fetch(`http://localhost:8000/portfolios/${portfolioId}/trades/`);
      const data = await response.json();
      const sorted = Array.isArray(data) ? [...data].sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
      setTrades(sorted);
    } catch (err) {
      console.error("Failed to fetch trades:", err);
    }
  }, [portfolioId]);

  // Function to refresh stock data
  const refreshStockData = useCallback(async () => {
    const basePositions = calculatePositions(trades);
    if (basePositions.length === 0) {
      setPositions([]);
      return;
    }

    setStockDataLoading(true);
    try {
      const quotes = await Promise.all(basePositions.map(pos => fetchStockQuote(pos.symbol, useMockData)));
      const enriched = basePositions.map(pos => {
        const q = quotes.find(q => q.symbol === pos.symbol);
        return {
          ...pos,
          currentPrice: q?.currentPrice || null,
          change: q?.change || null,
          changePercent: q?.changePercent || null
        };
      });
      console.log('Updated positions with stock data:', enriched);
      setPositions(enriched);
    } catch (err) {
      console.error("Failed to fetch stock data", err);
    } finally {
      setStockDataLoading(false);
    }
  }, [trades, useMockData]);

  // Fetch portfolio ID
  useEffect(() => {
    fetch(`http://localhost:8000/users/${userId}/portfolios/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPortfolioId(data[0].portfolio_id);
        }
      });
  }, [userId]);

  // Fetch trades
  useEffect(() => {
    if (!portfolioId) return;
    refreshPortfolioData();
  }, [portfolioId, refreshPortfolioData]);

  // Calculate positions from trades
  const calculatePositions = (trades) => {
    if (!Array.isArray(trades)) return [];
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));

    const positions = Object.values(sortedTrades.reduce((acc, trade) => {
      const symbol = trade.symbol;
      if (!acc[symbol]) {
        acc[symbol] = { symbol, quantity: 0, totalCost: 0, avgPrice: 0 };
      }

      if (trade.action === "BUY") {
        acc[symbol].quantity += trade.quantity;
        acc[symbol].totalCost += trade.quantity * trade.price;
      }

      if (trade.action === "SELL") {
        const prevQty = acc[symbol].quantity;
        const sellQty = trade.quantity;

        if (prevQty >= sellQty) {
          const sellRatio = sellQty / prevQty;
          acc[symbol].quantity -= sellQty;
          acc[symbol].totalCost *= (1 - sellRatio);
        } else {
          acc[symbol].quantity = 0;
          acc[symbol].totalCost = 0;
        }
      }

      if (acc[symbol].quantity > 0) {
        acc[symbol].avgPrice = acc[symbol].totalCost / acc[symbol].quantity;
      }

      return acc;
    }, {}));

    return positions.filter(pos => pos.quantity > 0);
  };

  // Fetch live stock data and merge into positions
  useEffect(() => {
    if (trades.length > 0) {
      refreshStockData();
    }
  }, [trades, refreshStockData]);

  // Portfolio summary
  const calculatePortfolioSummary = (trades, positions) => {
    // Use the enriched positions that contain current stock prices
    const basePositions = positions.length > 0 ? positions : calculatePositions(trades);
    
    // Calculate total cost basis (what you paid)
    const totalCostBasis = basePositions.reduce((sum, pos) => sum + (pos.quantity * pos.avgPrice), 0);
    
    const totalValue = basePositions.reduce((sum, pos) => {
      // Use current market price if available, otherwise fall back to average purchase price
      const currentValue = pos.currentPrice ? pos.quantity * pos.currentPrice : pos.quantity * pos.avgPrice;
      return sum + currentValue;
    }, 0);
    
    // Calculate total P&L
    const totalPnL = basePositions.reduce((sum, pos) => {
      if (pos.currentPrice) {
        const positionPnL = (pos.currentPrice - pos.avgPrice) * pos.quantity;
        return sum + positionPnL;
      }
      return sum;
    }, 0);
    
    // Calculate percentage change
    const percentageChange = totalCostBasis > 0 ? ((totalValue - totalCostBasis) / totalCostBasis) * 100 : 0;
    
    const totalTrades = trades.length;
    const buyTrades = trades.filter(t => t.action === "BUY").length;
    const sellTrades = trades.filter(t => t.action === "SELL").length;

    return {
      totalValue,
      totalPnL,
      percentageChange,
      totalTrades,
      buyTrades,
      sellTrades,
      positionsCount: basePositions.length
    };
  };

  const summary = calculatePortfolioSummary(trades, positions);

  // Debug: Log when trades, positions, or summary changes
  useEffect(() => {
    console.log('Trades updated:', trades.length, 'trades');
    console.log('Positions updated:', positions.length, 'positions');
    console.log('Portfolio summary updated:', summary);
  }, [trades, positions, summary]);

  // Force summary recalculation when positions change
  useEffect(() => {
    if (positions.length > 0) {
      console.log('Positions changed, recalculating summary...');
      console.log('Current positions with stock data:', positions);
    }
  }, [positions]);

  return (
    <div className="portfolio">
      <h1>Your portfolio</h1>

      {/* Summary */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "20px", 
        width: '100%', 
        maxWidth: '1200px', 
        marginBottom: "30px" 
      }}>
        <div style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
          color: "white", 
          padding: "20px", 
          borderRadius: "12px",
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Total Value</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${summary.totalValue.toFixed(2)}</div>
          {summary.percentageChange !== 0 && (
            <div style={{ 
              fontSize: '12px', 
              opacity: 0.9, 
              color: summary.percentageChange >= 0 ? '#4ade80' : '#f87171',
              marginTop: '5px'
            }}>
              {summary.percentageChange >= 0 ? '↗' : '↘'} {summary.percentageChange >= 0 ? '+' : ''}{summary.percentageChange.toFixed(2)}%
            </div>
          )}
        </div>
        <div style={{ 
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", 
          color: "white", 
          padding: "20px", 
          borderRadius: "12px",
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Total Trades</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{summary.totalTrades}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            {summary.buyTrades} buys, {summary.sellTrades} sells
          </div>
        </div>
        <div style={{ 
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", 
          color: "white", 
          padding: "20px", 
          borderRadius: "12px",
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Active Positions</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{summary.positionsCount}</div>
        </div>
        <div style={{ 
          background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)", 
          color: "white", 
          padding: "20px", 
          borderRadius: "12px",
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Total P&L</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${summary.totalPnL.toFixed(2)}</div>
        </div>
      </div>

      {/* Positions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Positions</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={() => setUseMockData(!useMockData)}
            style={{
              background: useMockData ? '#f39c12' : '#95a5a6',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {useMockData ? '🔄 Real Data' : '🎭 Mock Data'}
          </button>
          <button 
            onClick={refreshStockData}
            disabled={stockDataLoading}
            style={{
              background: '#4facfe',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: stockDataLoading ? 'not-allowed' : 'pointer',
              opacity: stockDataLoading ? 0.6 : 1
            }}
          >
            {stockDataLoading ? 'Refreshing...' : '🔄 Refresh Stock Data'}
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Avg Price</th>
            <th>Current Price</th>
            <th>Today's Change</th>
            <th>Value</th>
            <th>PnL</th>
          </tr>
        </thead>
        <tbody>
          {positions.length === 0 ? (
            <tr><td colSpan="7" style={{ textAlign: "center" }}>No positions to display</td></tr>
          ) : (
            positions.map(pos => {
              const value = pos.currentPrice ? pos.currentPrice * pos.quantity : pos.avgPrice * pos.quantity;
              const pnl = pos.currentPrice ? (pos.currentPrice - pos.avgPrice) * pos.quantity : null;
              return (
                <tr key={pos.symbol}>
                  <td>{pos.symbol}</td>
                  <td>{pos.quantity}</td>
                  <td>${pos.avgPrice.toFixed(2)}</td>
                  <td>
                    {stockDataLoading ? (
                      <span style={{ color: '#666' }}>Loading...</span>
                    ) : pos.currentPrice ? (
                      `$${pos.currentPrice.toFixed(2)}`
                    ) : (
                      <span style={{ color: '#999' }}>—</span>
                    )}
                  </td>
                  <td style={{ color: pos.change > 0 ? "green" : pos.change < 0 ? "red" : "inherit" }}>
                    {stockDataLoading ? (
                      <span style={{ color: '#666' }}>Loading...</span>
                    ) : pos.change !== null ? (
                      `${pos.change > 0 ? '+' : ''}${pos.change.toFixed(2)} (${pos.changePercent})`
                    ) : (
                      <span style={{ color: '#999' }}>—</span>
                    )}
                  </td>
                  <td>
                    {stockDataLoading ? (
                      <span style={{ color: '#666' }}>Loading...</span>
                    ) : (
                      <span style={{ 
                        color: pos.currentPrice && pos.currentPrice !== pos.avgPrice ? 
                          (pos.currentPrice > pos.avgPrice ? 'green' : 'red') : 'inherit' 
                      }}>
                        ${value.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td style={{ color: pnl > 0 ? "green" : pnl < 0 ? "red" : "inherit" }}>
                    {stockDataLoading ? (
                      <span style={{ color: '#666' }}>Loading...</span>
                    ) : pnl !== null ? (
                      `${pnl > 0 ? '+' : ''}$${pnl.toFixed(2)}`
                    ) : (
                      <span style={{ color: '#999' }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Trades */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Trades</h2>
        <AddTrade portfolioId={portfolioId} onTradeAdded={() => {
          if (!portfolioId) return;
          refreshPortfolioData();
        }} />
      </div>

      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Date</th>
            <th>Action</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trades.length === 0 && <tr><td colSpan="7">No data</td></tr>}
          {trades.map(trade => (
            <tr key={trade.trades_id}>
              <td>{trade.symbol}</td>
              <td>{trade.quantity}</td>
              <td>{trade.price}</td>
              <td>{trade.date}</td>
              <td>{trade.action}</td>
              <td>{trade.quantity * trade.price}</td>
              <td style={{ display: 'flex', gap: '8px', justifyContent: 'flex-start' }}>
                <EditTrade tradeId={trade.trades_id} portfolioId={portfolioId}
                  tradePrice={trade.price} tradeSymbol={trade.symbol}
                  tradeQuantity={trade.quantity} tradeAction={trade.action}
                  onTradeUpdated={() => {
                    if (!portfolioId) return;
                    refreshPortfolioData();
                  }}
                />
                <DeleteTrade tradeId={trade.trades_id} onTradeDeleted={() => {
                  if (!portfolioId) return;
                  refreshPortfolioData();
                }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Portfolio;
