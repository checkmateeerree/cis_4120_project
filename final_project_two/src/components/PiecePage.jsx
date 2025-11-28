import React, { useState } from 'react';
import { formatDate } from '../utils';
import { TAG_DEFS, getTagDef } from '../constants';
import PdfHighlighterViewer from './PdfHighlighterViewer';
import PieceAIAssistant from './PieceAIAssistant';

function PiecePage({
  composer,
  piece,
  onBack,
  onSetSectionTag,
  onOpenProgressModal,
  onUpdatePdfData,
  onUpdateTotalPages,
  onDeletePiece,
}) {
  const [activeTagId, setActiveTagId] = useState("difficult");
  const [deleteMode, setDeleteMode] = useState(false);
  const activeTag = getTagDef(activeTagId) || TAG_DEFS[0];
  
  const totalPages = piece.totalPages || 1;
  const pagesCompleted = piece.pagesCompleted || 0;
  const progressPercentage = totalPages > 0 ? Math.round((pagesCompleted / totalPages) * 100) : 0;

  return (
    <>
      <header className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <div>
            <div className="page-title">{piece.title}</div>
            <div className="page-subtitle">
              {composer.name} • Due {formatDate(piece.dueDate)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="delete-button"
            type="button"
            onClick={onDeletePiece}
          >
            Delete Piece
          </button>
          <button
            className="piece-progress-pill"
            onClick={() => onOpenProgressModal(piece)}
          >
            {pagesCompleted} / {totalPages} pages ({progressPercentage}%) ✏️
          </button>
        </div>
      </header>

      <div className="piece-layout">
        <div className="piece-left-column">
          <div
            style={{
              marginBottom: 12,
              fontSize: 13,
              color: "#757595",
            }}
          >
            {deleteMode 
              ? "Delete mode: Click on highlights to delete them."
              : "Choose a tag (color), then drag on the PDF to highlight. Double-click on the PDF to add a text note."}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 14,
            }}
          >
            {TAG_DEFS.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className={
                  "secondary-button" +
                  (activeTagId === tag.id && !deleteMode ? " tag-active" : "")
                }
                style={{
                  borderRadius: 999,
                  borderColor:
                    activeTagId === tag.id && !deleteMode ? "#0A0A18" : "#e1e1f0",
                  boxShadow:
                    activeTagId === tag.id && !deleteMode ? "0 0 0 1px #0A0A18" : "none",
                  opacity: deleteMode ? 0.5 : 1,
                }}
                onClick={() => {
                  setActiveTagId(tag.id);
                  setDeleteMode(false);
                }}
                disabled={deleteMode}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: tag.color,
                    display: "inline-block",
                  }}
                />
                {tag.label}
              </button>
            ))}
            <button
              type="button"
              className={
                "secondary-button" +
                (deleteMode ? " tag-active" : "")
              }
              style={{
                borderRadius: 999,
                borderColor: deleteMode ? "#c33" : "#e1e1f0",
                boxShadow: deleteMode ? "0 0 0 1px #c33" : "none",
                color: deleteMode ? "#c33" : "#666",
              }}
              onClick={() => {
                setDeleteMode(!deleteMode);
                if (!deleteMode) {
                  setActiveTagId(null);
                }
              }}
            >
              🗑️ Delete
            </button>
          </div>

          <div className="pdf-shell">
            {piece.files.pdf ? (
              <PdfHighlighterViewer
                file={piece.files.pdf}
                pdfHighlights={piece.pdfHighlights || {}}
                pdfNotes={piece.pdfNotes || {}}
                activeTag={deleteMode ? null : activeTag}
                deleteMode={deleteMode}
                onUpdatePdfData={onUpdatePdfData}
                onUpdateTotalPages={onUpdateTotalPages}
              />
            ) : (
              <div style={{ fontSize: 13, color: "#757595" }}>
                No PDF uploaded for this piece.
              </div>
            )}
          </div>

          {piece.files.audio && (
            <div className="pdf-shell" style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, marginBottom: 6 }}>
                Audio reference
              </div>
              <audio
                className="audio-player"
                controls
                src={piece.files.audio.dataUrl}
              />
              <div className="file-meta">{piece.files.audio.name}</div>
            </div>
          )}
        </div>

        <div className="piece-right-column">
          <PieceAIAssistant composer={composer} piece={piece} />
        </div>
      </div>
    </>
  );
}

export default PiecePage;


