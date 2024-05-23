import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PlayListForm from './PlayListForm';
import ReactPlayer from 'react-player';
import "../styles/VideoDetails.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faShare, faTrash, faComment, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

function VideoDetails({ video, buttonState, onDelete }) {
    const { authState } = useContext(AuthContext);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [like, setLike] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [playListForm, setPlayListForm] = useState(false);

    useEffect(() => {
        setComments(video.comments);
        setLike(video.likes);
    }, [video]);

    const handleLike = () => {
        fetch(`http://localhost:5000/videos/${video._id}/like`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState.authToken}`,
            },
        })
            .then(response => response.json())
            .then(data => setLike(data.likes))
            .catch(error => console.error('Error:', error));
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const handleComment = () => {
        fetch(`http://localhost:5000/videos/${video._id}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authState.authToken}`,
            },
            body: JSON.stringify({ username: authState.username, comment: newComment }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(authState);
                setComments([...comments, { username: authState.username, comment: newComment }]);
                setNewComment('');
            })
            .catch(error => console.error('Error:', error));
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard');
    };

    const handleDelete = () => {
        const apiUrl = buttonState === 'userVideos'
            ? `http://localhost:5000/videos/${video._id}`
            : `http://localhost:5000/videos/playlist/${buttonState}/video/${video._id}`;

        fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authState.authToken}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                onDelete(video._id);
            })
            .catch(error => console.error('Error:', error));
    };

    const togglePlayListForm = () => {
        setPlayListForm(prevState => !prevState);
    };

    return (
        <div id='video-details'>
            <h2 id='video-title'>{video.title}</h2>
            <p id='video-description'>{video.description}</p>
            <div id='video-player'>
                <ReactPlayer url={video.url} controls width='100%' />
            </div>
            <p id='video-likes'>Likes: {like.length}</p>
            <div id='video-controls'>
                <div id='video-buttons'>
                    <button onClick={handleLike} id='like-btn'>
                        <FontAwesomeIcon icon={faThumbsUp} /> {like.includes(authState.userId) ? 'Unlike' : 'Like'}
                    </button>
                    <button onClick={handleShare} id='share-btn'>
                        <FontAwesomeIcon icon={faShare} /> Share
                    </button>
                    {buttonState !== '' && buttonState !== 'allVideos' && buttonState !== 'likedVideos' && (
                        <button onClick={handleDelete} id='delete-btn'>
                            <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                    )}
                    <button onClick={toggleComments} id='comment-btn'>
                        <FontAwesomeIcon icon={faComment} /> {showComments ? 'Hide Comments' : 'Show Comments'}
                    </button>
                    <button onClick={togglePlayListForm} id='add-to-playlist-btn'>
                        <FontAwesomeIcon icon={playListForm ? faMinus : faPlus} />
                        {playListForm ? ' Hide Playlists' : ' Add to Playlist'}
                    </button>
                </div>
                <div id='playlist-form-container'>
                    {playListForm && (
                        <PlayListForm videoId={video._id} setPlayListForm={setPlayListForm} />
                    )}
                </div>
            </div>
            {showComments && (
                <div id='comment-section'>
                    <input
                        type="text"
                        placeholder="Add a comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        id='comment-input'
                    />
                    <button onClick={handleComment} id='comment-submit-btn'>Comment</button>
                    {comments.map((comment, index) => (
                        <p key={index} id='comment'><strong>{comment.username}:</strong> {comment.comment}</p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default VideoDetails;