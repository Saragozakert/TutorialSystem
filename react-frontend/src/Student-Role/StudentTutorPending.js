import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiCalendar,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style2/StudentDashboard.css";
import "./style2/StudentTutorPending.css";

function StudentTutorPending() {
  const [student, setStudent] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Pending");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      const studentData = JSON.parse(storedStudent);
      setStudent(studentData);
      fetchPendingRequests(studentData.id);
    }
  }, []);

  const fetchPendingRequests = async (studentId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/tutor-requests",
        {
          params: {
            student_id: studentId,
          },
        }
      );

      // Transform the data to match your frontend structure
      const formattedRequests = response.data.map((request) => ({
        id: request.id,
        tutorName: request.tutor.full_name,
        course: request.tutor.course,
        yearLevel: request.tutor.year_level,
        subject: request.subject,
        teachingMethod: request.tutor.teaching_method,
        status: request.status,
        dateRequested: new Date(request.created_at).toLocaleDateString(),
      }));

      setPendingRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      // Fallback to mock data if API fails
      const mockRequests = [
        {
          id: 1,
          tutorName: "Dave Tabaranza",
          course: "BSIT",
          yearLevel: "4th Year",
          subject: "ITE14",
          teachingMethod: "Virtual",
          status: "Pending",
          dateRequested: "2023-05-15",
        },
      ];
      setPendingRequests(mockRequests);
    } finally {
      setLoading(false);
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

  // Rest of your component remains the same...
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!collapsed && (
            <h3 className="welcome-text">
              Welcome {student?.firstName || "Student"}!
            </h3>
          )}
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

      {/* Main Content */}
      <div className="main-content">
        <div className="section-header-modern">
          <h1 className="section-title-modern">
            <span className="section-header-icon">
              <FiAlertCircle />
            </span>
            Pending Tutors
          </h1>
          <div className="section-controls-modern">
            <input
              type="text"
              placeholder="Search sessions..."
              className="search-input-modern"
            />
            <button className="filter-btn-modern">Filter</button>
          </div>
        </div>
        <div className="modern-table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Tutor's Name</th>
                <th>Course</th>
                <th>Year Level</th>
                <th>Subject Requested</th>
                <th>Teaching Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="loading-cell">
                    <div className="loading-spinner"></div>
                    Loading pending requests...
                  </td>
                </tr>
              ) : pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-cell"></td>
                </tr>
              ) : (
                pendingRequests.map((request, index) => (
                  <tr key={request.id}>
                    <td>{index + 1}</td>
                    <td className="tutor-name-cell">{request.tutorName}</td>
                    <td>{request.course}</td>
                    <td>{request.yearLevel}</td>
                    <td>{request.subject}</td>
                    <td>
                      <span
                        className={`method-tag method-${request.teachingMethod
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {request.teachingMethod}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${request.status.toLowerCase()}`}
                      >
                        {request.status === "Pending" ? (
                          <FiClock />
                        ) : request.status === "Accepted" ? (
                          <FiCheckCircle />
                        ) : (
                          <FiXCircle />
                        )}
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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

export default StudentTutorPending;
