import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { RiDeleteBin5Fill } from "react-icons/ri";
import "../Portoflio/deleteTrade.css"

export default function DeleteTrade({tradeId, onTradeDeleted}) {
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        try {
            console.log("Deleting trade with ID:", tradeId, typeof tradeId);
            console.log({
              tradeId: tradeId
            });
            const response = await fetch(`http://localhost:8000/trades/${tradeId}`, {
                method: "DELETE",
            })
                .then(res => {
                    if (res.ok) {
                    // Trigger parent update after successful delete
                    if (onTradeDeleted) onTradeDeleted();
                    } else {
                        setError("Failed to delete trade. Please try again.");
                    }
                });
        } catch (err) {
            setError("Network error. Please try again later.");
        }
    }

    return (
        <Popup
            trigger={<button className='delete-trade'><RiDeleteBin5Fill/></button>}
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
            {
                close => (
                    <div className='delete-trade-wrapper'>
                        <h3>Are you sure you want to delete?</h3>
                        <div className='confirmation'>
                            <button className="confirm"
                                onClick={async () => {
                                    await onSubmit(tradeId);
                                    close();
                                }}>
                                    Confirm
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
                            <div className="error-message">{error}</div>
                        )}
                    </div>
                )
            }
        </Popup>
    )
}