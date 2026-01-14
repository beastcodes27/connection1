import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FaLock, FaPlay } from "react-icons/fa";
import PaymentModal from '../components/PaymentModal';

export default function ConnectionZone() {
    const [unlockedVideos, setUnlockedVideos] = useState(
        JSON.parse(localStorage.getItem('unlocked_videos') || '[]')
    );
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedVideo, setSelectedVideo] = useState(null); // For payment
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        async function fetchVideos() {
            try {
                const q = query(collection(db, "videos"), where("zone", "==", "connection"));
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

    const handleUnlockClick = (video) => {
        setSelectedVideo(video);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        if (selectedVideo) {
            const newUnlocked = [...unlockedVideos, selectedVideo.id];
            setUnlockedVideos(newUnlocked);
            localStorage.setItem('unlocked_videos', JSON.stringify(newUnlocked));
            setIsPaymentModalOpen(false);
            setSelectedVideo(null);
        }
    };

    if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading content...</div>;

    return (
        <>
            <Navbar />
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                amount={selectedVideo ? selectedVideo.price : 0}
                onSuccess={handlePaymentSuccess}
            />
            <div style={{ padding: '100px 50px', minHeight: '100vh', color: 'white' }}>
                <h1 style={{ color: '#007bff', marginBottom: '20px' }}>CONNECTION ZONE</h1>
                <p style={{ marginBottom: '40px', color: '#ccc' }}>Pay-Per-View Exclusive Content</p>

                {videos.length === 0 ? (
                    <p>No videos available yet.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                        {videos.map((video) => {
                            const isUnlocked = unlockedVideos.includes(video.id);
                            return (
                                <div key={video.id} style={{ background: '#1c1c1c', borderRadius: '8px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '140px',
                                        background: `url(${video.thumbnail || 'https://via.placeholder.com/300x200'}) center/cover no-repeat`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            fontSize: '2rem',
                                            background: 'rgba(0,0,0,0.6)',
                                            borderRadius: '50%',
                                            width: '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: isUnlocked ? 'white' : '#E50914'
                                        }}>
                                            {isUnlocked ? <FaPlay /> : <FaLock />}
                                        </div>
                                    </div>
                                    <div style={{ padding: '15px' }}>
                                        <h3 style={{ marginBottom: '8px', fontSize: '1rem' }}>{video.title}</h3>
                                        {video.rating && <span style={{ background: '#333', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', marginRight: '8px' }}>{video.rating}</span>}
                                        {isUnlocked ? (
                                            <a href={video.videoLink || '#'} target="_blank" rel="noopener noreferrer" style={{
                                                display: 'block',
                                                width: '100%',
                                                padding: '8px',
                                                background: '#4ca1af',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                textDecoration: 'none',
                                                borderRadius: '4px',
                                                marginTop: '10px',
                                                fontSize: '0.9rem'
                                            }}>WATCH NOW</a>
                                        ) : (
                                            <button
                                                onClick={() => handleUnlockClick(video)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    background: '#E50914',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    borderRadius: '4px',
                                                    marginTop: '10px',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                UNLOCK: {video.price}/=
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
