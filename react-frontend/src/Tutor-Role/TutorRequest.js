import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiCheck,
  FiX,
  FiClock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style3/TutorRequest.css";

function TutorRequest() {
  const [tutor, setTutor] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Request");
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // 'success' or 'error'
  });

  useEffect(() => {
    const storedTutor = localStorage.getItem("tutor");
    if (storedTutor) {
      try {
        const parsedTutor = JSON.parse(storedTutor);
        if (!parsedTutor.full_name) {
          console.error("Tutor data is missing full_name");
          navigate("/tutor-login");
          return;
        }
        setTutor(parsedTutor);
      } catch (error) {
        console.error("Error parsing tutor data:", error);
        navigate("/tutor-login");
      }
    } else {
      navigate("/tutor-login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!tutor?.id) return;

      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/tutor-requests",
          {
            params: {
              tutor_id: tutor.id,
            },
          }
        );
        setRequests(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to load requests");
        // Fallback mock data
        setRequests([
          {
            id: 1,
            subject: "Mathematics",
            schedule: new Date().toISOString(),
            notes: "Need help with algebra",
            status: "pending",
            student: {
              first_name: "John",
              last_name: "Doe",
              course: "Computer Science",
            },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [tutor]);

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

  const handleAccept = async (requestId) => {
    try {
       await axios.put(
        `http://localhost:8000/api/tutor-requests/${requestId}`,
        {
          status: "accepted",
        }
      );

      setRequests(requests.filter((req) => req.id !== requestId));

      // Show success notification
      setNotification({
        show: true,
        message: "Request accepted successfully!",
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
    } catch (err) {
      console.error("Error accepting request:", err);
      // Show error notification
      setNotification({
        show: true,
        message: "Failed to accept request",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.put(`http://localhost:8000/api/tutor-requests/${requestId}`, {
        status: "declined",
      });

      setRequests(requests.filter((req) => req.id !== requestId));

      // Show success notification
      setNotification({
        show: true,
        message: "Request declined successfully!",
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
    } catch (err) {
      console.error("Error declining request:", err);
      // Show error notification
      setNotification({
        show: true,
        message: "Failed to decline request",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/tutor-dashboard" },
    { name: "Request", icon: <FiUsers />, path: "/tutor-request" },
    { name: "Schedule", icon: <FiCalendar />, path: "/tutor-schedule" },
    { name: "Logout", icon: <FiLogOut />, action: handleLogout },
  ];

  return (
    <div className="dashboard-container-ker">
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
                setActiveItem(item.name); // Update active state immediately
                if (item.path) {
                  navigate(item.path);
                }
                if (item.action) {
                  item.action();
                }
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
        <div className="tutor-request-header-ker">
          <div className="section-header-modern">
            <h1 className="section-title-modern">
              <span className="section-header-icon">
                <FiClock />
              </span>
              Student Request
            </h1>
          </div>
        </div>

        <div className="modern-table-container-ker">
          <table className="modern-table-ker">
            <thead>
              <tr>
                <th>No.</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Course</th>
                <th>Subject Request</th>
                <th>Schedule</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="loading-cell">
                    Loading requests...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="error-cell">
                    {error}
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-cell"></td>
                </tr>
              ) : (
                requests.map((request, index) => (
                  <tr key={request.id}>
                    <td>{index + 1}</td>
                    <td>{request.student?.first_name || "N/A"}</td>
                    <td>{request.student?.last_name || "N/A"}</td>
                    <td>{request.student?.course || "N/A"}</td>
                    <td>{request.subject}</td>
                    <td>
                      <span className="schedule-badge-ker">
                        {new Date(request.schedule).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <div className="notes-content-ker">
                        {request.notes || "No notes"}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge-ker ${request.status}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-ker">
                        <button
                          className="accept-btn-ker"
                          onClick={() => handleAccept(request.id)}
                          disabled={request.status !== "pending"}
                        >
                          <FiCheck /> Accept
                        </button>
                        <button
                          className="decline-btn-ker"
                          onClick={() => handleDecline(request.id)}
                          disabled={request.status !== "pending"}
                        >
                          <FiX /> Decline
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
            <button className="pagination-btn-ker">Previous</button>
            <span className="page-number-ker">1</span>
            <button className="pagination-btn-ker">Next</button>
          </div>
          <div className="table-summary-ker">
            Showing 1 to {requests.length} of {requests.length} entries
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

export default TutorRequest;
