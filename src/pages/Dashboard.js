import React from 'react';
import Navbar from '../components/Navbar';
import ZoneCard from '../components/ZoneCard';
import { useAuth } from '../contexts/AuthContext';
import { FaCheck, FaCrown, FaBolt } from 'react-icons/fa';

export default function Dashboard() {
    const { currentUser } = useAuth();

    return (
        <>
            <Navbar />
            <div style={{
                minHeight: '100vh',
                padding: '160px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h1 style={{ marginBottom: '40px', fontSize: '2.5rem' }}>Welcome, {currentUser && currentUser.email}</h1>
                <h2 style={{ marginBottom: '60px', color: '#999' }}>Choose Your Zone</h2>

                <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <ZoneCard
                        title="WAKUBWA ZONE"
                        link="/wakubwa-zone"
                        color="#E50914"
                        description={
                            <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                    <FaCrown style={{ color: '#FFD700', marginRight: '10px' }} />
                                    <span style={{ fontWeight: 'bold', color: 'white', letterSpacing: '1px', fontSize: '0.9rem' }}>UTAPATA FEATURES ZIFUATAZO</span>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#e5e5e5' }}>
                                        <FaCheck style={{ color: '#46d369', marginRight: '12px', minWidth: '16px' }} />
                                        <span>Angalia video zote bure mwezi mzima</span>
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#e5e5e5' }}>
                                        <FaCheck style={{ color: '#46d369', marginRight: '12px', minWidth: '16px' }} />
                                        <span>Hakuna matangazo</span>
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0', color: '#e5e5e5' }}>
                                        <FaCheck style={{ color: '#46d369', marginRight: '12px', minWidth: '16px' }} />
                                        <span>Msaada wa Admin 24/7</span>
                                    </li>
                                </ul>
                            </div>
                        }
                    />
                    <ZoneCard
                        title="CONNECTION ZONE"
                        link="/connection-zone"
                        color="#007bff"
                        description={
                            <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                    <FaBolt style={{ color: '#007bff', marginRight: '10px' }} />
                                    <span style={{ fontWeight: 'bold', color: 'white', letterSpacing: '1px', fontSize: '0.9rem' }}>UTAPATA FEATURES ZIFUATAZO</span>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#e5e5e5' }}>
                                        <FaCheck style={{ color: '#007bff', marginRight: '12px', minWidth: '16px' }} />
                                        <span>Kila Connection kwa bei elekezi</span>
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#e5e5e5' }}>
                                        <FaCheck style={{ color: '#007bff', marginRight: '12px', minWidth: '16px' }} />
                                        <span>Njia rahisi ya kufanya malipo</span>
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0', color: '#e5e5e5' }}>
                                        <FaCheck style={{ color: '#007bff', marginRight: '12px', minWidth: '16px' }} />
                                        <span>Search connection zote</span>
                                    </li>
                                </ul>
                            </div>
                        }
                    />
                </div>
            </div>
        </>
    );
}
