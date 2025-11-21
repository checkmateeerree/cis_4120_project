import React from 'react';
import CalendarAIAssistant from './CalendarAIAssistant';

function CalendarPage({ pieces, currentMonthDate, onChangeMonth }) {
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const isSameDay = (d) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }

  function piecesOnDate(date) {
    const iso = date.toISOString().slice(0, 10);
    return pieces.filter((p) => p.dueDate === iso);
  }

  const monthLabel = currentMonthDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <header className="page-header">
        <div>
          <div className="page-title">{monthLabel}</div>
          <div className="page-subtitle">
            Piece due dates, plus an AI study plan.
          </div>
        </div>
      </header>

      <div className="calendar-card">
        <div className="calendar-header-row">
          <button
            className="calendar-nav-button"
            onClick={() => onChangeMonth(-1)}
          >
            ←
          </button>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{monthLabel}</div>
          <button
            className="calendar-nav-button"
            onClick={() => onChangeMonth(1)}
          >
            →
          </button>
        </div>

        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="calendar-weekday">
              {d}
            </div>
          ))}
          {cells.map((date, idx) => {
            if (!date) {
              return (
                <div
                  key={"empty-" + idx}
                  className="calendar-cell calendar-cell-empty"
                />
              );
            }
            const dayPieces = piecesOnDate(date);
            const isToday = isSameDay(date);
            return (
              <div key={date.toISOString()} className="calendar-cell">
                <div
                  className={
                    "calendar-date" +
                    (isToday ? " calendar-date-today" : "")
                  }
                >
                  {date.getDate()}
                </div>
                {dayPieces.map((p) => (
                  <div key={p.id} className="calendar-badge">
                    {p.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <span
              className="legend-swatch"
              style={{ borderColor: "#0A0A18" }}
            />
            <span>Piece due date</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-swatch"
              style={{ background: "#e6f0ff" }}
            />
            <span>Today</span>
          </div>
        </div>

        <CalendarAIAssistant pieces={pieces} />
      </div>
    </>
  );
}

export default CalendarPage;


