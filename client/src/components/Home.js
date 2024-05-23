import React, { useState, useEffect, useContext } from 'react';

import VideoUpload from './VideoUpload';
import VideoList from './VideoList';

import { AuthContext } from '../context/AuthContext';

function Home() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [buttonState, setButtonState] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { authState } = useContext(AuthContext);

    const handleSubmit = () => {
        setIsLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('video', file);

        fetch('http://localhost:5000/videos', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState.authToken}`,
            },
            body: formData,
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .then(() => fetchVideos())
            .catch(error => console.error('Error:', error));
    };

    const fetchVideos = async () => {
        try {
            if (!isLoading) {
                setIsLoading(true);
            }
            let endpoint = '';
            if (buttonState === 'allVideos') {
                endpoint = '/';
            } else if (buttonState === 'userVideos') {
                endpoint = `/user/${authState.userId}`;
            } else if (buttonState === 'likedVideos') {
                endpoint = `/my-likes/${authState.userId}`;
            } else if (buttonState !== '' && buttonState !== 'allVideos' && buttonState !== 'userVideos' && buttonState !== 'likedVideos' && buttonState !== 'playlists') {
                // get all videos in a playlist
                endpoint = `/playlist/${buttonState}/videos`
            }
            const response = await fetch(`http://localhost:5000/videos${endpoint}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authState.authToken}`,
                },
            });
            const data = await response.json();
            setVideos(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [buttonState, authState.userId]);

    const handleDelete = (videoId) => {
        setVideos(videos.filter(video => video._id !== videoId));
    };

    return (
        <div>
            <VideoUpload
                title={title}
                setTitle={setTitle}
                setFile={setFile}
                description={description}
                setDescription={setDescription}
                handleSubmit={handleSubmit}
            />
            <VideoList
                videos={videos}
                buttonState={buttonState}
                setButtonState={setButtonState}
                handleDelete={handleDelete}
                isLoading={isLoading}
            />
        </div>
    );
}

export default Home;