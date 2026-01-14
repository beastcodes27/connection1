import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { currentUser, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch {
            console.error("Failed to log out");
        }
    }

    return (
        <nav style={{
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.9)',
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 100
        }}>
            <div className="brand" style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/">
                    <img src="/connection_header.png" alt="CONNECTION MPYA" style={{ height: '72px' }} />
                </Link>
            </div>
            <div>
                {currentUser ? (
                    <>
                        <Link to="/dashboard" style={{ marginRight: '1rem', color: '#fff' }}>Dashboard</Link>
                        {isAdmin(currentUser) && (
                            <Link to="/admin" style={{ marginRight: '1rem', color: '#E50914', fontWeight: 'bold' }}>Admin Dashboard</Link>
                        )}
                        <button
                            onClick={handleLogout}
                            style={{
                                backgroundColor: '#E50914',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                fontWeight: 'bold'
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <div>
                        <Link to="/login" style={{ marginRight: '1rem', color: '#fff' }}>Login</Link>
                        <Link to="/register" style={{
                            backgroundColor: '#E50914',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}>Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
