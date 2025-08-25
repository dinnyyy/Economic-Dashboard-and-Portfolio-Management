import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { CiEdit } from "react-icons/ci";
import "../Portoflio/editTrade.css";

export default function EditTrade({
  tradeId,
  onTradeUpdated,
  portfolioId,
  tradePrice,
  tradeSymbol,
  tradeQuantity,
  tradeAction
}) {
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    symbol: tradeSymbol,
    price: tradePrice,
    quantity: tradeQuantity,
    action: tradeAction,
  });

  const tradeValue = (parseFloat(form.price) || 0) * (parseFloat(form.quantity) || 0);

  const resetForm = () => {
    setForm({
      symbol: '',
      price: '',
      quantity: '',
      action: ''
    });
    setError('');
  };

  const hasInvalidValues = () => {
    return (
      !form.symbol ||
      !form.price ||
      !form.quantity ||
      !form.action
    );
  };

  const onSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/trades/${tradeId}`, {
        method: "PUT", // <-- changed from POST to PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: form.symbol,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
          action: form.action ? form.action.toUpperCase() : "BUY",
          date: new Date().toISOString().slice(0, 10), // keep updated date
          portfolio_id: portfolioId
        })
      });

      if (response.ok) {
        if (onTradeUpdated) onTradeUpdated();
      } else {
        const resData = await response.json();
        setError(resData.detail || "Failed to update trade.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
  };

  return (
    <Popup
      trigger={<button className='edit-trade'><CiEdit/></button>}
      modal
      nested
      contentStyle={{
        width: '320px',
        maxWidth: '90vw',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        padding: '20px'
      }}
    >
      {close => (
        <div className='edit-trade-wrapper'>
          <h3>Edit trade</h3>
          <input
            name="symbol"
            placeholder="Symbol"
            type="text"
            value={form.symbol}
            onChange={e => setForm({ ...form, symbol: e.target.value })}
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            step="any"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />
          <input
            name="quantity"
            placeholder="Quantity"
            type="number"
            step="any"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
          />
          <div className="action-toggle">
            <button
              type="button"
              className={`buy${form.action === "BUY" ? " active" : ""}`}
              onClick={() => setForm({ ...form, action: "BUY" })}
            >
              Buy
            </button>
            <button
              type="button"
              className={`sell${form.action === "SELL" ? " active" : ""}`}
              onClick={() => setForm({ ...form, action: "SELL" })}
            >
              Sell
            </button>
          </div>
          <div style={{ marginTop: '1em', fontWeight: 'bold' }}>
            Trade Value: ${tradeValue}
          </div>
          <div className='confirmation'>
            <button className="confirm"
              disabled={hasInvalidValues() || !portfolioId}
              onClick={async () => {
                if (hasInvalidValues() || !portfolioId) {
                  setError("Portfolio not loaded yet.");
                  return;
                }
                await onSubmit();
                resetForm();
                close();
              }}>
              Save Changes
            </button>
            <button className='cancel'
              type="button"
              onClick={e => {
                e.stopPropagation();
                close();
              }}
            >Cancel</button>
          </div>
          {error && (
            <div style={{ color: 'red', marginTop: '0.5em' }}>{error}</div>
          )}
        </div>
      )}
    </Popup>
  );
}
