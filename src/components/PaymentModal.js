import React, { useState, useEffect } from 'react';
import { fastlipa } from '../services/fastlipa';

export default function PaymentModal({ isOpen, onClose, amount, onSuccess }) {
    const [step, setStep] = useState('input'); // input, processing, success, error
    const [phoneNumber, setPhoneNumber] = useState('');
    const [tranID, setTranID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal closes
            setStep('input');
            setPhoneNumber('');
            setTranID(null);
            setLoading(false);
            setMessage('');
        }
    }, [isOpen]);

    useEffect(() => {
        let interval;
        if (step === 'processing' && tranID) {
            interval = setInterval(async () => {
                try {
                    const statusData = await fastlipa.checkStatus(tranID);
                    if (statusData.status === 'success' && statusData.data.payment_status === 'COMPLETED') {
                        setStep('success');
                        setMessage('Payment Successful!');
                        clearInterval(interval);
                        setTimeout(() => {
                            onSuccess();
                            onClose();
                        }, 2000);
                    } else if (statusData.status === 'success' && statusData.data.payment_status === 'FAILED') {
                        setStep('error');
                        setMessage('Payment Failed. Please try again.');
                        clearInterval(interval);
                    }
                } catch (err) {
                    console.error("Polling error", err);
                }
            }, 1000); // Check every 1 second
        }
        return () => clearInterval(interval);
    }, [step, tranID, onSuccess, onClose]);


    const handlePay = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('Initiating payment...');

        try {
            const res = await fastlipa.createTransaction(phoneNumber, amount);
            if (res.status === 'success') {
                setTranID(res.data.tranID);
                setStep('processing');
                setMessage('Please approve the payment on your phone.');
            } else {
                setStep('error');
                setMessage('Failed to initiate payment. Check phone number.');
            }
        } catch (error) {
            setStep('error');
            setMessage('Network error occurred.');
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 1100,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{
                background: '#141414', padding: '30px', borderRadius: '8px',
                border: '1px solid #333', maxWidth: '400px', width: '90%', textAlign: 'center', color: 'white'
            }}>
                <h2 style={{ marginBottom: '20px', color: '#E50914' }}>
                    {step === 'success' ? 'Payment Successful' : `Pay TSHS ${amount}`}
                </h2>

                {step === 'input' && (
                    <form onSubmit={handlePay}>
                        <p style={{ marginBottom: '15px', color: '#ccc' }}>Enter your mobile number (e.g., 0655...)</p>
                        <input
                            type="tel"
                            placeholder="06XXXXXXXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '12px', marginBottom: '20px',
                                borderRadius: '4px', border: 'none', background: '#333', color: 'white', fontSize: '1.1rem'
                            }}
                        />
                        <button disabled={loading} style={{
                            width: '100%', padding: '12px', background: loading ? '#555' : '#E50914',
                            color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer'
                        }}>
                            {loading ? 'Processing...' : 'PAY NOW'}
                        </button>
                    </form>
                )}

                {step === 'processing' && (
                    <div>
                        <div style={{ margin: '20px auto', width: '40px', height: '40px', border: '4px solid #333', borderTop: '4px solid #E50914', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <p style={{ fontSize: '1.1rem' }}>{message}</p>
                        <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '10px' }}>Waiting for confirmation...</p>
                    </div>
                )}
                {step === 'success' && (
                    <div>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
                        <p style={{ fontSize: '1.1rem' }}>{message}</p>
                    </div>
                )}

                {step === 'error' && (
                    <div>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>❌</div>
                        <p style={{ color: '#E50914', marginBottom: '15px' }}>{message}</p>
                        <button onClick={() => setStep('input')} style={{
                            padding: '10px 20px', background: '#333', color: 'white',
                            border: 'none', borderRadius: '4px', cursor: 'pointer'
                        }}>Try Again</button>
                    </div>
                )}

                <button onClick={onClose} style={{
                    marginTop: '20px', background: 'transparent', border: 'none',
                    color: '#888', cursor: 'pointer', textDecoration: 'underline'
                }}>Close</button>
            </div>
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
