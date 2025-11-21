import React, { useState } from 'react';
import { formatDate } from '../utils';

function SearchOverlay({ pieces, onClose, onOpenPiece }) {
  const [query, setQuery] = useState("");

  const filtered = pieces.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.composerName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-card" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <div className="search-title">Search Pieces</div>
          <button className="search-close" onClick={onClose}>
            ×
          </button>
        </div>
        <input
          className="search-input"
          placeholder="Search by piece name or composer..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="search-results">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="search-item"
              onClick={() => onOpenPiece(p.composerId, p.id)}
            >
              <div className="search-piece-title">{p.title}</div>
              <div className="search-piece-sub">
                {p.composerName} • Due {formatDate(p.dueDate)}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                padding: "8px 4px",
                fontSize: 12,
                color: "#757595",
              }}
            >
              No pieces match that search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;


