import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';
import './style2/Login.css';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/api/student/login', formData);
      localStorage.setItem('student', JSON.stringify(res.data.student));
      navigate('/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (


    <div className="studyante-auth-container">

      <div className="studyante-auth-glass">
        <div className="studyante-auth-content">
          <div className="studyante-auth-header">
            <h1 className="studyante-auth-title">Welcome Back</h1>
            <p className="studyante-auth-subtitle">Sign in to your learning portal</p>
          </div>

          {error && <div className="studyante-auth-error">{error}</div>}

          <form onSubmit={handleLogin} className="studyante-auth-form">
            <div className="studyante-input-field">
              <div className="studyante-input-container">
                <FaUser className="studyante-input-icon" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="studyante-input-field">
              <div className="studyante-input-container">
                <FaLock className="studyante-input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="studyante-auth-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="studyante-auth-spinner"></div>
              ) : (
                <>
                  Continue <FaArrowRight className="studyante-button-icon" />
                </>
              )}
            </button>
          </form>

          <div className="studyante-auth-footer">
            <p>New here? <a href="/signup" className="studyante-auth-link">Create account</a></p>
            <p><a href="/" className="studyante-auth-link">Go Back!</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
