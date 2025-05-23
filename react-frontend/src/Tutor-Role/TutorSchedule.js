import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
  FiClock,
  FiArchive,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./style3/TutorRequest.css";
import "./style3/TutorSchedule.css";
import axios from "axios";

function TutorSchedule() {
  const [tutor, setTutor] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Schedule");
  const navigate = useNavigate();

  const [sessionHistory, setSessionHistory] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const historyRowsPerPage = 2;

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const historyTotalPages = Math.ceil(
    sessionHistory.length / historyRowsPerPage
  );

  const currentHistoryRows = sessionHistory.slice(
    (historyCurrentPage - 1) * historyRowsPerPage,
    historyCurrentPage * historyRowsPerPage
  );

  const totalPages = Math.ceil(upcomingSessions.length / rowsPerPage);
  const currentRows = upcomingSessions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // 'success' or 'error'
  });



  useEffect(() => {
    const fetchCompletedSessions = async () => {
      if (!tutor?.id) return;

      try {
        setHistoryLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/completed-sessions",
          {
            params: {
              tutor_id: tutor.id,
            },
          }
        );

        const formattedHistory = response.data.map((session) => ({
          id: session.id,
          firstName: session.student.first_name,
          lastName: session.student.last_name,
          course: session.student.course,
          subject: session.subject,
          notes: session.notes,
          status: session.status,
          schedule: session.schedule,
        }));

        setSessionHistory(formattedHistory);
      } catch (err) {
        console.error("Error fetching session history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchCompletedSessions();
  }, [tutor]);



  const handleCompleteSession = async (sessionId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/tutor-requests/${sessionId}`,
        { status: "completed" }
      );

      const completedSession = response.data.request;

      if (completedSession) {
        const formattedSession = {
          id: completedSession.id,
          firstName: completedSession.student.first_name,
          lastName: completedSession.student.last_name,
          course: completedSession.student.course,
          subject: completedSession.subject,
          notes: completedSession.notes,
          status: completedSession.status,
          schedule: completedSession.schedule,
        };

        setSessionHistory((prev) => [formattedSession, ...prev]);
        setUpcomingSessions((prev) =>
          prev.filter((session) => session.id !== sessionId)
        );

        if (
          currentPage > 1 &&
          upcomingSessions.length <= (currentPage - 1) * rowsPerPage
        ) {
          setCurrentPage(currentPage - 1);
        }

        // Show success notification
        setNotification({
          show: true,
          message: "Session marked as completed successfully!",
          type: "success",
        });

        // Hide after 3 seconds
        setTimeout(() => {
          setNotification((prev) => ({ ...prev, show: false }));
          setTimeout(
            () => setNotification({ show: false, message: "", type: "" }),
            300
          );
        }, 2700);
      }
    } catch (err) {
      console.error("Error completing session:", err);
      // Show error notification
      setNotification({
        show: true,
        message: "Failed to complete session",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  // Add this function near your other handlers
  const handleCancelSession = async (sessionId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/tutor-requests/${sessionId}`,
        { status: "cancelled" }
      );

      const cancelledSession = response.data.request;

      if (cancelledSession) {
        // Remove from upcoming sessions
        setUpcomingSessions((prev) =>
          prev.filter((session) => session.id !== sessionId)
        );

        // Reset pagination if needed
        if (
          currentPage > 1 &&
          upcomingSessions.length <= (currentPage - 1) * rowsPerPage
        ) {
          setCurrentPage(currentPage - 1);
        }

        // Show success notification
        setNotification({
          show: true,
          message: "Session cancelled successfully!",
          type: "success",
        });

        setTimeout(() => {
          setNotification((prev) => ({ ...prev, show: false }));
          setTimeout(
            () => setNotification({ show: false, message: "", type: "" }),
            300
          );
        }, 2700);
      }
    } catch (err) {
      console.error("Error cancelling session:", err);
      // Show error notification
      setNotification({
        show: true,
        message: "Failed to cancel session",
        type: "error",
      });
    }
  };

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

  useEffect(() => {
    const fetchAcceptedSessions = async () => {
      if (!tutor?.id) return;

      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/accepted-sessions",
          {
            params: {
              tutor_id: tutor.id,
            },
          }
        );

        // Transform the data to match your frontend structure
        const formattedSessions = response.data.map((session) => ({
          id: session.id,
          firstName: session.student.first_name,
          lastName: session.student.last_name,
          schedule: session.schedule,
          subject: session.subject,
          notes: session.notes,
          status: "confirmed", // Change from 'accepted' to 'confirmed' for display
        }));

        setUpcomingSessions(formattedSessions);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        // Fallback to mock data if needed
        setUpcomingSessions([
          {
            id: 1,
            firstName: "Roider",
            lastName: "Talingting",
            schedule: new Date().toISOString(),
            subject: "ITE18",
            notes: "Annex Bldg.",
            status: "confirmed",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedSessions();
  }, [tutor]);

  return (
    <div className="dashboard-container-ker">
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

      {/* Main Content */}
      <div className="main-content-ker">
        {/* Upcoming Sessions Table */}
        <div className="section-header-modern">
          <h1 className="section-title-modern">
            <span className="section-header-icon">
              <FiClock />
            </span>
            Upcoming Sessions
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
                <th>First Name</th>
                <th>Last Name</th>
                <th>Subject Requested</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="loading-cell">
                    Loading sessions...
                  </td>
                </tr>
              ) : upcomingSessions.length === 0 ? (
                <td colSpan="7" className="empty-cell"></td>
              ) : (
                currentRows.map((session, index) => (
                  <tr key={session.id}>
                    <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td>
                      <span className="schedule-badge-ker">
                        {new Date(session.schedule).toLocaleString()}
                      </span>
                    </td>
                    <td>{session.firstName}</td>
                    <td>{session.lastName}</td>
                    <td>{session.subject}</td>
                    <td>
                      <div className="notes-content-ker">{session.notes}</div>
                    </td>
                    <td>
                      <span className={`status-badge-ker ${session.status}`}>
                        {session.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-ker">
                        <button
                          className="accept-btn-ker"
                          onClick={() => handleCompleteSession(session.id)}
                        >
                          <FiCheck /> Complete
                        </button>
                        <button
                          className="decline-btn-ker"
                          onClick={() => handleCancelSession(session.id)}
                        >
                          <FiX /> Cancel
                        </button>
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

        {/* Session History Table */}
        <div className="section-header-modern" style={{ marginTop: "3rem" }}>
          <h1 className="section-title-modern">
            <span className="section-header-icon">
              <FiArchive />
            </span>
            Session History
          </h1>
        </div>

        <div className="modern-table-container-ker">
          <table className="modern-table-ker">
            <thead>
              <tr>
                <th>No.</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Course</th>
                <th>Subject Tutored</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {historyLoading ? (
                <tr>
                  <td colSpan="6" className="loading-cell">
                    Loading session history...
                  </td>
                </tr>
              ) : sessionHistory.length === 0 ? (
                <td colSpan="7" className="empty-cell"></td>
              ) : (
                currentHistoryRows.map((session, index) => (
                  <tr key={session.id}>
                    <td>
                      {(historyCurrentPage - 1) * historyRowsPerPage +
                        index +
                        1}
                    </td>
                    <td>{session.firstName}</td>
                    <td>{session.lastName}</td>
                    <td>{session.course}</td>
                    <td>{session.subject}</td>
                    <td>
                      <span className={`status-badge-ker ${session.status}`}>
                        {session.status}
                      </span>
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
              onClick={() =>
                setHistoryCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={historyCurrentPage === 1}
            >
              Previous
            </button>
            <span className="page-number-ker">
              {historyCurrentPage} of {historyTotalPages}
            </span>
            <button
              className="pagination-btn-ker"
              onClick={() =>
                setHistoryCurrentPage((prev) =>
                  Math.min(prev + 1, historyTotalPages)
                )
              }
              disabled={
                historyCurrentPage === historyTotalPages ||
                historyTotalPages === 0
              }
            >
              Next
            </button>
          </div>
          <div className="table-summary-ker">
            Showing {(historyCurrentPage - 1) * historyRowsPerPage + 1} to{" "}
            {Math.min(
              historyCurrentPage * historyRowsPerPage,
              sessionHistory.length
            )}{" "}
            of {sessionHistory.length} entries
          </div>
        </div>
      </div>

      {notification.show && (
        <div
          className={`notification ${notification.type} ${
            !notification.show ? "hide" : ""
          }`}
        >
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

export default TutorSchedule;
