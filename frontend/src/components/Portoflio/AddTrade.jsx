import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import React, { useState } from 'react';

export default function AddTrade () {
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
        // Check for empty strings, null, or "N/A" (case-insensitive)
        return (
          !form.symbol ||
          !form.price ||
          !form.quantity ||
          !form.action
        )}

    return (
        <Popup
            trigger={<button className='add-trade'> Add trade </button>}
            modal
            nested
            onClose={resetForm}
            contentStyle={{
                width: '320px',         // or any width you prefer, e.g., '300px'
                maxWidth: '90vw',       // responsive for small screens
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                padding: '20px'         // optional: for more inner space
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
                            className={`buy${form.action === "buy" ? " active" : ""}`}
                            onClick={() => setForm({ ...form, action: "buy" })}
                          >
                            Buy
                          </button>
                          <button
                            type="button"
                            className={`sell${form.action === "sell" ? " active" : ""}`}
                            onClick={() => setForm({ ...form, action: "sell" })}
                          >
                            Sell
                          </button>
                        </div>
                        <div style={{ marginTop: '1em', fontWeight: 'bold' }}>
                          Trade Value: ${tradeValue}
                        </div>
                        <button className="submit" disabled={hasInvalidValues()} onClick={() => {
                            if (hasInvalidValues()) {
                                setError("Fill out all fields");
                                return;
                            }
                          // Do something with form data
                          console.log(form);
                          resetForm();
                          close();
                        }}>
                          Submit
                        </button>
                        {error && (
                          <div style={{ color: 'red', marginTop: '0.5em' }}>{error}</div>
                        )}
                    </div>
                )
            }
        </Popup>
    )
}