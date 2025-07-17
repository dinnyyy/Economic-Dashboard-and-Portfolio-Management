import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import React, { useState } from 'react';

export default function AddTrade({ onTradeAdded, portfolioId }) {
    const [form, setForm] = useState({
      symbol: '',
      price: '',
      quantity: '',
      action: ''
    });

    const [error, setError] = useState('');

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
        )}

    const onSubmit = async (data) => {
        try {
            console.log({
              symbol: form.symbol,
              price: parseFloat(form.price),
              quantity: parseInt(form.quantity),
              action: form.action.toUpperCase(),
              date: new Date().toISOString().slice(0, 10),
              portfolio_id: portfolioId
            });
            const response = await fetch("http://localhost:8000/trades/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    symbol: form.symbol,
                    price: parseFloat(form.price),
                    quantity: parseInt(form.quantity),
                    action: form.action ? form.action.toUpperCase() : "BUY", // fallback to BUY
                    date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
                    portfolio_id: portfolioId
                })
            });
            if (response.ok) {
                if (onTradeAdded) onTradeAdded();
            } else {
                const resData = await response.json();
                setError(resData.detail || "Failed to add trade.");
            }
        } catch (err) {
            setError("Network error. Please try again later.");
        }
    }

    return (
        <Popup
            trigger={<button className='add-trade'> Add trade </button>}
            modal
            nested
            onClose={resetForm}
            contentStyle={{
                width: '320px',
                maxWidth: '90vw',
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                padding: '20px'
            }}
        >
            {
                close => (
                    <div className='add-trade-wrapper'>
                        <h3>Enter trade details</h3>
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
                        <button
                          className="submit"
                          disabled={hasInvalidValues() || !portfolioId}
                          onClick={async () => {
                            if (hasInvalidValues() || !portfolioId) {
                              setError("Portfolio not loaded yet.");
                              return;
                            }
                            await onSubmit(form);
                            resetForm();
                            close();
                          }}
                        >
                          Submit
                        </button>
                        {error && (
                          <div style={{ color: 'red', marginTop: '0.5em' }}>{error}</div>
                        )}
                    </div>
                )
            }
        </Popup>
    );
}