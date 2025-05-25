import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiClock, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import "./style3/Calendar.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  // Sample data - replace with your actual API calls
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        date: new Date(new Date().setDate(15)),
        title: "Advanced Calculus",
        time: "10:00 AM",
        student: "Emma Johnson",
        duration: "60 min",
        type: "private"
      },
      {
        id: 2,
        date: new Date(new Date().setDate(18)),
        title: "Physics Review",
        time: "2:30 PM",
        student: "Michael Chen",
        duration: "90 min",
        type: "group"
      },
      {
        id: 3,
        date: new Date(new Date().setDate(20)),
        title: "Exam Preparation",
        time: "4:00 PM",
        student: "Sophia Williams",
        duration: "120 min",
        type: "private"
      },
      {
        id: 4,
        date: new Date(new Date().setDate(20)),
        title: "Office Hours",
        time: "6:00 PM",
        student: "Open session",
        duration: "60 min",
        type: "office"
      }
    ];
    setEvents(mockEvents);
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <h2 className="calendar-title">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="calendar-nav">
          <button
            onClick={prevMonth}
            className="nav-button"
            aria-label="Previous month"
          >
            <FiChevronLeft className="nav-icon" />
          </button>
          <button
            onClick={nextMonth}
            className="nav-button"
            aria-label="Next month"
          >
            <FiChevronRight className="nav-icon" />
          </button>
        </div>
      </div>
    );
  };

  const renderWeekdays = () => {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="weekdays-row">
        {weekdays.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const totalDaysToShow = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;
    const days = [];
    let dayCounter = 1;

    for (let i = 0; i < totalDaysToShow; i++) {
      if (i < firstDayOfMonth || dayCounter > daysInMonth) {
        // Empty cell before the first day of the month or after last day
        days.push(<div className="day empty" key={`empty-${i}`}></div>);
      } else {
        const currentDay = new Date(year, month, dayCounter);
        const hasEvent = events.some(event =>
          event.date.getDate() === dayCounter &&
          event.date.getMonth() === month &&
          event.date.getFullYear() === year
        );

        days.push(
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`day
              ${isSameDay(currentDay, new Date()) ? "today" : ""}
              ${isSameDay(currentDay, selectedDate) ? "selected" : ""}
              ${hasEvent ? "has-event" : ""}`}
            key={`day-${dayCounter}`}
            onClick={() => onDateClick(currentDay)}
          >
            <span className="day-number">{dayCounter}</span>
            {hasEvent && <div className="event-dot" />}
          </motion.div>
        );
        dayCounter++;
      }
    }

    // Split days into weeks (rows)
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(
        <div className="days-row" key={`week-${i}`}>
          {days.slice(i, i + 7)}
        </div>
      );
    }

    return <div className="calendar-grid">{weeks}</div>;
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const isSameDay = (a, b) => {
    return (
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear()
    );
  };

  const getEventTypeColor = (type) => {
    switch(type) {
      case 'private': return 'bg-purple-100 text-purple-800';
      case 'group': return 'bg-blue-100 text-blue-800';
      case 'office': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderEvents = () => {
    const dayEvents = events.filter((event) =>
      isSameDay(event.date, selectedDate)
    );

    return (
      <div className="events-panel">
        <div className="events-header">
          <h3 className="events-title">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <span className="events-count">
            {dayEvents.length} {dayEvents.length === 1 ? "Session" : "Sessions"}
          </span>
        </div>

        {dayEvents.length === 0 ? (
          <div className="no-events">
            <p className="no-events-text">No sessions scheduled</p>
            <button className="add-session-btn">
              <FiPlus className="plus-icon" />
              Add Session
            </button>
          </div>
        ) : (
          <div className="events-list">
            {dayEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -2 }}
                className="event-card"
              >
                <div className="event-time">
                  <FiClock className="clock-icon" />
                  {event.time}
                  <span className="event-duration">{event.duration}</span>
                </div>
                <div className="event-content">
                  <h4 className="event-title">{event.title}</h4>
                  <p className="event-student">With {event.student}</p>
                  <span className={`event-type ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
                <button className="event-action-btn">Details</button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        {renderHeader()}
        {renderWeekdays()}
        {renderCells()}
      </div>
      {renderEvents()}
    </div>
  );
};

export default Calendar;
