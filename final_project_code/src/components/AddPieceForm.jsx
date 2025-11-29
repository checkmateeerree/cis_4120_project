import React, { useState } from 'react';

function AddPieceForm({ onCancel, onCreate }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  function readFileAsDataUrl(file, callback) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      callback({
        name: file.name,
        type: file.type,
        dataUrl: ev.target.result,
      });
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      setError("Piece title and due date are required.");
      return;
    }
    if (!pdfFile) {
      setError("PDF sheet music is required.");
      return;
    }
    setError("");

    const pieceId =
      title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

    const piece = {
      id: pieceId,
      title: title.trim(),
      dueDate,
      pagesCompleted: 0,
      totalPages: totalPages,
      sections: [
        { id: "s1", label: "Measures 1–4", tag: null },
        { id: "s2", label: "Measures 5–8", tag: null },
      ],
      files: {
        pdf: pdfFile,
      },
      pdfHighlights: {},
      pdfNotes: {},
    };

    onCreate(piece);
  }

  async function handlePdfChange(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      readFileAsDataUrl(file, async (fileData) => {
        setPdfFile(fileData);
        if (window.pdfjsLib && fileData.dataUrl) {
          try {
            const loadingTask = window.pdfjsLib.getDocument(fileData.dataUrl);
            const pdf = await loadingTask.promise;
            const pages = pdf.numPages || 1;
            setTotalPages(pages);
          } catch (e) {
            console.error("Error reading PDF pages", e);
            setTotalPages(1);
          }
        }
      });
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      <div className="form-card form-card-full-width">
        <div className="form-row">
          <label className="form-label">Piece Title</label>
          <input
            className="input-text"
            placeholder="Enter piece title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label className="form-label">Due Date</label>
          <input
            className="input-text"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label className="form-label">Sheet Music PDF (required)</label>
          <input
            className="input-file"
            type="file"
            accept=".pdf"
            onChange={handlePdfChange}
          />
          {pdfFile && (
            <div className="file-meta" style={{ marginTop: 6 }}>PDF selected: {pdfFile.name}</div>
          )}
        </div>
        {error && <div className="error-text">{error}</div>}
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}
        >
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="primary-button">
            Create Piece
          </button>
        </div>
      </div>
    </form>
  );
}

export default AddPieceForm;


