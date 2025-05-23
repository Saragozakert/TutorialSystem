import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiCalendar,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiX,
  FiUser,
  FiMail,
  FiMonitor,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style2/StudentSelectTutors.css";

function StudentSelectTutors() {
  const [student, setStudent] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Tutors");
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showSubjectsModal, setShowSubjectsModal] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // 'success' or 'error'
  });

  const requestTutor = (tutor) => {
    setSelectedTutor(tutor);
    setShowRequestForm(true);
  };

  const [formData, setFormData] = useState({
    subject: "",
    schedule: "",
    additionalNotes: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }

    const fetchTutors = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/tutors");
        setTutors(data);
      } catch (err) {
        console.error("Error fetching tutors:", err);
        // If keeping error state:
        setError("Failed to fetch tutors");
      } finally {
        // If keeping loading state:
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const viewSubjects = (tutor) => {
    setSelectedTutor(tutor);
    setShowSubjectsModal(true);
  };

  const closeModal = () => {
    setShowSubjectsModal(false);
    setShowRequestForm(false);
    setSelectedTutor(null);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update the handleSubmitRequest function
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/tutor-requests", {
        tutor_id: selectedTutor.id,
        student_id: student.id,
        subject: formData.subject,
        schedule: formData.schedule,
        notes: formData.additionalNotes,
      });

      // Show success notification
      setNotification({
        show: true,
        message: `Request sent to ${selectedTutor.full_name} for ${formData.subject}`,
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

      setShowRequestForm(false);
      setFormData({
        subject: "",
        schedule: "",
        additionalNotes: "",
      });
    } catch (err) {
      console.error("Error sending request:", err);
      // Show error notification
      setNotification({
        show: true,
        message: "Failed to send request",
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
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!collapsed && <h3 className="welcome-text">Welcome Student!</h3>}
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
                <FiUser />
                </span>
                Available Tutors
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
                <th>Subjects</th>
                <th>Payment</th>
                <th>Email</th>
                <th>Teaching Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="loading-cell">
                    Loading tutors...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="error-cell">
                    {error}
                  </td>
                </tr>
              ) : tutors.length === 0 ? (
                <tr>
                  <td colSpan="9">No tutors available</td>
                </tr>
              ) : (
                tutors.map((tutor, index) => (
                  <tr key={tutor.id}>
                    <td>{index + 1}</td>
                    <td className="tutor-name-cell">{tutor.full_name}</td>
                    <td>{tutor.course}</td>
                    <td>{tutor.year_level}</td>
                    <td>
                      <button
                        className="view-subjects-btn"
                        onClick={() => viewSubjects(tutor)}
                      >
                        <FiEye /> View
                      </button>
                    </td>
                    <td>
                      <span
                        className={`payment-badge payment-${tutor.payment_method.toLowerCase()}`}
                      >
                        {tutor.payment_method}
                      </span>
                    </td>
                    <td className="email-cell">{tutor.email}</td>
                    <td>
                      <span
                        className={`method-tag method-${tutor.teaching_method
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {tutor.teaching_method}
                      </span>
                    </td>
                    <td>
                      <button
                        className="request-btn"
                        onClick={() => requestTutor(tutor)}
                      >
                        Request
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subjects Modal - Modern & Aligned */}
      {showSubjectsModal && selectedTutor && (
        <div className="modal-overlay">
          <div className="modal-container modern-subjects-modal">
            <div className="modal-header">
              <div className="header-content">
                <FiBook className="header-icon" />
                <h3>Subjects Offered</h3>
              </div>
              <button className="close-btn" onClick={closeModal}>
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              {/* Tutor Profile Section */}
              <div className="tutor-profile-card">
                <div className="avatar-container">
                  <div className="tutor-avatar">
                    {selectedTutor.full_name.charAt(0)}
                  </div>
                </div>
                <div className="tutor-info">
                  <h4 className="tutor-name">{selectedTutor.full_name}</h4>
                  <div className="tutor-meta">
                    <span className="meta-item">{selectedTutor.course}</span>
                    <span className="meta-divider">•</span>
                    <span className="meta-item">
                      {selectedTutor.year_level}
                    </span>
                  </div>
                  <div className="tutor-contact">
                    <div className="contact-line">
                      <FiMail className="contact-icon" />
                      <span>{selectedTutor.email}</span>
                    </div>
                    <div className="contact-line">
                      <FiMonitor className="contact-icon" />
                      <span>{selectedTutor.teaching_method}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects Grid */}
              <div className="subjects-container">
                <div className="section-header">
                  <FiBook className="section-icon" />
                  <h4>Available Subjects</h4>
                </div>
                <div className="subjects-grid">
                  {selectedTutor.subjects.map((subject, index) => (
                    <div key={index} className="subject-chip">
                      {subject}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="secondary-btn" onClick={closeModal}>
                  Close
                </button>
                <button
                  className="primary-btn"
                  onClick={() => {
                    setShowSubjectsModal(false);
                    requestTutor(selectedTutor);
                  }}
                >
                  Request Tutor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Form Modal - Redesigned */}
      {showRequestForm && selectedTutor && (
        <div className="modal-overlay">
          <div className="modal-container compact-modal">
            <div className="modal-header">
              <h3>Request Tutor Session</h3>
              <button
                className="close-modal"
                onClick={() => setShowRequestForm(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="modal-content">
              <div className="tutor-info-compact">
                <div className="tutor-avatar-small">
                  {selectedTutor.full_name.charAt(0)}
                </div>
                <div>
                  <h4 className="tutor-name-sm">{selectedTutor.full_name}</h4>
                  <p className="tutor-course-sm">{selectedTutor.course}</p>
                </div>
              </div>

              <form onSubmit={handleSubmitRequest} className="compact-form">
                <div className="form-group-sm">
                  <label className="form-label-sm">Subject</label>
                  <select
                    className="form-input-sm"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select subject</option>
                    {selectedTutor.subjects.map((subject, index) => (
                      <option key={index} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group-sm">
                  <label className="form-label-sm">Preferred Schedule</label>
                  <input
                    type="datetime-local"
                    className="form-input-sm"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group-sm">
                  <label className="form-label-sm">Venue</label>
                  <textarea
                    className="form-input-sm form-textarea-sm"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleFormChange}
                    placeholder="Specific topics or requirements..."
                    rows="3"
                  />
                </div>

                <div className="form-actions-sm">
                  <button
                    type="button"
                    className="btn btn-secondary-sm"
                    onClick={() => setShowRequestForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-sm">
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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

export default StudentSelectTutors;
