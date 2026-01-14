import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function NotificationModal({ isOpen, onClose, message, type = 'success' }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 1200,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{
                background: '#141414', padding: '30px', borderRadius: '8px',
                border: '1px solid #333', maxWidth: '400px', width: '90%', textAlign: 'center', color: 'white'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px', color: type === 'success' ? '#28a745' : '#E50914' }}>
                    {type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
                </div>
                <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>{message}</h3>

                <button onClick={onClose} style={{
                    padding: '10px 30px',
                    background: type === 'success' ? '#28a745' : '#E50914',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer'
                }}>
                    OK
                </button>
            </div>
        </div>
    );
}
