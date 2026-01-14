import React from 'react';
import { Link } from 'react-router-dom';

export default function ZoneCard({ title, link, color, description }) {
    return (
        <div style={{
            background: '#141414',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            width: '350px',
            minHeight: '450px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
        }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: color }}>{title}</h2>
            <div style={{ color: '#999', marginBottom: '2rem' }}>{description}</div>
            <Link to={link} style={{
                backgroundColor: color,
                color: 'white',
                padding: '10px 20px',
                borderRadius: '4px',
                fontWeight: 'bold',
                marginTop: 'auto'
            }}>
                ENTER ZONE
            </Link>
        </div>
    );
}
