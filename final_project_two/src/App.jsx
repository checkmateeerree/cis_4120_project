import React, { useState, useEffect, useMemo } from 'react';
import HomePage from './components/HomePage';
import ComposerPage from './components/ComposerPage';
import PiecePage from './components/PiecePage';
import AddComposerPage from './components/AddComposerPage';
import CalendarPage from './components/CalendarPage';
import BottomNav from './components/BottomNav';
import SearchOverlay from './components/SearchOverlay';
import ProgressModal from './components/ProgressModal';

function App() {
  const [composers, setComposers] = useState([]); // start empty
  const [view, setView] = useState("home"); // home | composer | piece | addComposer | calendar
  const [selectedComposerId, setSelectedComposerId] = useState(null);
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [progressModalPiece, setProgressModalPiece] = useState(null);
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);

  // feather icons
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  });

  const selectedComposer = useMemo(
    () => composers.find((c) => c.id === selectedComposerId) || null,
    [composers, selectedComposerId]
  );

  const selectedPiece = useMemo(() => {
    if (!selectedComposer) return null;
    return selectedComposer.pieces.find((p) => p.id === selectedPieceId) || null;
  }, [selectedComposer, selectedPieceId]);

  const allPieces = useMemo(() => {
    const list = [];
    composers.forEach((c) => {
      c.pieces.forEach((p) => {
        list.push({ ...p, composerId: c.id, composerName: c.name });
      });
    });
    return list;
  }, [composers]);

  function openComposer(composerId) {
    setSelectedComposerId(composerId);
    setView("composer");
  }

  function openPiece(composerId, pieceId) {
    setSelectedComposerId(composerId);
    setSelectedPieceId(pieceId);
    setView("piece");
  }

  function addComposer({ name, portraitFile }) {
    const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const newComposer = {
      id,
      name,
      portrait: portraitFile, // { name, dataUrl, type }
      pieces: [],
    };
    setComposers((prev) => [...prev, newComposer]);
  }

  function addPieceToComposer(composerId, piece) {
    setComposers((prev) =>
      prev.map((c) =>
        c.id === composerId ? { ...c, pieces: [...c.pieces, piece] } : c
      )
    );
  }

  function updatePiece(composerId, pieceId, updater) {
    setComposers((prev) =>
      prev.map((c) => {
        if (c.id !== composerId) return c;
        return {
          ...c,
          pieces: c.pieces.map((p) =>
            p.id === pieceId ? { ...p, ...updater(p) } : p
          ),
        };
      })
    );
  }

  // for highlights + annotations
  function updatePiecePdfData(composerId, pieceId, pdfHighlights, pdfNotes) {
    updatePiece(composerId, pieceId, () => ({
      pdfHighlights,
      pdfNotes,
    }));
  }

  function handleSetSectionTag(piece, sectionId, tagId) {
    setComposers((prev) =>
      prev.map((c) => ({
        ...c,
        pieces: c.pieces.map((p) => {
          if (p.id !== piece.id) return p;
          return {
            ...p,
            sections: p.sections.map((s) =>
              s.id === sectionId ? { ...s, tag: tagId } : s
            ),
          };
        }),
      }))
    );
  }

  function openProgressModal(piece, composerId) {
    setProgressModalPiece({ ...piece, composerId });
  }

  function applyProgress(pieceInfo, newProgress) {
    updatePiece(pieceInfo.composerId, pieceInfo.id, () => ({
      progress: newProgress,
    }));
  }

  const currentMonthDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + calendarMonthOffset);
    d.setDate(1);
    return d;
  }, [calendarMonthOffset]);

  return (
    <div className="app-shell">
      <main className="app-main">
        <div className="page">
          {view === "home" && (
            <HomePage
              composers={composers}
              onOpenComposer={openComposer}
              onOpenAddComposer={() => setView("addComposer")}
            />
          )}

          {view === "composer" && selectedComposer && (
            <ComposerPage
              composer={selectedComposer}
              onBack={() => setView("home")}
              onOpenPiece={(pieceId) =>
                openPiece(selectedComposer.id, pieceId)
              }
              onAddPiece={(piece) =>
                addPieceToComposer(selectedComposer.id, piece)
              }
              onOpenProgressModal={(piece) =>
                openProgressModal(piece, selectedComposer.id)
              }
            />
          )}

          {view === "piece" && selectedComposer && selectedPiece && (
            <PiecePage
              composer={selectedComposer}
              piece={selectedPiece}
              onBack={() => setView("composer")}
              onSetSectionTag={(sectionId, tagId) =>
                handleSetSectionTag(selectedPiece, sectionId, tagId)
              }
              onOpenProgressModal={(piece) =>
                openProgressModal(piece, selectedComposer.id)
              }
              onUpdatePdfData={(pdfHighlights, pdfNotes) =>
                updatePiecePdfData(
                  selectedComposer.id,
                  selectedPiece.id,
                  pdfHighlights,
                  pdfNotes
                )
              }
            />
          )}

          {view === "addComposer" && (
            <AddComposerPage
              onBack={() => setView("home")}
              onCreate={(data) => {
                addComposer(data);
                setView("home");
              }}
            />
          )}

          {view === "calendar" && (
            <CalendarPage
              pieces={allPieces}
              currentMonthDate={currentMonthDate}
              onChangeMonth={(delta) =>
                setCalendarMonthOffset((m) => m + delta)
              }
            />
          )}
        </div>
      </main>

      <BottomNav
        activeView={view}
        onHome={() => setView("home")}
        onSearch={() => setSearchOpen(true)}
        onCalendar={() => setView("calendar")}
      />

      {searchOpen && (
        <SearchOverlay
          pieces={allPieces}
          onClose={() => setSearchOpen(false)}
          onOpenPiece={(composerId, pieceId) => {
            openPiece(composerId, pieceId);
            setSearchOpen(false);
          }}
        />
      )}

      {progressModalPiece && (
        <ProgressModal
          piece={progressModalPiece}
          onClose={() => setProgressModalPiece(null)}
          onSave={(value) => {
            applyProgress(progressModalPiece, value);
            setProgressModalPiece(null);
          }}
        />
      )}
    </div>
  );
}

export default App;


