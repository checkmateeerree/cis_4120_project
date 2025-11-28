import React from 'react';

function BottomNav({ activeView, onHome, onSearch, onCalendar }) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        <div
          className={
            "nav-item " + (activeView === "home" ? "nav-item-active" : "")
          }
          onClick={onHome}
        >
          <i data-feather="home"></i>
          <span>Home</span>
        </div>
        <div className="nav-item" onClick={onSearch}>
          <i data-feather="search"></i>
          <span>Search</span>
        </div>
        <div
          className={
            "nav-item " +
            (activeView === "calendar" ? "nav-item-active" : "")
          }
          onClick={onCalendar}
        >
          <i data-feather="calendar"></i>
          <span>Calendar</span>
        </div>
      </div>
    </nav>
  );
}

export default BottomNav;


