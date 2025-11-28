import React from 'react';
import CalendarAIAssistant from './CalendarAIAssistant';

function CalendarPage({ pieces, currentMonthDate, onChangeMonth, onOpenPiece }) {
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

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
            AI study plan and calendar view.
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
            return (
              <div key={date.toISOString()} className="calendar-cell">
                <div className="calendar-date">
                  {date.getDate()}
                </div>
                {dayPieces.map((p) => (
                  <div
                    key={p.id}
                    className="calendar-badge calendar-badge-clickable"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenPiece && p.composerId) {
                        onOpenPiece(p.composerId, p.id);
                      }
                    }}
                    title={p.title}
                  >
                    {p.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>


        <CalendarAIAssistant pieces={pieces} />
      </div>
    </>
  );
}

export default CalendarPage;


