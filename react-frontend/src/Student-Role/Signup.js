import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style2/Signup.css";

function Signup() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    age: "",
    course: "",
    email: "",
    goal: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.first_name) newErrors.first_name = "First name is required";
    if (!form.last_name) newErrors.last_name = "Last name is required";
    if (!form.username) newErrors.username = "Username is required";
    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!form.age || form.age < 16) newErrors.age = "Age must be at least 16";
    if (!form.course) newErrors.course = "Course is required";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Valid email is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8000/api/student/register", form);
      navigate("/login", { state: { registered: true } });
    } catch (error) {
      alert("Registration failed. " + (error.response?.data?.message || ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="x-signup-container">
      <div className="x-signup-card">
        <div className="x-signup-header">
          <h1>Join Our Community</h1>
          <p>Start your learning journey today!</p>
        </div>

        <form className="x-signup-form" onSubmit={handleRegister}>
          <div className="x-form-grid">
            <div
              className={`x-form-group ${errors.first_name ? "x-error" : ""}`}
            >
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                placeholder="Enter first name"
                value={form.first_name}
                onChange={handleChange}
              />
              {errors.first_name && (
                <span className="x-error-message">{errors.first_name}</span>
              )}
            </div>

            <div
              className={`x-form-group ${errors.last_name ? "x-error" : ""}`}
            >
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                placeholder="Enter last name"
                value={form.last_name}
                onChange={handleChange}
              />
              {errors.last_name && (
                <span className="x-error-message">{errors.last_name}</span>
              )}
            </div>

            <div className={`x-form-group ${errors.username ? "x-error" : ""}`}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
              />
              {errors.username && (
                <span className="x-error-message">{errors.username}</span>
              )}
            </div>

            <div className={`x-form-group ${errors.password ? "x-error" : ""}`}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="x-error-message">{errors.password}</span>
              )}
            </div>

            <div className={`x-form-group ${errors.age ? "x-error" : ""}`}>
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                placeholder="Enter your age"
                min="16"
                value={form.age}
                onChange={handleChange}
              />
              {errors.age && (
                <span className="x-error-message">{errors.age}</span>
              )}
            </div>

            <div className={`x-form-group ${errors.course ? "x-error" : ""}`}>
              <label htmlFor="course">Course</label>
              <select id="course" value={form.course} onChange={handleChange}>
                <option value="">Select your course</option>
                <option value="BSIT">BS Information Technology</option>
                <option value="BSIS">BS Information Systems</option>
                <option value="BSCS">BS Computer Science</option>
              </select>
              {errors.course && (
                <span className="x-error-message">{errors.course}</span>
              )}
            </div>

            <div className={`x-form-group ${errors.email ? "x-error" : ""}`}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="x-error-message">{errors.email}</span>
              )}
            </div>

            <div className="x-form-group">
              <label htmlFor="goal">Learning Goal</label>
              <textarea
                id="goal"
                placeholder="What do you hope to achieve?"
                rows="3"
                value={form.goal}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="x-signup-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="x-spinner"></span>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="x-signup-footer">
            <p>
              Already have an account? <a href="/login">Sign in</a>
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

export default Signup;
