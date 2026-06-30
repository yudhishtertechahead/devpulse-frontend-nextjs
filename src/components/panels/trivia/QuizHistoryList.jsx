'use client';

export default function QuizHistoryList({ 
  isLoadingHistory, 
  pastQuizzes, 
  loadQuizDetail 
}) {
  return (
    <div className="history-view">
      {isLoadingHistory ? (
        <p>Loading history...</p>
      ) : pastQuizzes.length === 0 ? (
        <p>No past quizzes found. Start one to see your history!</p>
      ) : (
        <div className="history-list">
          {pastQuizzes.map(quiz => (
            <div 
              key={quiz.id} 
              className="history-card"
              onClick={() => loadQuizDetail(quiz.id)}
            >
              <div className="history-info">
                <span className="history-date">
                  {new Date(quiz.created_at).toLocaleDateString()}
                </span>
                <span className={`difficulty ${quiz.difficulty}`}>
                  {quiz.difficulty}
                </span>
              </div>
              <div className="history-score">
                Score: {quiz.score}/{quiz.total_questions}
              </div>
              <div className="history-time">
                {quiz.time_taken}s
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
