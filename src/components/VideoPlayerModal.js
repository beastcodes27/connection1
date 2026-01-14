import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function VideoPlayerModal({ isOpen, onClose, videoUrl, title }) {
    if (!isOpen) return null;

    const isYouTube = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
    const isVimeo = videoUrl && videoUrl.includes('vimeo.com');

    const isGoogleDrive = videoUrl && videoUrl.includes('drive.google.com');

    // Helper to extract YouTube ID
    const getYouTubeEmbedUrl = (url) => {
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1];
            const ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition !== -1) {
                videoId = videoId.substring(0, ampersandPosition);
            }
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1];
        }
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    };

    // Helper to extract Vimeo ID
    const getVimeoEmbedUrl = (url) => {
        const videoId = url.split('/').pop();
        return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    };

    // Helper to extract Google Drive Preview URL
    const getGoogleDriveEmbedUrl = (url) => {
        // Look for /d/FILE_ID or id=FILE_ID
        // Pattern 1: https://drive.google.com/file/d/123456/view...
        // Pattern 2: https://drive.google.com/open?id=123456...

        let videoId = '';
        if (url.includes('/file/d/')) {
            const parts = url.split('/file/d/');
            if (parts.length > 1) {
                videoId = parts[1].split('/')[0];
            }
        } else if (url.includes('id=')) {
            const parts = url.split('id=');
            if (parts.length > 1) {
                videoId = parts[1].split('&')[0];
            }
        }

        if (videoId) {
            return `https://drive.google.com/file/d/${videoId}/preview?autoplay=1`;
        }

        return url; // Fallback
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.95)', zIndex: 2000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            flexDirection: 'column'
        }}>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    zIndex: 2001
                }}
            >
                <FaTimes />
            </button>

            <div style={{ width: '90%', maxWidth: '1000px', position: 'relative', aspectRatio: '16/9', background: '#000' }}>
                {isYouTube ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={getYouTubeEmbedUrl(videoUrl)}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : isVimeo ? (
                    <iframe
                        src={getVimeoEmbedUrl(videoUrl)}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={title}
                    ></iframe>
                ) : isGoogleDrive ? (
                    <iframe
                        src={getGoogleDriveEmbedUrl(videoUrl)}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        title={title}
                    ></iframe>
                ) : (
                    <video
                        src={videoUrl}
                        controls
                        autoPlay
                        style={{ width: '100%', height: '100%', outline: 'none' }}
                        controlsList="nodownload"
                    >
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>
            {title && <h3 style={{ color: 'white', marginTop: '20px', textAlign: 'center' }}>{title}</h3>}
        </div>
    );
}
