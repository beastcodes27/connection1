import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function LoginPage() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login, googleSignIn } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/dashboard');
        } catch {
            setError('Failed to log in');
        }

        setLoading(false);
    }

    async function handleGoogleSignIn() {
        try {
            setError('');
            setLoading(true);
            await googleSignIn();
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setError('Failed to sign in with Google');
        }
        setLoading(false);
    }

    return (
        <>
            <Navbar />
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg")',
                backgroundSize: 'cover'
            }}>
                <div style={{
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    padding: '60px 68px 40px',
                    minWidth: '450px',
                    borderRadius: '4px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <img src="/connection_header.png" alt="Logo" style={{ height: '90px' }} />
                    </div>
                    <h2 style={{ color: 'white', marginBottom: '28px', fontSize: '32px', fontWeight: 'bold' }}>Sign In</h2>
                    {error && <div style={{ color: '#e87c03', marginBottom: '10px' }}>{error}</div>}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input
                            type="email"
                            ref={emailRef}
                            placeholder="Email or phone number"
                            required
                            style={{
                                background: '#333',
                                borderRadius: '4px',
                                border: '0',
                                color: '#fff',
                                height: '50px',
                                lineHeight: '50px',
                                padding: '16px 20px',
                                fontSize: '16px'
                            }}
                        />
                        <input
                            type="password"
                            ref={passwordRef}
                            placeholder="Password"
                            required
                            style={{
                                background: '#333',
                                borderRadius: '4px',
                                border: '0',
                                color: '#fff',
                                height: '50px',
                                lineHeight: '50px',
                                padding: '16px 20px',
                                fontSize: '16px'
                            }}
                        />
                        <button
                            disabled={loading}
                            type="submit"
                            style={{
                                backgroundColor: '#E50914',
                                color: 'white',
                                padding: '16px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                marginTop: '24px',
                                borderRadius: '4px'
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            disabled={loading}
                            type="button"
                            onClick={handleGoogleSignIn}
                            style={{
                                backgroundColor: '#4285F4',
                                color: 'white',
                                padding: '16px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                marginTop: '10px',
                                borderRadius: '4px'
                            }}
                        >
                            Sign In with Google
                        </button>
                    </form>
                    <div style={{ marginTop: '16px', color: '#737373' }}>
                        New to Connection Mpya? <Link to="/register" style={{ color: 'white' }}>Sign up now</Link>.
                    </div>
                </div>
            </div>
        </>
    );
}
