import React, { useState } from 'react';
import { callLLM, formatDate } from '../utils';
import { getTagDef } from '../constants';

function PieceAIAssistant({ composer, piece }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk() {
    if (!question.trim()) {
      alert("Please enter a question first.");
      return;
    }
    setLoading(true);
    setError("");
    setAnswer("");

    const contextParts = [];
    contextParts.push("You are a helpful music learning assistant.");
    contextParts.push(`Piece: ${piece.title} (progress: ${piece.progress}%)`);
    contextParts.push(`Composer: ${composer.name}`);
    contextParts.push(
      `Due date: ${formatDate(piece.dueDate)} (${piece.dueDate})`
    );
    if (piece.sections && piece.sections.length > 0) {
      const tagged = piece.sections
        .map((s) => {
          const tagDef = getTagDef(s.tag);
          return `${s.label} = ${tagDef ? tagDef.label : "no tag"}`;
        })
        .join("; ");
      contextParts.push("Section tags: " + tagged);
    }

    const fullPrompt =
      contextParts.join("\n") +
      "\n\nStudent question:\n" +
      question.trim();

    try {
      const responseText = await callLLM(fullPrompt);
      setAnswer(responseText);
    } catch (e) {
      setError(
        e.message.includes("429")
          ? "Rate limited (429). Try clicking Ask again."
          : e.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-card">
      <div className="ai-title">AI Help for this Piece</div>
      <div style={{ fontSize: 12, color: "#757595", marginBottom: 8 }}>
        Ask about fingerings, technical challenges, practice strategies,
        interpretation, etc.
      </div>
      <textarea
        className="input-textarea"
        placeholder="e.g. What are the main technical challenges in the opening section?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        type="button"
        className="primary-button"
        style={{ width: "100%", marginTop: 4 }}
        onClick={handleAsk}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>
      {loading && (
        <div className="ai-loading">Contacting the LLM for advice...</div>
      )}
      {error && <div className="ai-error">Error: {error}</div>}
      {answer && <div className="ai-response">{answer}</div>}
    </div>
  );
}

export default PieceAIAssistant;

