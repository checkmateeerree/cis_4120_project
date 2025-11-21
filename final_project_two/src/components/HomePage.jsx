import React from 'react';
import { formatDueText } from '../utils';

function HomePage({ composers, onOpenComposer, onOpenAddComposer }) {
  function nextDueForComposer(composer) {
    if (!composer.pieces.length) return null;
    const upcoming = [...composer.pieces].sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    )[0];
    return upcoming;
  }

  return (
    <>
      <header className="page-header">
        <div>
          <div className="page-title">Music Organization App</div>
          <div className="page-subtitle">
            Start by adding a composer, then upload their pieces and files.
          </div>
        </div>
        {composers.length > 0 && (
          <button className="primary-button" onClick={onOpenAddComposer}>
            + Add Composer
          </button>
        )}
      </header>

      {composers.length === 0 ? (
        <div className="form-card">
          <div style={{ fontSize: 14, marginBottom: 12 }}>
            You don't have any composers yet.
          </div>
          <button className="primary-button" onClick={onOpenAddComposer}>
            Add your first composer
          </button>
        </div>
      ) : (
        <>
          <section className="composer-grid">
            {composers.map((composer) => {
              const upcoming = nextDueForComposer(composer);
              return (
                <button
                  key={composer.id}
                  className="composer-card"
                  onClick={() => onOpenComposer(composer.id)}
                >
                  <div className="composer-next-piece">
                    {upcoming
                      ? formatDueText(upcoming.dueDate)
                      : "No pieces yet"}
                  </div>
                  <div className="composer-avatar">
                    {composer.portrait ? (
                      <img
                        src={composer.portrait.dataUrl}
                        alt={composer.name}
                      />
                    ) : (
                      <div className="composer-avatar-initial">
                        {composer.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="composer-name">{composer.name}</div>
                </button>
              );
            })}
            <button
              className="composer-card"
              type="button"
              onClick={onOpenAddComposer}
            >
              <div className="composer-next-piece">&nbsp;</div>
              <div className="composer-avatar composer-add">
                <div className="composer-add-plus">+</div>
              </div>
              <div className="composer-name">Add Composer</div>
            </button>
          </section>
        </>
      )}
    </>
  );
}

export default HomePage;

