'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import Badge from '../../shared/Badge';
import { submitQuizResult } from '@/lib/api/quizApi';

export default function ActiveQuizView({
  quizQuestions,
  selectedDifficulty,
  setViewMode,
  initialStartTime,
  onQuizComplete,
}) {
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1200);

  useEffect(() => {
    let timerId;
    if (!quizResult && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !quizResult) {
      submitQuiz();
    }
    return () => clearInterval(timerId);
  }, [quizResult, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOptionClick = (questionId, option) => {
    if (userAnswers[questionId] !== undefined) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      let correctCount = 0;
      const formattedQuestions = quizQuestions.map(q => {
        const selectedOption = userAnswers[q.id];
        const isCorrect = selectedOption === q.correct_answer;
        if (isCorrect) correctCount++;
        return {
          question: q.question,
          options: q.options,
          selectedOption: selectedOption || '',
          correctOption: q.correct_answer,
          isCorrect
        };
      });

      const timeTaken = Math.floor((Date.now() - initialStartTime) / 1000);

      const payload = {
        difficulty: selectedDifficulty,
        score: correctCount,
        total_questions: quizQuestions.length,
        time_taken: timeTaken,
        questions: formattedQuestions
      };

      const res = await submitQuizResult(payload);
      setQuizResult(res.data || payload);
      onQuizComplete?.();
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz to backend. See console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="active-quiz">
      <div className="quiz-header">
        <h3>{quizQuestions.length} Questions ({selectedDifficulty} difficulty)</h3>
        <div className={`quiz-timer ${timeLeft < 60 ? 'danger' : ''}`}>
          <Clock size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>
      <div className="questions-list">
        {quizQuestions.map((q) => {
          const userAnswer = userAnswers[q.id];
          const isAnswered = userAnswer !== undefined;

          return (
            <div key={q.id} className="question-item interactive">
              <div className="question-text"
                dangerouslySetInnerHTML={{ __html: q.question }}
              />
              <div className="options-grid">
                {q.options.map((opt, i) => {
                  let btnClass = "quiz-option";
                  if (isAnswered) {
                    if (opt === q.correct_answer) {
                      btnClass += " correct";
                    } else if (opt === userAnswer) {
                      btnClass += " incorrect";
                    } else {
                      btnClass += " unselected-disabled";
                    }
                  }
                  return (
                    <button
                      key={i}
                      className={btnClass}
                      onClick={() => handleOptionClick(q.id, opt)}
                      disabled={isAnswered || !!quizResult}
                      dangerouslySetInnerHTML={{ __html: opt }}
                    />
                  );
                })}
              </div>
              <div className="question-meta">
                <span className={`difficulty ${q.difficulty}`}>
                  {q.difficulty}
                </span>
                <Badge color="#8b5cf6">{q.category}</Badge>
              </div>
            </div>
          );
        })}
      </div>
      {Object.keys(userAnswers).length > 0 && !quizResult && (
        <div className="quiz-actions">
          <button
            className="submit-quiz-btn"
            onClick={submitQuiz}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      )}
      {quizResult && (
        <div className="quiz-result-summary">
          <h4>Quiz Complete!</h4>
          <div className="result-stats">
            <p>Score: <strong>{quizResult.score}</strong> / {quizResult.total_questions}</p>
            <p>Time Taken: <strong>{quizResult.time_taken}s</strong></p>
          </div>
          <button
            className="start-quiz-btn"
            onClick={() => setViewMode('config')}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
