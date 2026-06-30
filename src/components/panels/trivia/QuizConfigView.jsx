'use client';

export default function QuizConfigView({ 
  selectedDifficulty, 
  setSelectedDifficulty, 
  isStarting, 
  startQuiz, 
  loadHistory 
}) {
  return (
    <div className="quiz-config">
      <p>Customize your quiz and start playing!</p>
      <div className="config-controls">
        <label>
          Difficulty:
          <select 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="any">Any</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <div className="btn-group">
          <button 
            className="start-quiz-btn" 
            onClick={startQuiz} 
            disabled={isStarting}
          >
            {isStarting ? "Loading..." : "Start Quiz"}
          </button>
          <button 
            className="history-quiz-btn" 
            onClick={loadHistory}
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
}
