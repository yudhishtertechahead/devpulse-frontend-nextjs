'use client';

export default function QuizHistoryDetail({ selectedQuiz }) {
  if (!selectedQuiz) return null;
  
  return (
    <div className="history-detail-view">
      <div className="quiz-result-summary" style={{ marginTop: 0, marginBottom: '16px' }}>
        <h4>Quiz Detail ({new Date(selectedQuiz.created_at).toLocaleDateString()})</h4>
        <div className="result-stats">
          <p>Score: <strong>{selectedQuiz.score}</strong> / {selectedQuiz.total_questions}</p>
          <p>Time Taken: <strong>{selectedQuiz.time_taken}s</strong></p>
          <p>Difficulty: <strong>{selectedQuiz.difficulty}</strong></p>
        </div>
      </div>
      <div className="questions-list">
        {selectedQuiz.questions?.map((q) => (
          <div key={q.id} className="question-item interactive">
            <div className="question-text" dangerouslySetInnerHTML={{ __html: q.question }} />
            <div className="options-grid">
              {q.options.map((opt, i) => {
                let btnClass = "quiz-option disabled-view";
                if (opt === q.correct_option) {
                  btnClass += " correct";
                } else if (opt === q.selected_option) {
                  btnClass += " incorrect";
                } else {
                  btnClass += " unselected-disabled";
                }
                return (
                  <div 
                    key={i} 
                    className={btnClass}
                    dangerouslySetInnerHTML={{ __html: opt }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
