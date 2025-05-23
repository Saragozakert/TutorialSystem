import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserGraduate, FaBookOpen, FaGraduationCap, FaUsers, FaChartLine, FaTrophy, FaFlag } from 'react-icons/fa';
import './style1/Mainpage.css';

function Mainpage() {
  const navigate = useNavigate();

  return (
    <div className="guro-landing-container">
      {/* Hero Section */}
      <section className="guro-hero-section">
        <div className="guro-hero-content">
          <h1 className="guro-hero-title">Welcome to <span> CCIS Study Buddy</span></h1>
          <p className="guro-hero-subtitle">Your gateway to transformative learning experiences</p>

          <div className="guro-cta-buttons">
            <button
              className="guro-cta-button guro-primary-cta"
              onClick={() => navigate('/login')}
            >
              <FaUserGraduate className="guro-button-icon" />
              Find Tutor!
            </button>
            <button
              className="guro-cta-button guro-secondary-cta"
              onClick={() => navigate('/tutor-login')}
            >
              <FaChalkboardTeacher className="guro-button-icon" />
              Teach With Us!
            </button>
          </div>
        </div>
        <div className="guro-hero-image"></div>
      </section>

      {/* Features Section */}
      <section className="guro-features-section">
        <div className="guro-features-grid">
          <div className="guro-feature-card">
            <div className="guro-feature-icon">
              <FaBookOpen />
            </div>
            <h3>Comprehensive Courses</h3>
            <p>Access a wide range of subjects taught by expert educators</p>
          </div>

          <div className="guro-feature-card">
            <div className="guro-feature-icon">
              <FaGraduationCap />
            </div>
            <h3>Personalized Learning</h3>
            <p>Tailored educational paths to match your learning style</p>
          </div>

          <div className="guro-feature-card">
            <div className="guro-feature-icon">
              <FaUsers />
            </div>
            <h3>Interactive Community</h3>
            <p>Connect with peers and mentors in collaborative spaces</p>
          </div>

          <div className="guro-feature-card">
            <div className="guro-feature-icon">
              <FaChartLine />
            </div>
            <h3>Progress Tracking</h3>
            <p>Monitor your growth with detailed analytics</p>
          </div>

          <div className="guro-feature-card">
            <div className="guro-feature-icon">
              <FaTrophy />
            </div>
            <h3>Goal Achievement Tools</h3>
            <p>Your best option to success!</p>
          </div>

          <div className="guro-feature-card">
            <div className="guro-feature-icon">
              <FaFlag />
            </div>
            <h3>Milestone Tracking</h3>
            <p>Equip yourself to reach every milestone</p>
          </div>

        </div>



      </section>

      {/* Testimonials Section */}
      <section className="guro-testimonials-section">
        <div className="guro-testimonials-container">
          <div className="guro-testimonial-card">
            <div className="guro-testimonial-content">
              "Study Buddy transformed my learning experience with its intuitive platform and supportive community."
            </div>
            <div className="guro-testimonial-author">- Kiethlene O. Guinea</div>
          </div>
          <div className="guro-testimonial-card">
            <div className="guro-testimonial-content">
              "As an tutor, I appreciate the tools and resources that make teaching more effective and engaging."
            </div>
            <div className="guro-testimonial-author">- Angela Lois A. Calo</div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default Mainpage;
