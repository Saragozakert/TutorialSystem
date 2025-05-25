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
    FiBookOpen,
    FiClock,
    FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import logo from "./image/logo.jpg";
import axios from "axios";
import "./style2/StudentDashboard.css";

function StudentDashboard() {
    const [student, setStudent] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState("Dashboard");
    const [tutors, setTutors] = useState([]);
    const [uniqueSubjects, setUniqueSubjects] = useState([]);
    const navigate = useNavigate();

    const [activeSessions, setActiveSessions] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

    useEffect(() => {
        const storedStudent = localStorage.getItem("student");
        if (storedStudent) {
            const studentData = JSON.parse(storedStudent);
            setStudent(studentData);
            fetchAllTutors();
            fetchPendingRequests(studentData.id);
            fetchActiveSessions(studentData.id); // Add this line
        }
    }, []);

    const fetchActiveSessions = async (studentId) => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/student-sessions",
                {
                    params: {
                        student_id: studentId,
                        status: "accepted", // Only get accepted (confirmed) sessions
                    },
                }
            );
            setActiveSessions(response.data);
        } catch (err) {
            console.error("Error fetching active sessions:", err);
        }
    };

    const fetchPendingRequests = async (studentId) => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/tutor-requests",
                {
                    params: {
                        student_id: studentId,
                        status: "pending",
                    },
                }
            );
            setPendingRequests(response.data);
        } catch (err) {
            console.error("Error fetching pending requests:", err);
        }
    };

    const fetchAllTutors = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/tutors"
            );
            const tutorsData = response.data;
            setTutors(tutorsData);

            // Extract all unique subjects from tutors
            const allSubjects = tutorsData.flatMap((tutor) =>
                Array.isArray(tutor.subjects) ? tutor.subjects : []
            );
            const uniqueSubjects = [...new Set(allSubjects)];
            setUniqueSubjects(uniqueSubjects); // Add this state
        } catch (err) {
            console.error("Error fetching tutors:", err);
        }
    };

    const handleLogout = () => {
        setShowLogoutConfirmation(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem("tutor");
        navigate("/login");
    };

    const cancelLogout = () => {
        setShowLogoutConfirmation(false);
    };

    const menuItems = [
        { name: "Dashboard", icon: <FiHome />, path: "/student-dashboard" },
        { name: "Tutors", icon: <FiUsers />, path: "/student-select-tutors" },
        { name: "Pending", icon: <FiBook />, path: "/student-tutor-pending" },
        { name: "Schedule", icon: <FiCalendar />, path: "/student-schedule" },
        { name: "Logout", icon: <FiLogOut />, action: handleLogout },
    ];

    // Enhanced stats data with icons
    const stats = [
        {
            title: "Available Tutors",
            value: tutors.length,
            change: `${tutors.length} tutors available`,
            icon: <FiUser className="stat-icon" />,
            color: "#6366F1",
            tutorsList: tutors,
        },
        {
            title: "Subjects Offered",
            value: uniqueSubjects.length,
            change: `${uniqueSubjects.length} subjects available`,
            icon: <FiBookOpen className="stat-icon" />,
            color: "#10B981",
            subjectsList: uniqueSubjects, // Add subjects list
        },
        {
            title: "Pending Request",
            value: pendingRequests.length,
            change: `${pendingRequests.length} pending requests`,
            icon: <FiClock className="stat-icon" />,
            color: "#F59E0B",
            requestsList: pendingRequests,
        },
        {
            title: "Active Subject",
            value: [
                ...new Set(activeSessions.map((session) => session.subject)),
            ].length,
            change: `${
                [...new Set(activeSessions.map((session) => session.subject))]
                    .length
            } active subjects`,
            icon: <FiAward className="stat-icon" />,
            color: "#EC4899",
            activeSubjects: [
                ...new Set(activeSessions.map((session) => session.subject)),
            ], // Unique subjects
            sessionsList: activeSessions,
        },
    ];

    return (
        <div className="dashboard-container">
            {/* Sidebar remains the same */}
            <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    {!collapsed && (
                        <h3 className="welcome-text">Welcome Student!</h3>
                    )}
                    <button
                        className="collapse-btn"
                        onClick={() => setCollapsed(!collapsed)}
                        aria-label={
                            collapsed ? "Expand sidebar" : "Collapse sidebar"
                        }
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
                            {!collapsed && (
                                <span className="menu-text">{item.name}</span>
                            )}
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
                            <span className="title-gradient">Dashboard</span>
                            <span className="title-subtext">
                                Welcome back, {student?.first_name || "Student"}
                                !
                            </span>
                        </h1>
                        <div className="user-profile-modern">
                            <div className="user-info">
                                <p className="user-role">Student Account</p>
                                <h3>
                                    {student
                                        ? `${student.first_name} ${student.last_name}`
                                        : "Student"}
                                </h3>
                            </div>
                            <div className="avatar-container">
                                <img
                                    src={logo}
                                    alt="Profile"
                                    className="avatar-modern"
                                />
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
                            <button
                                className="cancel-btn"
                                onClick={cancelLogout}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-btn"
                                onClick={confirmLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentDashboard;
