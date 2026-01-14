import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from '../components/Navbar';
import NotificationModal from '../components/NotificationModal';

export default function AdminPage() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [rating, setRating] = useState('');
    const [zone, setZone] = useState('connection');
    const [uploading, setUploading] = useState(false);

    // New State
    const [users, setUsers] = useState([]);
    const [videos, setVideos] = useState([]);
    const [activeTab, setActiveTab] = useState('add_video');
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Notification State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('success');

    useEffect(() => {
        fetchUsers();
        fetchVideos();
    }, []);

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchVideos = async () => {
        try {
            const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            setVideos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching videos:", error);
            // Fallback if index is missing (createdAt desc might require index) or other error
            try {
                const querySnapshot = await getDocs(collection(db, "videos"));
                setVideos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (fallbackError) {
                console.error("Error fetching videos fallback:", fallbackError);
            }
        }
    };

    const showNotification = (msg, type = 'success') => {
        setModalMessage(msg);
        setModalType(type);
        setModalOpen(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('https://api.imgbb.com/1/upload?key=cfe7185111917029d548b5462fb64d51', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                setThumbnail(data.data.url);
                showNotification('Thumbnail uploaded successfully!');
            } else {
                showNotification('Failed to upload thumbnail', 'error');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            showNotification('Error uploading thumbnail', 'error');
        }
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const videoData = {
                title,
                price: Number(price),
                thumbnail,
                videoLink,
                rating,
                zone,
            };

            if (editingId) {
                await updateDoc(doc(db, "videos", editingId), videoData);
                showNotification('Video updated successfully!');
                setEditingId(null);
            } else {
                await addDoc(collection(db, "videos"), {
                    ...videoData,
                    views: 0,
                    createdAt: new Date()
                });
                showNotification('Video added successfully!');
            }

            setTitle('');
            setPrice('');
            setThumbnail('');
            setVideoLink('');
            setRating('');
            setZone('connection');
            fetchVideos();
            if (editingId) setActiveTab('manage_videos');
        } catch (error) {
            console.error("Error saving video: ", error);
            showNotification("Error saving video", 'error');
        }
    };

    const handleDeleteVideo = async (id) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            try {
                await deleteDoc(doc(db, "videos", id));
                showNotification('Video deleted successfully');
                fetchVideos();
            } catch (error) {
                console.error("Error deleting video:", error);
                showNotification("Error deleting video", 'error');
            }
        }
    };

    const handleEditVideo = (video) => {
        setTitle(video.title);
        setPrice(video.price);
        setThumbnail(video.thumbnail);
        setVideoLink(video.videoLink);
        setRating(video.rating);
        setZone(video.zone);
        setEditingId(video.id);
        setActiveTab('add_video');
    };

    return (
        <>
            <Navbar />
            <NotificationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                message={modalMessage}
                type={modalType}
            />
            <div style={{ padding: '100px 50px', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{ marginBottom: '40px' }}>Admin Dashboard</h1>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                        onClick={() => setActiveTab('add_video')}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'add_video' ? '#E50914' : '#333',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {editingId ? 'Edit Video' : 'Add Video'}
                    </button>
                    <button
                        onClick={() => setActiveTab('manage_videos')}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'manage_videos' ? '#E50914' : '#333',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Manage Videos
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'users' ? '#E50914' : '#333',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Users
                    </button>
                </div>

                {activeTab === 'add_video' && (
                    <div style={{ background: '#1c1c1c', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '20px' }}>{editingId ? 'Edit Video' : 'Add New Video'}</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Video Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Thumbnail Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ width: '100%', padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '4px' }}
                                />
                                {uploading && <p style={{ color: '#E50914', marginTop: '5px' }}>Uploading...</p>}
                                {thumbnail && (
                                    <div style={{ marginTop: '10px' }}>
                                        <p style={{ color: '#0f0', fontSize: '0.9rem' }}>Thumbnail Set!</p>
                                        <img src={thumbnail} alt="Preview" style={{ height: '100px', marginTop: '5px', borderRadius: '4px' }} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Video Link</label>
                                <input
                                    type="text"
                                    value={videoLink}
                                    onChange={(e) => setVideoLink(e.target.value)}
                                    placeholder="https://example.com/video.mp4"
                                    required
                                    style={{ width: '100%', padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Rating</label>
                                <input
                                    type="text"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    placeholder="e.g. 18+, 5 Stars"
                                    required
                                    style={{ width: '100%', padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Zone</label>
                                <select
                                    value={zone}
                                    onChange={(e) => setZone(e.target.value)}
                                    style={{ width: '100%', padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '4px' }}
                                >
                                    <option value="connection">Connection Zone</option>
                                    <option value="wakubwa">Wakubwa Zone</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Price (TSHS)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '4px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '15px', background: '#E50914', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    {editingId ? 'UPDATE VIDEO' : 'ADD VIDEO'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null);
                                            setTitle('');
                                            setPrice('');
                                            setThumbnail('');
                                            setVideoLink('');
                                            setRating('');
                                            setZone('connection');
                                        }}
                                        style={{ flex: 1, padding: '15px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        CANCEL
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'manage_videos' && (
                    <div style={{ width: '100%', maxWidth: '1200px' }}>
                        <input
                            type="text"
                            placeholder="Search videos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '15px',
                                marginBottom: '20px',
                                background: '#333',
                                border: 'none',
                                color: 'white',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                            {videos
                                .filter(video => video.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map(video => (
                                    <div key={video.id} style={{ background: '#1c1c1c', padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ position: 'relative', paddingTop: '56.25%', marginBottom: '10px' }}>
                                            <img src={video.thumbnail} alt={video.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.rem', marginBottom: '5px' }}>{video.title}</h3>
                                        <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Price: {video.price} TSHS</p>
                                        <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '15px' }}>Zone: {video.zone}</p>
                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleEditVideo(video)}
                                                style={{ flex: 1, padding: '8px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVideo(video.id)}
                                                style={{ flex: 1, padding: '8px', background: '#E50914', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            {videos.filter(video => video.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && <p>No videos found.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div style={{ width: '100%', maxWidth: '1000px', overflowX: 'auto', background: '#1c1c1c', padding: '20px', borderRadius: '8px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                                    <th style={{ padding: '15px' }}>Email</th>
                                    <th style={{ padding: '15px' }}>Role</th>
                                    <th style={{ padding: '15px' }}>Joined</th>
                                    <th style={{ padding: '15px' }}>Last Login</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #333' }}>
                                        <td style={{ padding: '15px' }}>{user.email}</td>
                                        <td style={{ padding: '15px' }}>{user.role || 'User'}</td>
                                        <td style={{ padding: '15px' }}>
                                            {user.createdAt?.seconds
                                                ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            {user.lastLogin?.seconds
                                                ? new Date(user.lastLogin.seconds * 1000).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '15px', textAlign: 'center' }}>No users found. (Note: Only users who signed up recently are in the database)</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
