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
  FiX,
  FiCheckCircle,
  FiStar,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style2/StudentSchedule.css";

function StudentSched() {
  const [student, setStudent] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Schedule");
  const navigate = useNavigate();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // Calculate pagination data
  const totalPages = Math.ceil(upcomingSessions.length / rowsPerPage);
  const currentRows = upcomingSessions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // 'success' or 'error'
  });

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
  }, []);

  useEffect(() => {
    const fetchStudentSessions = async () => {
      if (!student?.id) return;

      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/student-sessions",
          {
            params: {
              student_id: student.id,
            },
          }
        );

        const formattedSessions = response.data.map((session) => ({
          id: session.id,
          tutorName: session.tutor?.full_name || "Tutor not available",
          schedule: session.schedule,
          subject: session.subject,
          status: session.status === "accepted" ? "confirmed" : session.status,
        }));

        setUpcomingSessions(formattedSessions);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setUpcomingSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentSessions();
  }, [student]);

  const handleDeclineSession = async (sessionId) => {
    try {
      await axios.put(`http://localhost:8000/api/tutor-requests/${sessionId}`, {
        status: "declined",
      });

      setUpcomingSessions((prev) =>
        prev.filter((session) => session.id !== sessionId)
      );

      // Show success notification
      setNotification({
        show: true,
        message: "Session declined successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Error declining session:", err);
      // Show error notification
      setNotification({
        show: true,
        message: "Failed to decline session",
        type: "error",
      });
    }
  };

  const handleRateSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    try {
      // Submit the rating to your backend
      const response = await axios.post(
        `http://localhost:8000/api/sessions/${currentSessionId}/rate`,
        {
          rating,
          feedback,
        }
      );

      if (response.data.message === "Session rated successfully") {
        // Remove the rated session from the list
        setUpcomingSessions((prev) =>
          prev.filter((session) => session.id !== currentSessionId)
        );

        // Show success notification
        setNotification({
          show: true,
          message: "Thank you for your ratings!",
          type: "success",
        });

        // Hide modal and reset form
        setShowRatingModal(false);
        setRating(0);
        setHoverRating(0);
        setFeedback("");

        // Hide notification after 3 seconds
        setTimeout(() => {
          setNotification((prev) => ({ ...prev, show: false }));
          setTimeout(
            () => setNotification({ show: false, message: "", type: "" }),
            300
          );
        }, 2700);
      } else {
        throw new Error("Failed to submit rating");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
      // Show error notification
      setNotification({
        show: true,
        message: "Failed to submit rating",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
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

  return (
    <div className="dashboard-container-ker">
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
      <div className="main-content-ker">
        {/* Upcoming Sessions Table */}
        <div className="section-header-modern">
          <h1 className="section-title-modern">
            <span className="section-header-icon">
              <FiClock />
            </span>
            My Tutoring Sessions
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

        <div className="modern-table-container-ker">
          <table className="modern-table-ker">
            <thead>
              <tr>
                <th>No.</th>
                <th>Schedule</th>
                <th>Tutor's Name</th>
                <th>Subject Requested</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="loading-cell">
                    Loading sessions...
                  </td>
                </tr>
              ) : upcomingSessions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">

                  </td>
                </tr>
              ) : (
                currentRows.map((session, index) => (
                  <tr key={session.id}>
                    <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td>
                      <span className="schedule-badge-ker">
                        {new Date(session.schedule).toLocaleString()}
                      </span>
                    </td>
                    <td>{session.tutorName}</td>
                    <td>{session.subject}</td>
                    <td>
                      <span className={`status-badge-ker ${session.status}`}>
                        {session.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-ker">
                        {session.status === "confirmed" && (
                          <button
                            className="decline-btn-ker"
                            onClick={() => handleDeclineSession(session.id)}
                          >
                            <FiX /> Decline
                          </button>
                        )}
                        {session.status === "completed" && (
                          <button
                            className="rate-btn-ker"
                            onClick={() => handleRateSession(session.id)}
                          >
                            <FiStar /> Rate Us
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-ker">
          <div className="table-pagination-ker">
            <button
              className="pagination-btn-ker"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="page-number-ker">
              {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-btn-ker"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
          <div className="table-summary-ker">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, upcomingSessions.length)} of{" "}
            {upcomingSessions.length} entries
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="modal-overlay">
          <div className="rating-modal">
            <div className="modal-header">
              <h3>Rate Your Session</h3>
              <button
                className="close-modal"
                onClick={() => {
                  setShowRatingModal(false);
                  setRating(0);
                  setHoverRating(0);
                  setFeedback("");
                }}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${
                      (hoverRating || rating) >= star ? "filled" : ""
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <FiStar />
                  </span>
                ))}
              </div>
              <div className="rating-text">
                {rating === 0
                  ? "Select your rating"
                  : `You rated ${rating} star${rating > 1 ? "s" : ""}`}
              </div>
              <textarea
                className="feedback-input"
                placeholder="Share your feedback (optional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button
                className="submit-rating-btn"
                onClick={handleSubmitRating}
                disabled={rating === 0}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            {notification.type === "success" ? (
              <FiCheckCircle className="notification-icon" />
            ) : (
              <FiX className="notification-icon" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            {notification.type === "success" ? (
              <FiCheckCircle className="notification-icon" />
            ) : (
              <FiX className="notification-icon" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

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

export default StudentSched;
