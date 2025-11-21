import React, { useState, useEffect, useRef } from 'react';
import { hexToRgba } from '../utils';

function PdfHighlighterViewer({
  file,
  pdfHighlights,
  pdfNotes,
  activeTag,
  onUpdatePdfData,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [currentHighlight, setCurrentHighlight] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      if (!window.pdfjsLib || !file?.dataUrl) return;
      try {
        const loadingTask = window.pdfjsLib.getDocument(file.dataUrl);
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages || 1);
        setPageNumber(1);
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
  const pageNotes = (pdfNotes && pdfNotes[pageNumber]) || [];

  function currentColors() {
    const base = activeTag?.baseHex || "#FFD747";
    return {
      bg: hexToRgba(base, 0.25),
      border: hexToRgba(base, 0.9),
    };
  }

  function handleMouseDown(e) {
    if (!containerRef.current) return;
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
      const newHighlight = {
        ...currentHighlight,
        id: Date.now(),
        bg,
        border,
      };
      const newPageHighlights = [...pageHighlights, newHighlight];
      const newPdfHighlights = {
        ...(pdfHighlights || {}),
        [pageNumber]: newPageHighlights,
      };
      onUpdatePdfData(newPdfHighlights, pdfNotes || {});
    }
    setIsDrawing(false);
    setStartPos(null);
    setCurrentHighlight(null);
  }

  function handleDoubleClick(e) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const text = window.prompt("Add annotation text:");
    if (!text || !text.trim()) return;

    const newNote = {
      id: Date.now(),
      x,
      y,
      text: text.trim(),
    };

    const newPageNotes = [...pageNotes, newNote];
    const newPdfNotes = {
      ...(pdfNotes || {}),
      [pageNumber]: newPageNotes,
    };
    onUpdatePdfData(pdfHighlights || {}, newPdfNotes);
  }

  function goPage(delta) {
    setPageNumber((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > numPages) return numPages;
      return next;
    });
  }

  return (
    <div>
      <div className="pdf-controls">
        <div style={{ fontSize: 13, color: "#757595" }}>
          Highlight by dragging on the PDF. Double-click anywhere to add a text
          note.
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
            onClick={() =>
              onUpdatePdfData(
                { ...(pdfHighlights || {}), [pageNumber]: [] },
                { ...(pdfNotes || {}), [pageNumber]: [] }
              )
            }
            disabled={pageHighlights.length === 0 && pageNotes.length === 0}
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
              }}
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

          {pageNotes.map((note) => (
            <div
              key={note.id}
              style={{
                position: "absolute",
                left: `${note.x}px`,
                top: `${note.y}px`,
                transform: "translate(-50%, -110%)",
                background: "#ffffff",
                borderRadius: 8,
                border: "1px solid #e1e1f0",
                padding: "4px 6px",
                fontSize: 10,
                maxWidth: 180,
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                color: "#555",
              }}
            >
              {note.text}
            </div>
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

