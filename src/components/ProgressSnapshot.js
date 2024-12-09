import React, { useEffect, useState } from "react";
import { questions } from "../data/questions";
import "./ProgressSnapshot.css";

function ProgressSnapshot() {
  const [totalScore, setTotalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    // Retrieve scores from localStorage
    const storedScores = JSON.parse(localStorage.getItem('scores')) || {};
    let aggregatedScore = 0;
    let maxScore = 0;
    for (const scenario in storedScores) {
      aggregatedScore += storedScores[scenario];
    }
    for (const scenario in questions) {
      maxScore += questions[scenario].length;
    }
    setTotalScore(aggregatedScore);
    setTotalQuestions(maxScore);
  }, []);

  return (
    <section className="progress-snapshot">
      <h2>Your Progress</h2>
      <div className="progress-card">
        <p>Points: {totalScore}</p>
        <progress value={totalScore} max={totalQuestions}></progress>
      </div>
    </section>
  );
}

export default ProgressSnapshot;
