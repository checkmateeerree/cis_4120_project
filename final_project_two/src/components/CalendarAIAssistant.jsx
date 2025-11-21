import React, { useState } from 'react';
import { callLLM } from '../utils';

function CalendarAIAssistant({ pieces }) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePlan() {
    if (pieces.length === 0) {
      alert("No pieces to plan for.");
      return;
    }
    setLoading(true);
    setError("");
    setAnswer("");

    const summaryLines = pieces
      .map(
        (p) =>
          `- ${p.title} by ${p.composerName || "Unknown"} (due ${
            p.dueDate
          }, progress ${p.progress}%)`
      )
      .join("\n");

    const prompt =
      "You are a music practice planning assistant.\n" +
      "Given these pieces, their due dates, and current progress, suggest a 7-day practice plan.\n" +
      "Be specific with which measures/sections to focus on and how many minutes per day.\n\n" +
      "Pieces:\n" +
      summaryLines;

    try {
      const responseText = await callLLM(prompt);
      setAnswer(responseText);
    } catch (e) {
      setError(
        e.message.includes("429")
          ? "Rate limited (429). Try again in a bit."
          : e.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-card" style={{ marginTop: 16 }}>
      <div className="ai-title">AI Study Plan</div>
      <div style={{ fontSize: 12, color: "#757595", marginBottom: 8 }}>
        Generate a study plan based on your upcoming due dates.
      </div>
      <button
        type="button"
        className="primary-button"
        style={{ width: "100%" }}
        onClick={handlePlan}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate 7-day plan"}
      </button>
      {loading && (
        <div className="ai-loading">Asking AI for a study plan...</div>
      )}
      {error && <div className="ai-error">Error: {error}</div>}
      {answer && <div className="ai-response">{answer}</div>}
    </div>
  );
}

export default CalendarAIAssistant;


