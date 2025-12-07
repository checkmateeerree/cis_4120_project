import React from 'react';
import { formatDueText } from '../utils';

function HomePage({ composers, onOpenComposer, onOpenAddComposer, onDeleteComposer }) {
  function nextDueForComposer(composer) {
    if (!composer.pieces.length) return null;
    const upcoming = [...composer.pieces].sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    )[0];
    return upcoming;
  }

  return (
    <>
      <header className="page-header-home">
        <div className="page-header-content">
          <div className="page-title">Music Learning Organizer</div>
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
        <div className="empty-state">
          <div className="empty-state-icon">🎵</div>
          <div className="empty-state-title">No composers yet</div>
          <div className="empty-state-text">
            Get started by adding your first composer to organize their pieces and practice schedule.
          </div>
          <button className="primary-button primary-button-lg" onClick={onOpenAddComposer}>
            Add your first composer
          </button>
        </div>
      ) : (
        <>
          <section className="composer-grid">
            {composers.map((composer) => {
              const upcoming = nextDueForComposer(composer);
              return (
                <div
                  key={composer.id}
                  className="composer-card"
                >
                  <button
                    className="composer-card-content"
                    onClick={() => onOpenComposer(composer.id)}
                  >
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
                    <div className="composer-next-piece">
                      {upcoming
                        ? formatDueText(upcoming.dueDate)
                        : "No pieces yet"}
                    </div>
                  </button>
                  <button
                    className="delete-button-small"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteComposer(composer.id);
                    }}
                    style={{ marginTop: '8px' }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
            <button
              className="composer-card composer-card-add"
              type="button"
              onClick={onOpenAddComposer}
            >
              <div className="composer-avatar composer-add">
                <div className="composer-add-plus">+</div>
              </div>
              <div className="composer-name">Add Composer</div>
              <div className="composer-next-piece">&nbsp;</div>
            </button>
          </section>
        </>
      )}
    </>
  );
}

export default HomePage;