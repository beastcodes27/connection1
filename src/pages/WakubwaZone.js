import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { FaPlay } from "react-icons/fa";
import PaymentModal from '../components/PaymentModal';

export default function WakubwaZone() {
    const [subscribed, setSubscribed] = useState(false);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        // Check local storage subscription
        const isSubscribed = localStorage.getItem('wakubwa_subscribed');
        if (isSubscribed) {
            setSubscribed(true);
        }

        // Fetch videos
        async function fetchVideos() {
            try {
                const q = query(collection(db, "videos"), where("zone", "==", "wakubwa"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const fetchedVideos = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setVideos(fetchedVideos);
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
            setLoading(false);
        }

        fetchVideos();
    }, []);

    const handleSubscriptionSuccess = () => {
        localStorage.setItem('wakubwa_subscribed', 'true');
        setSubscribed(true);
        setIsPaymentModalOpen(false);
    };

    if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading content...</div>;

    return (
        <>
            <Navbar />
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                amount={1500}
                onSuccess={handleSubscriptionSuccess}
            />
            <div style={{ padding: '160px 50px', minHeight: '100vh', color: 'white' }}>
                <h1 style={{ color: '#E50914', marginBottom: '20px' }}>WAKUBWA ZONE</h1>

                {!subscribed ? (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            textAlign: 'center',
                            maxWidth: '500px',
                            background: '#141414',
                            padding: '60px',
                            borderRadius: '8px',
                            border: '1px solid #333',
                            position: 'relative'
                        }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Subscription Required</h2>
                            <p style={{ margin: '20px 0', fontSize: '1.2rem', color: '#999' }}>
                                Access to the <strong>WAKUBWA ZONE</strong> requires a monthly subscription.
                            </p>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '30px 0' }}>
                                TSHS 1,500 <span style={{ fontSize: '1rem', color: '#666' }}>/ month</span>
                            </div>
                            <button
                                onClick={() => setIsPaymentModalOpen(true)}
                                style={{
                                    backgroundColor: '#E50914',
                                    color: 'white',
                                    padding: '16px 32px',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    borderRadius: '4px',
                                    width: '100%'
                                }}
                            >
                                SUBSCRIBE NOW
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p style={{ marginBottom: '30px', color: '#ccc' }}>Subscription Active. Enjoy your content.</p>
                        {videos.length === 0 ? (
                            <p>No content available yet.</p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                                {videos.map((video) => (
                                    <div key={video.id} style={{
                                        background: `url(${video.thumbnail || 'https://via.placeholder.com/300x200'}) center/cover no-repeat`,
                                        height: '140px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '4px',
                                        position: 'relative'
                                    }}>
                                        <a href={video.videoLink || '#'} target="_blank" rel="noopener noreferrer" style={{
                                            fontSize: '2rem',
                                            background: 'rgba(0,0,0,0.6)',
                                            borderRadius: '50%',
                                            width: '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: 'white',
                                            textDecoration: 'none'
                                        }}>
                                            <FaPlay />
                                        </a>
                                        <span style={{ position: 'absolute', bottom: '10px', left: '10px', fontWeight: 'bold', textShadow: '1px 1px 2px black' }}>{video.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
