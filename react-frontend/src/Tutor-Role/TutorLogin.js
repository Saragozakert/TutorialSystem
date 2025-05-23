import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiUser, FiLock } from 'react-icons/fi';
import './style3/TutorLogin.css';

function TutorLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // In TutorLogin.js, update the handleLogin function:
const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/tutor/login', {
        username,
        password
      });

      // Store the tutor data in localStorage
      localStorage.setItem('tutor', JSON.stringify(response.data.tutor));

      navigate('/tutor-dashboard');
    } catch (err) {
      console.error(err);
      alert('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="magtutudlo-login-container">
      <div className="magtutudlo-login-box">
        <div className="magtutudlo-login-header">

          <h1 className="magtutudlo-login-title">Tutor Login</h1>

        </div>

        <form className="magtutudlo-login-form" onSubmit={handleLogin}>
          <div className="magtutudlo-input-group">
            <div className="magtutudlo-input-container">
              <FiUser className="magtutudlo-input-icon" />
              <input
                type="text"
                id="username"
                className="magtutudlo-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
              />
            </div>
          </div>

          <div className="magtutudlo-input-group">
            <div className="magtutudlo-input-container">
              <FiLock className="magtutudlo-input-icon" />
              <input
                type="password"
                id="password"
                className="magtutudlo-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="magtutudlo-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="magtutudlo-spinner"></span>
            ) : (
              <>
                <FiLogIn className="magtutudlo-btn-icon" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="studyante-auth-footer">
            <p>New here? <a href="/tutor-signup" className="studyante-auth-link">Create account</a></p>
            <p><a href="/" className="studyante-auth-link">Go Back!</a></p>
          </div>
      </div>
    </div>
  );
}

export default TutorLogin;
