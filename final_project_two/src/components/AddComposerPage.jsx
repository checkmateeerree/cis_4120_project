import React, { useState, useRef } from 'react';

function AddComposerPage({ onBack, onCreate }) {
  const [name, setName] = useState("");
  const [portraitPreview, setPortraitPreview] = useState(null);
  const [portraitFile, setPortraitFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

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
      <header className="page-header page-header-add-composer">
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

      <div className="form-container-centered">
        <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="form-card form-card-centered">
          <div
            style={{
              textAlign: "center",
              fontSize: 16,
              color: "#757595",
              marginBottom: 12,
              fontWeight: 500,
            }}
          >
            Composer Portrait
          </div>
          <div 
            className="avatar-upload-large"
            onClick={() => fileInputRef.current?.click()}
          >
            {portraitPreview ? (
              <img src={portraitPreview} alt="Portrait preview" />
            ) : (
              <>
                <div style={{ fontSize: 64 }}>🖼️</div>
                <div style={{ fontSize: 15, color: "#757595", marginTop: 10 }}>
                  Click to upload portrait
                </div>
              </>
            )}
          </div>
          <div
            className="form-row"
            style={{ alignItems: "center", marginBottom: 20, marginTop: 4 }}
          >
            <input
              ref={fileInputRef}
              className="input-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ margin: '0 auto', display: 'none' }}
            />
            {portraitFile && (
              <div style={{ fontSize: 12, color: "#757595", textAlign: 'center', marginTop: 4 }}>
                {portraitFile.name}
              </div>
            )}
          </div>
          <div className="form-row" style={{ marginBottom: 20 }}>
            <label className="form-label" style={{ fontSize: 15 }}>Composer Name</label>
            <input
              className="input-text"
              placeholder="Enter composer name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ fontSize: 15, padding: '12px 18px' }}
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
      </div>
    </>
  );
}

export default AddComposerPage;


