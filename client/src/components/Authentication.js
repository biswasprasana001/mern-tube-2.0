// client\src\components\Authentication.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Authentication.css';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setAuthState } = useContext(AuthContext);

    const handleSubmit = () => {
        const url = isLogin ? 'http://localhost:5000/auth/login' : 'http://localhost:5000/auth/register';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (isLogin) {
                    setAuthState({ authToken: data.token, username: username, userId: data.userId });
                }
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div id='authentication'>
            <div id='form'>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} id='username' />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} id='password' />
                <button onClick={handleSubmit} id='submit'>{isLogin ? 'Login' : 'Register'}</button>
                <button onClick={() => setIsLogin(!isLogin)} id='switch'>{isLogin ? 'Switch to Register' : 'Switch to Login'}</button>
            </div>
        </div>
    );
}

export default Auth;
