import React, { useState } from 'react';
import { callLLM, formatDate, daysUntil } from '../utils';

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

    const today = new Date();
    const todayFormatted = formatDate(today.toISOString().slice(0, 10));
    const todayISO = today.toISOString().slice(0, 10);

    const daysUntilList = pieces
      .map((p) => daysUntil(p.dueDate))
      .filter((d) => d !== null);
    
    let planDays = 7;
    
    if (daysUntilList.length > 0) {
      const latestDays = Math.max(...daysUntilList);
      if (latestDays >= 0) {
        planDays = Math.min(latestDays + 1, 7);
      } else {
        planDays = 1;
      }
    }

    const summaryLines = pieces
      .map((p) => {
        const daysUntilDue = daysUntil(p.dueDate);
        const dueDateFormatted = formatDate(p.dueDate);
        let dueText = dueDateFormatted;
        if (daysUntilDue !== null) {
          if (daysUntilDue < 0) {
            dueText += ` (${Math.abs(daysUntilDue)} days overdue)`;
          } else if (daysUntilDue === 0) {
            dueText += " (due today)";
          } else if (daysUntilDue === 1) {
            dueText += " (due tomorrow)";
          } else {
            dueText += ` (due in ${daysUntilDue} days)`;
          }
        }
        const totalPages = p.totalPages || 1;
        const pagesCompleted = p.pagesCompleted || 0;
        const progressPercentage = totalPages > 0 ? Math.round((pagesCompleted / totalPages) * 100) : 0;
        return `- ${p.title} by ${p.composerName || "Unknown"} (${dueText}, ${pagesCompleted}/${totalPages} pages, ${progressPercentage}%)`;
      })
      .join("\n");

    const planDaysText = planDays === 1 ? "1-day" : `${planDays}-day`;

    const prompt =
      "You are a music practice planning assistant.\n" +
      `Today's date is ${todayFormatted} (${todayISO}).\n` +
      `Given these pieces, their due dates relative to today, and current progress, suggest a ${planDaysText} practice plan starting from today.\n` +
      "CRITICAL RULE: Each piece should ONLY be included in the plan until its own due date. For example:\n" +
      "- If a piece is due in 2 days, it should only appear in days 1-2 of the plan.\n" +
      "- If a piece is due in 5 days, it can appear in days 1-5 of the plan.\n" +
      "- Do NOT include any piece in days beyond its due date.\n" +
      "The overall plan should cover all pieces, but each piece stops appearing on its due date.\n" +
      "Be specific with which measures/sections to focus on and how many minutes per day.\n" +
      "Prioritize pieces that are due sooner and need more work based on their progress percentage.\n" +
      "IMPORTANT: Please keep your response concise and under 600 words to ensure the complete response is delivered.\n\n" +
      "Pieces:\n" +
      summaryLines;

    try {
      const responseText = await callLLM(prompt, 2500);
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
        {loading ? "Generating..." : "Generate study plan"}
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


