// src\components\VideoUpload.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/VideoUpload.css';

function VideoUpload({ title, setTitle, description, setDescription, setFile, handleSubmit }) {
    const { logout } = useContext(AuthContext);
    return (
        <div id='upload'>
            <div id='upload-video'>
                <button onClick={logout} id='logout-btn'>Logout</button>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} id='upload-input'/>
            </div>
            <div id='upload-info'>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} id='video-title-input'/>
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} id='video-description-input'/>
                <button onClick={handleSubmit} id='submit-info-btn'>Upload</button>
            </div>
        </div>
    );
}

export default VideoUpload;