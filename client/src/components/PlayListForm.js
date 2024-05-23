import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import usePlayLists from "../hooks/usePlayLists";
import '../styles/PlayListForm.css';

const PlayListForm = ({ videoId, setPlayListForm }) => {
    const { authState } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [playlists, fetchPlaylists] = usePlayLists();

    const handleChange = (event) => {
        setName(event.target.value);
    }

    // Add a new playlist    
    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost:5000/videos/playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authState.authToken}`
            },
            body: JSON.stringify({ name, videoId, userId: authState.userId })
        })
        setName('');
    }

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const saveVideo = (playlistId) => {
        fetch(`http://localhost:5000/videos/playlist/${playlistId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authState.authToken}`
            },
            body: JSON.stringify({ playlistId, videoId, userId: authState.userId })
        })
    }

    return (
        <form onSubmit={handleSubmit} id="playlist-form">
            <label id="playlist-name-label">
                Playlist name:
                <input type="text" name="name" value={name} onChange={handleChange} id="playlist-name-input" />
            </label>
            <div id="playlist-add-btns">
                {playlists.map(playlist => (
                    <button onClick={(e) => { e.preventDefault(); saveVideo(playlist._id); }} key={playlist._id} id="playlist">
                        {playlist.name}
                    </button>
                ))}
            </div>
            <button type="submit" id="playlist-submit">Add playlist</button>
            <button onClick={(e) => { e.preventDefault(); setPlayListForm(false); }} id="playlist-cancel">Cancel</button>
        </form>
    );
};

export default PlayListForm;