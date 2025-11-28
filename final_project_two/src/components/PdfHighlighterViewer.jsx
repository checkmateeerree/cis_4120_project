import React, { useState, useEffect, useRef } from 'react';
import { hexToRgba } from '../utils';

function AnnotationMarker({ annotation, onMarkerClick, onDelete, onUpdate }) {
  const [showComment, setShowComment] = useState(false);
  const [commentText, setCommentText] = useState(annotation.text || '');
  const [isEditing, setIsEditing] = useState(!annotation.text);
  const commentRef = useRef(null);

  useEffect(() => {
    if (showComment && isEditing && commentRef.current) {
      commentRef.current.focus();
    }
  }, [showComment, isEditing]);

  const handleMarkerClick = (e) => {
    e.stopPropagation();
    setShowComment(!showComment);
    if (!annotation.text) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    onUpdate({ ...annotation, text: commentText });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(annotation.id);
    setShowComment(false);
  };

  const handleClose = () => {
    setShowComment(false);
    setIsEditing(false);
    if (!annotation.text) {
      setCommentText('');
    }
  };

  return (
    <>
      <div
        className={`annotation-marker ${annotation.text ? 'has-comment' : ''}`}
        style={{
          left: `${annotation.x}px`,
          top: `${annotation.y}px`,
        }}
        onClick={handleMarkerClick}
        title={annotation.text || 'Click to add comment'}
      >
        {annotation.text ? '•' : '+'}
      </div>
      {showComment && (
        <div
          className="annotation-comment"
          style={{
            left: `${annotation.x + 30}px`,
            top: `${annotation.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {isEditing ? (
            <>
              <textarea
                ref={commentRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter your comment..."
              />
              <div className="annotation-comment-actions">
                <button className="save-button" onClick={handleSave}>
                  Save
                </button>
                <button className="close-button" onClick={handleClose}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '8px' }}>{annotation.text}</div>
              <div className="annotation-comment-actions">
                <button className="save-button" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
                <button className="delete-button" onClick={handleDelete}>
                  Delete
                </button>
                <button className="close-button" onClick={handleClose}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

function PdfHighlighterViewer({
  file,
  pdfHighlights,
  pdfNotes,
  activeTag,
  deleteMode = false,
  onUpdatePdfData,
  onUpdateTotalPages,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const [highlightHistory, setHighlightHistory] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      if (!window.pdfjsLib || !file?.dataUrl) return;
      try {
        const loadingTask = window.pdfjsLib.getDocument(file.dataUrl);
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        setPdfDoc(pdf);
        const pages = pdf.numPages || 1;
        setNumPages(pages);
        setPageNumber(1);
        setHighlightHistory([]);
        if (onUpdateTotalPages) {
          onUpdateTotalPages(pages);
        }
      } catch (e) {
        console.error("Error loading PDF", e);
      }
    }

    loadPdf();
    return () => {
      cancelled = true;
    };
  }, [file]);

  useEffect(() => {
    async function renderPage() {
      if (!pdfDoc || !canvasRef.current) return;
      try {
        const page = await pdfDoc.getPage(pageNumber);
        const canvas = canvasRef.current;
        const viewport = page.getViewport({ scale: 1.3 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const ctx = canvas.getContext("2d");
        const renderContext = { canvasContext: ctx, viewport };
        await page.render(renderContext).promise;
      } catch (e) {
        console.error("Error rendering page", e);
      }
    }
    renderPage();
  }, [pdfDoc, pageNumber]);

  const pageHighlights = (pdfHighlights && pdfHighlights[pageNumber]) || [];
  const pageAnnotations = (pdfNotes && pdfNotes[pageNumber]) || [];

  function currentColors() {
    const base = activeTag?.baseHex || "#FFD747";
    return {
      bg: hexToRgba(base, 0.25),
      border: hexToRgba(base, 0.9),
    };
  }

  function handleMouseDown(e) {
    if (deleteMode) return;
    
    if (e.target.classList.contains('highlight') || 
        e.target.closest('.highlight') ||
        e.target.closest('.annotation-marker') ||
        e.target.closest('.annotation-comment')) {
      return;
    }
    if (!containerRef.current || e.target.tagName !== 'CANVAS') return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentHighlight({ x, y, width: 0, height: 0 });
  }

  function handleMouseMove(e) {
    if (!isDrawing || !startPos || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const width = currentX - startPos.x;
    const height = currentY - startPos.y;
    setCurrentHighlight({
      x: width < 0 ? currentX : startPos.x,
      y: height < 0 ? currentY : startPos.y,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  }

  function handleMouseUp() {
    if (
      currentHighlight &&
      currentHighlight.width > 5 &&
      currentHighlight.height > 5
    ) {
      const { bg, border } = currentColors();
      const highlightId = Date.now();
      const newHighlight = {
        ...currentHighlight,
        id: highlightId,
        bg,
        border,
      };
      const newPageHighlights = [...pageHighlights, newHighlight];
      const newPdfHighlights = {
        ...(pdfHighlights || {}),
        [pageNumber]: newPageHighlights,
      };
      setHighlightHistory(prev => [...prev, { pageNumber, highlightId }]);
      onUpdatePdfData(newPdfHighlights, pdfNotes || {});
    }
    setIsDrawing(false);
    setStartPos(null);
    setCurrentHighlight(null);
  }

  function handleDoubleClick(e) {
    if (deleteMode) return;
    if (!containerRef.current || e.target.tagName !== 'CANVAS') return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newAnnotation = {
      id: Date.now(),
      x: x - 10,
      y: y - 10,
      text: ''
    };
    
    const newPageAnnotations = [...pageAnnotations, newAnnotation];
    const newPdfNotes = {
      ...(pdfNotes || {}),
      [pageNumber]: newPageAnnotations,
    };
    onUpdatePdfData(pdfHighlights || {}, newPdfNotes);
    setSelectedAnnotation(newAnnotation.id);
  }

  function handleAnnotationUpdate(updatedAnnotation) {
    const newPageAnnotations = pageAnnotations.map(ann => 
      ann.id === updatedAnnotation.id ? updatedAnnotation : ann
    );
    const newPdfNotes = {
      ...(pdfNotes || {}),
      [pageNumber]: newPageAnnotations,
    };
    onUpdatePdfData(pdfHighlights || {}, newPdfNotes);
  }

  function handleAnnotationDelete(id) {
    const newPageAnnotations = pageAnnotations.filter(ann => ann.id !== id);
    const newPdfNotes = {
      ...(pdfNotes || {}),
      [pageNumber]: newPageAnnotations,
    };
    onUpdatePdfData(pdfHighlights || {}, newPdfNotes);
    if (selectedAnnotation === id) {
      setSelectedAnnotation(null);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.annotation-marker') && !e.target.closest('.annotation-comment')) {
        setSelectedAnnotation(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function goPage(delta) {
    setPageNumber((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > numPages) return numPages;
      return next;
    });
  }

  function handleUndo() {
    if (highlightHistory.length === 0) return;
    
    const lastHighlight = highlightHistory[highlightHistory.length - 1];
    const { pageNumber: targetPage, highlightId } = lastHighlight;
    
    const targetPageHighlights = (pdfHighlights && pdfHighlights[targetPage]) || [];
    const updatedPageHighlights = targetPageHighlights.filter(h => h.id !== highlightId);
    
    const newPdfHighlights = {
      ...(pdfHighlights || {}),
      [targetPage]: updatedPageHighlights,
    };
    
    setHighlightHistory(prev => prev.slice(0, -1));
    
    onUpdatePdfData(newPdfHighlights, pdfNotes || {});
  }

  function handleHighlightClick(e, highlightId) {
    e.stopPropagation();
    if (!deleteMode) return;
    
    const updatedPageHighlights = pageHighlights.filter(h => h.id !== highlightId);
    const newPdfHighlights = {
      ...(pdfHighlights || {}),
      [pageNumber]: updatedPageHighlights,
    };
    
    setHighlightHistory(prev => prev.filter(h => 
      !(h.pageNumber === pageNumber && h.highlightId === highlightId)
    ));
    
    onUpdatePdfData(newPdfHighlights, pdfNotes || {});
  }

  return (
    <div>
      <div className="pdf-controls">
        <div style={{ fontSize: 13, color: "#757595" }}>
          Drag to highlight. Double-click to add a text annotation marker.
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            className="secondary-button"
            onClick={() => goPage(-1)}
            disabled={pageNumber <= 1}
            style={{ fontSize: 11, paddingInline: 10 }}
          >
            Prev
          </button>
          <span style={{ fontSize: 12, color: "#757595" }}>
            Page {pageNumber} / {numPages}
          </span>
          <button
            type="button"
            className="secondary-button"
            onClick={() => goPage(1)}
            disabled={pageNumber >= numPages}
            style={{ fontSize: 11, paddingInline: 10 }}
          >
            Next
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={handleUndo}
            disabled={highlightHistory.length === 0}
            style={{ fontSize: 11, paddingInline: 10 }}
            title="Undo last highlight"
          >
            Undo
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              const pageHighlightIds = pageHighlights.map(h => h.id);
              setHighlightHistory(prev => prev.filter(h => 
                !(h.pageNumber === pageNumber && pageHighlightIds.includes(h.highlightId))
              ));
              onUpdatePdfData(
                { ...(pdfHighlights || {}), [pageNumber]: [] },
                { ...(pdfNotes || {}), [pageNumber]: [] }
              );
            }}
            disabled={pageHighlights.length === 0 && pageAnnotations.length === 0}
            style={{ fontSize: 11, paddingInline: 10 }}
          >
            Clear page
          </button>
        </div>
      </div>

      <div className="pdf-container">
        <div
          ref={containerRef}
          className="pdf-wrapper"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
        >
          <canvas ref={canvasRef}></canvas>

          {pageHighlights.map((h) => (
            <div
              key={h.id}
              className="highlight"
              style={{
                left: `${h.x}px`,
                top: `${h.y}px`,
                width: `${h.width}px`,
                height: `${h.height}px`,
                backgroundColor: h.bg,
                borderColor: h.border,
                cursor: deleteMode ? 'pointer' : 'default',
                opacity: deleteMode ? 1 : 1,
                transition: deleteMode ? 'opacity 0.2s ease, border-width 0.2s ease' : 'none',
              }}
              onClick={(e) => handleHighlightClick(e, h.id)}
              onMouseEnter={(e) => {
                if (deleteMode) {
                  e.currentTarget.style.opacity = '0.7';
                  e.currentTarget.style.borderWidth = '3px';
                }
              }}
              onMouseLeave={(e) => {
                if (deleteMode) {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.borderWidth = '2px';
                }
              }}
              title={deleteMode ? "Click to delete highlight" : ""}
            />
          ))}

          {currentHighlight && isDrawing && (() => {
            const { bg, border } = currentColors();
            return (
              <div
                className="highlight current"
                style={{
                  left: `${currentHighlight.x}px`,
                  top: `${currentHighlight.y}px`,
                  width: `${currentHighlight.width}px`,
                  height: `${currentHighlight.height}px`,
                  backgroundColor: bg,
                  borderColor: border,
                }}
              />
            );
          })()}

          {pageAnnotations.map((annotation) => (
            <AnnotationMarker
              key={annotation.id}
              annotation={annotation}
              onMarkerClick={handleAnnotationUpdate}
              onDelete={handleAnnotationDelete}
              onUpdate={handleAnnotationUpdate}
            />
          ))}
        </div>
      </div>

      <div className="file-meta" style={{ marginTop: 8 }}>
        {file.name}
      </div>
    </div>
  );
}

export default PdfHighlighterViewer;
