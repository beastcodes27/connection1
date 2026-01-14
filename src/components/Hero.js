import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 900 }}>Unlimited Connections & Videos</h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Watch anywhere. Cancel anytime.</p>
            <div>
                <Link to="/register" style={{
                    backgroundColor: '#E50914',
                    color: 'white',
                    padding: '15px 30px',
                    fontSize: '1.2rem',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    display: 'inline-block'
                }}>
                    Get Started &gt;
                </Link>
            </div>
        </div>
    );
}
