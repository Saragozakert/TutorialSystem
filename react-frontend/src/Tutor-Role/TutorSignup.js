import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style3/TutorSignup.css";

function TutorSignup() {
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    course: "",
    year_level: "",
    payment_method: "",
    email: "",
    teaching_method: "",
    goal: "",
    username: "",
    password: "",
  });

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const subjects = [
    "CSC104",
    "CSC106",
    "ITE14",
    "ITE16",
    "ITE13",
    "ITE18",
    "ITE12",
    "ITE11",
    "IS107",
  ];
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCheckboxChange = (subject, e) => {
    e.stopPropagation(); // Prevent event from bubbling up to the dropdown
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  // In TutorSignup.js, update the handleSubmit function:
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, subjects: selectedSubjects };
      const response = await axios.post(
        "http://localhost:8000/api/tutor/register",
        payload
      );

      // Store the tutor data in localStorage immediately after registration
      localStorage.setItem("tutor", JSON.stringify(response.data.tutor));

      alert("Registered successfully");
      navigate("/tutor-login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="i-tutor-signup-container">
      <div className="i-tutor-signup-card">
        <div className="i-tutor-signup-header">
          <h1 className="i-tutor-signup-title">Become a Tutor</h1>
          <p className="i-tutor-signup-subtitle">
            Share your knowledge and inspire students
          </p>
        </div>

        <form className="i-tutor-signup-form" onSubmit={handleSubmit}>
          <div className="i-tutor-signup-grid">
            <div className="i-tutor-input-group-i">
              <label className="i-tutor-label-i" htmlFor="full_name">
                Full Name
              </label>
              <input
                className="i-tutor-input-i"
                type="text"
                id="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="i-tutor-input-group-i">
              <label className="i-tutor-label-i" htmlFor="age">
                Age
              </label>
              <input
                className="i-tutor-input-i"
                type="number"
                id="age"
                min="18"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="i-tutor-input-group-i">
              <label className="i-tutor-label-i" htmlFor="course">
                Course
              </label>
              <input
                className="i-tutor-input-i"
                type="text"
                id="course"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </div>

            <div className="i-tutor-input-group-i">
              <label className="i-tutor-label-i" htmlFor="year_level">
                Year Level
              </label>
              <select
                className="i-tutor-input-i"
                id="year_level"
                value={formData.year_level}
                onChange={handleChange}
                required
              >
                <option value="">Select year level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="i-tutor-input-group-i">
              <label className="i-tutor-label-i">Subjects Offered</label>
              <div
                className={`i-tutor-dropdown-i ${
                  isDropdownOpen ? "i-active" : ""
                }`}
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <div className="i-tutor-dropdown-display-i">
                  {selectedSubjects.length > 0
                    ? selectedSubjects.join(", ")
                    : "Select subjects"}
                  <span className="i-tutor-dropdown-arrow-i">
                    {isDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>
                {isDropdownOpen && (
                  <div
                    className="i-tutor-dropdown-options-i"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {subjects.map((subject) => (
                      <label
                        key={subject}
                        className="i-tutor-checkbox-label-i"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubjects.includes(subject)}
                          onChange={(e) => handleCheckboxChange(subject, e)}
                          className="i-tutor-checkbox-i"
                        />
                        <span className="i-tutor-checkbox-custom-i"></span>
                        {subject}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="i-tutor-input-group-i">
              <label className="i-tutor-label-i" htmlFor="payment_method">
                Payment Method
              </label>
              <select
                className="i-tutor-input-i"
                id="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                required
              >
                <option value="">Select method</option>
                <option value="Gcash">Gcash</option>
                <option value="Paypal">Paypal</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div className="i-tutor-input-group-i">
              <label className="i-tutor-label-i" htmlFor="email">
                Email
              </label>
              <input
                className="i-tutor-input-i"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="i-tutor-input-group-i">
              <label className="i-tutor-label-i" htmlFor="teaching_method">
                Teaching Method
              </label>
              <select
                className="i-tutor-input-i"
                id="teaching_method"
                value={formData.teaching_method}
                onChange={handleChange}
                required
              >
                <option value="">Select method</option>
                <option value="Virtual">Virtual</option>
                <option value="Face-to-face">Face-to-face</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div className="i-tutor-input-group-i i-tutor-textarea-group-i">
              <label className="i-tutor-label-i" htmlFor="goal">
                Teaching Philosophy
              </label>
              <textarea
                className="i-tutor-textarea-i"
                id="goal"
                rows="4"
                value={formData.goal}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="i-tutor-input-group-i">
              <label className="i-tutor-label-i" htmlFor="username">
                Username
              </label>
              <input
                className="i-tutor-input-i"
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="i-tutor-input-group-i">
              <label className="i-tutor-label-i" htmlFor="password">
                Password
              </label>
              <input
                className="i-tutor-input-i"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            {/* Rest of the form fields remain the same */}
          </div>

          <button type="submit" className="i-tutor-submit-button-i">
            Register as Tutor
          </button>

          <div className="x-signup-footer">
            <p>
              Already have an account? <a href="/tutor-login">Sign in</a>
            </p>
            <p>
              <a href="/">Go Back!</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TutorSignup;
