import React, { useState } from 'react';

function AddComposerPage({ onBack, onCreate }) {
  const [name, setName] = useState("");
  const [portraitPreview, setPortraitPreview] = useState(null);
  const [portraitFile, setPortraitFile] = useState(null);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPortraitPreview(ev.target.result);
        setPortraitFile({
          name: file.name,
          type: file.type,
          dataUrl: ev.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Composer name is required.");
      return;
    }
    if (!portraitFile) {
      setError("Composer portrait image is required.");
      return;
    }
    setError("");
    onCreate({ name: name.trim(), portraitFile });
  }

  return (
    <>
      <header className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <div>
            <div className="page-title">Add New Composer</div>
            <div className="page-subtitle">
              Portrait image and name are required.
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#757595",
            }}
          >
            Composer Portrait
          </div>
          <div className="avatar-upload">
            {portraitPreview ? (
              <img src={portraitPreview} alt="Portrait preview" />
            ) : (
              <>
                <div style={{ fontSize: 40 }}>🖼️</div>
                <div style={{ fontSize: 13, color: "#757595" }}>
                  Upload portrait (required)
                </div>
              </>
            )}
          </div>
          <div
            className="form-row"
            style={{ alignItems: "center", marginBottom: 24 }}
          >
            <input
              className="input-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Composer Name</label>
            <input
              className="input-text"
              placeholder="Enter composer name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {error && <div className="error-text">{error}</div>}
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
          >
            <button
              type="button"
              className="secondary-button"
              onClick={onBack}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Create Composer
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default AddComposerPage;


