import React, { useContext, useEffect } from 'react';

import { AuthContext } from '../context/AuthContext';

import VideoDetails from './VideoDetails';

import usePlayLists from '../hooks/usePlayLists';

import '../styles/VideoList.css';

function VideoList({ videos, buttonState, setButtonState, handleDelete, isLoading }) {
    const { authState } = useContext(AuthContext);
    const [playlists, fetchPlaylists] = usePlayLists();
    const handlePlaylistDelete = (playlistId) => {
        fetch(`http://localhost:5000/videos/playlist/${playlistId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authState.authToken}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // fetchPlaylists();
                setButtonState('allVideos');
            })
            .catch(error => console.error('Error:', error));
    }

    useEffect(() => {
        if (buttonState === 'playlists') fetchPlaylists();
    }, [buttonState])

    return (
        <div id='video-list'>
            <div id='video-list-buttons'>
                {authState.authToken && (
                    <button onClick={() => setButtonState('allVideos')} id='all-videos'>All Videos</button>
                )}
                {authState.authToken && (
                    <button onClick={() => setButtonState('userVideos')} id='my-videos'>My Videos</button>
                )}
                {authState.authToken && (
                    <button onClick={() => setButtonState('likedVideos')} id='liked-videos'>Liked Videos</button>
                )}
                {authState.authToken && (
                    <button onClick={() => setButtonState('playlists')} id='saved-videos'>Saved Videos</button>
                )}
            </div>
            <center>
                {isLoading && "...Loading"}
            </center>
            {buttonState !== 'allVideos' && buttonState !== 'userVideos' && buttonState !== 'likedVideos' && (
                <div id='playlist-btns'>
                    {playlists.map(playlist => (
                        <div key={playlist._id} id='playlist-btn'>
                            <button onClick={() => setButtonState(`${playlist._id}`)} id='playlist-name-btn'>
                                {playlist.name}
                            </button>
                            <button onClick={() => handlePlaylistDelete(playlist._id)} id='playlist-delete-btn'>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {videos.map((video) => (
                <div key={video._id} id='video'>
                    <VideoDetails video={video} buttonState={buttonState} onDelete={handleDelete} />
                    <p id='uploaded-by'>Uploaded by: {video.uploader.username}</p>
                </div>
            ))}
        </div>
    );
}

export default VideoList;