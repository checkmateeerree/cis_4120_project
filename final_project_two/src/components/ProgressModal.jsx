import React, { useState } from 'react';

function ProgressModal({ piece, onClose, onSave }) {
  const [value, setValue] = useState(piece.progress);

  function handleSave() {
    onSave(Number(value));
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Update Progress</div>
        <div className="range-row">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div style={{ width: 70, textAlign: "right", fontSize: 14 }}>
            {value}% Learned
          </div>
        </div>
        <div className="modal-footer">
          <button className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" onClick={handleSave}>
            Save Progress
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgressModal;


