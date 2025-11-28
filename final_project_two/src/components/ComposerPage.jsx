import React, { useState } from 'react';
import { formatDate } from '../utils';
import AddPieceForm from './AddPieceForm';

function ComposerPage({
  composer,
  onBack,
  onOpenPiece,
  onAddPiece,
  onOpenProgressModal,
  onDeleteComposer,
  onDeletePiece,
}) {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <>
      <header className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <div>
            <div className="page-title">{composer.name} Pieces</div>
            <div className="page-subtitle">
              Upload PDFs, audio, and get practice help.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="delete-button"
            type="button"
            onClick={onDeleteComposer}
          >
            Delete Composer
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => setShowAddForm((s) => !s)}
          >
            + Add New Piece
          </button>
        </div>
      </header>

      <section className="card-list">
        {composer.pieces.map((piece) => (
          <div key={piece.id} className="piece-card">
            <div className="piece-header-row">
              <div>
                <div className="piece-title">{piece.title}</div>
                <div className="piece-due">
                  Due {formatDate(piece.dueDate)}
                </div>
                <div className="file-meta">
                  {piece.files.pdf
                    ? `PDF: ${piece.files.pdf.name}`
                    : "No PDF uploaded"}
                  {piece.files.audio &&
                    ` · Audio: ${piece.files.audio.name}`}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 6,
                }}
              >
                <div className="progress-text">
                  {(() => {
                    const totalPages = piece.totalPages || 1;
                    const pagesCompleted = piece.pagesCompleted || 0;
                    const percentage = totalPages > 0 ? Math.round((pagesCompleted / totalPages) * 100) : 0;
                    return `${pagesCompleted} / ${totalPages} pages (${percentage}%)`;
                  })()}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    className="delete-button-small"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePiece(piece.id);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => onOpenProgressModal(piece)}
                  >
                    Edit Progress
                  </button>
                  <button
                    className="primary-button"
                    onClick={() => onOpenPiece(piece.id)}
                  >
                    Open piece
                  </button>
                </div>
              </div>
            </div>
            <div className="piece-progress-bar">
              <div
                className="piece-progress-fill"
                style={{ 
                  width: `${(() => {
                    const totalPages = piece.totalPages || 1;
                    const pagesCompleted = piece.pagesCompleted || 0;
                    return totalPages > 0 ? Math.round((pagesCompleted / totalPages) * 100) : 0;
                  })()}%` 
                }}
              />
            </div>
          </div>
        ))}
      </section>

      {showAddForm && (
        <div style={{ marginTop: 16 }}>
          <AddPieceForm
            onCancel={() => setShowAddForm(false)}
            onCreate={(piece) => {
              onAddPiece(piece);
              setShowAddForm(false);
            }}
          />
        </div>
      )}
    </>
  );
}

export default ComposerPage;


