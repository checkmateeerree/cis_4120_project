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
}) {
  const [activeTagId, setActiveTagId] = useState("difficult");
  const activeTag = getTagDef(activeTagId) || TAG_DEFS[0];

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
        <button
          className="piece-progress-pill"
          onClick={() => onOpenProgressModal(piece)}
        >
          {piece.progress}% Learned ✏️
        </button>
      </header>

      <div className="piece-layout">
        <div>
          <div
            style={{
              marginBottom: 12,
              fontSize: 13,
              color: "#757595",
            }}
          >
            Choose a tag (color), then drag on the PDF to highlight.  
            Click on measure rows to assign the same tags.  
            Double-click on the PDF to add a text note.
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
                  (activeTagId === tag.id ? " tag-active" : "")
                }
                style={{
                  borderRadius: 999,
                  borderColor:
                    activeTagId === tag.id ? "#0A0A18" : "#e1e1f0",
                  boxShadow:
                    activeTagId === tag.id ? "0 0 0 1px #0A0A18" : "none",
                }}
                onClick={() => setActiveTagId(tag.id)}
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
          </div>

          <div className="pdf-shell">
            {piece.files.pdf ? (
              <PdfHighlighterViewer
                file={piece.files.pdf}
                pdfHighlights={piece.pdfHighlights || {}}
                pdfNotes={piece.pdfNotes || {}}
                activeTag={activeTag}
                onUpdatePdfData={onUpdatePdfData}
              />
            ) : (
              <div style={{ fontSize: 13, color: "#757595" }}>
                No PDF uploaded for this piece.
              </div>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 12,
                color: "#757595",
                marginBottom: 6,
              }}
            >
              Measure tags:
            </div>
            {piece.sections.map((section) => {
              const tagDef = getTagDef(section.tag);
              return (
                <div
                  key={section.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    onSetSectionTag(
                      section.id,
                      section.tag === activeTagId ? null : activeTagId
                    )
                  }
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "1px solid #ddd",
                      background: tagDef ? tagDef.color : "transparent",
                    }}
                  />
                  <span style={{ fontSize: 12 }}>{section.label}</span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#757595",
                      marginLeft: "auto",
                    }}
                  >
                    {tagDef ? tagDef.label : "No tag"}
                  </span>
                </div>
              );
            })}
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

        <div>
          <PieceAIAssistant composer={composer} piece={piece} />
        </div>
      </div>
    </>
  );
}

export default PiecePage;


