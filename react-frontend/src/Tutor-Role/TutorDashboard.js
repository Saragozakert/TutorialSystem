import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiCalendar,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiTrendingUp,
  FiAward,
  FiClock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import logo from "./images/logo1.jpg";
import axios from "axios";
import "./style3/TutorDashboard.css";
import Calendar from "./Calendar"; // Adjust the path as needed



function TutorDashboard() {
  const [tutor, setTutor] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState("4.8");
  const [totalRatings, setTotalRatings] = useState(0);
  const [upcomingSessionsCount, setUpcomingSessionsCount] = useState(0);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [activeRequestsCount, setActiveRequestsCount] = useState(0);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // Fetch tutor rating
  useEffect(() => {
    const fetchTutorRating = async () => {
      if (!tutor?.id) return;
      try {
        const response = await axios.get(
          "http://localhost:8000/api/tutor-rating",
          {
            params: { tutor_id: tutor.id },
          }
        );
        setAverageRating(response.data.average_rating);
        setTotalRatings(response.data.total_ratings);
      } catch (err) {
        console.error("Error fetching tutor rating:", err);
        setAverageRating("4.8");
        setTotalRatings(0);
      }
    };
    fetchTutorRating();
  }, [tutor]);

  // Fetch upcoming sessions count
  useEffect(() => {
    const fetchUpcomingSessionsCount = async () => {
      if (!tutor?.id) return;
      try {
        const response = await axios.get(
          "http://localhost:8000/api/accepted-sessions",
          {
            params: { tutor_id: tutor.id },
          }
        );
        setUpcomingSessionsCount(response.data.length);
      } catch (err) {
        console.error("Error fetching upcoming sessions count:", err);
        setUpcomingSessionsCount(0);
      }
    };
    fetchUpcomingSessionsCount();
  }, [tutor]);

  // Fetch completed lessons count
  useEffect(() => {
    const fetchCompletedLessonsCount = async () => {
      if (!tutor?.id) return;
      try {
        const response = await axios.get(
          "http://localhost:8000/api/completed-sessions",
          {
            params: { tutor_id: tutor.id },
          }
        );
        setCompletedLessonsCount(response.data.length);
      } catch (err) {
        console.error("Error fetching completed lessons count:", err);
        setCompletedLessonsCount(0);
      }
    };
    fetchCompletedLessonsCount();
  }, [tutor]);

  // Fetch active requests count
  useEffect(() => {
    const fetchActiveRequestsCount = async () => {
      if (!tutor?.id) return;
      try {
        const response = await axios.get(
          "http://localhost:8000/api/tutor-requests",
          {
            params: { tutor_id: tutor.id, status: "pending" },
          }
        );
        setActiveRequestsCount(response.data.length);
      } catch (err) {
        console.error("Error fetching active requests count:", err);
        setActiveRequestsCount(0);
      }
    };
    fetchActiveRequestsCount();
  }, [tutor]);

  // Check tutor authentication
  useEffect(() => {
    const storedTutor = localStorage.getItem("tutor");
    if (storedTutor) {
      try {
        const parsedTutor = JSON.parse(storedTutor);
        if (!parsedTutor.full_name) {
          navigate("/tutor-login");
          return;
        }
        setTutor(parsedTutor);
      } catch (error) {
        navigate("/tutor-login");
      }
    } else {
      navigate("/tutor-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("tutor");
    navigate("/tutor-login");
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/tutor-dashboard" },
    { name: "Request", icon: <FiUsers />, path: "/tutor-request" },
    { name: "Schedule", icon: <FiCalendar />, path: "/tutor-schedule" },
    { name: "Logout", icon: <FiLogOut />, action: handleLogout },
  ];

  // Stats data with colors and icons
  const stats = [
    {
      title: "Active Request",
      value: activeRequestsCount,
      change: `${activeRequestsCount} active requests`,
      icon: <FiUsers className="stat-icon" />,
      color: "#6366F1",
    },

    {
      title: "Completed Lessons",
      value: completedLessonsCount,
      change: `${completedLessonsCount} completed lesson`,
      icon: <FiBook className="stat-icon" />,
      color: "#10B981",
    },
    {
      title: "Sessions",
      value: upcomingSessionsCount,
      change: `${upcomingSessionsCount} ongoing session`,
      icon: <FiClock className="stat-icon" />,
      color: "#F59E0B",
    },
    {
      title: "Rating",
      value: averageRating,
      change: `${totalRatings} total ratings`,
      icon: <FiAward className="stat-icon" />,
      color: "#EC4899",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!collapsed && <h3 className="welcome-text">Welcome Tutor!</h3>}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <div className="menu-items">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`menu-item ${
                activeItem === item.name ? "active" : ""
              }`}
              onClick={() => {
                setActiveItem(item.name);
                if (item.path) navigate(item.path);
                if (item.action) item.action();
              }}
            >
              <div className="menu-icon">{item.icon}</div>
              {!collapsed && <span className="menu-text">{item.name}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Modernized Main Content */}
      <div className="main-content">
        {/* Modern Header with Gradient */}
        <div className="dashboard-header-modern">
          <div className="header-content">
            <h1 className="dashboard-title-modern">
              <span className="title-gradient">Tutor Dashboard</span>
              <span className="title-subtext">
                Welcome back, {tutor?.full_name || "Tutor"}!
              </span>
            </h1>
            <div className="user-profile-modern">
              <div className="user-info">
                <p className="user-role">Tutor Account</p>
                <h3>{tutor ? tutor.full_name : "Tutor"}</h3>
              </div>
              <div className="avatar-container">
                <img src={logo} alt="Profile" className="avatar-modern" />
                <div className="status-indicator"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Stats Grid */}
        <div className="stats-grid-modern">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card-modern"
              style={{ "--card-accent": stat.color }}
            >
              <div
                className="stat-icon-container"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <p className="value">{stat.value}</p>
                <div className="change">
                  <FiTrendingUp className="trend-icon" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Calendar />
      </div>
      {showLogoutConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TutorDashboard;
