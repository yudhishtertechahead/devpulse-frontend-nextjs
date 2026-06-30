'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import SectionTitle from '../../shared/SectionTitle';
import { fetchTrivia } from '@/lib/api/fetchTrivia';
import { getPastQuizzes, getQuizDetails } from '@/lib/api/quizApi';
import QuizConfigView from './QuizConfigView';
import ActiveQuizView from './ActiveQuizView';
import QuizHistoryList from './QuizHistoryList';
import QuizHistoryDetail from './QuizHistoryDetail';

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function TriviaQuizSection({ onQuizComplete }) {
  const [viewMode, setViewMode] = useState('config');
  const [selectedDifficulty, setSelectedDifficulty] = useState('any');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isStarting, setIsStarting] = useState(false);
  const [initialStartTime, setInitialStartTime] = useState(null);
  const [pastQuizzes, setPastQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const startQuiz = async () => {
    setIsStarting(true);
    try {
      const results = await fetchTrivia(20, selectedDifficulty);
      const formattedQuestions = results.map((q, index) => ({
        ...q,
        id: index,
        options: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
      }));
      setQuizQuestions(formattedQuestions);
      setInitialStartTime(Date.now());
      setViewMode('quiz');
    } catch (error) {
      console.error('Error starting quiz:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    setHistoryError(null);
    setViewMode('history');
    try {
      const res = await getPastQuizzes();
      setPastQuizzes(res?.data || []);
    } catch (error) {
      setHistoryError(
        error?.response?.data?.message || error.message || 'Failed to load quiz history'
      );
      setPastQuizzes([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadQuizDetail = async (id) => {
    setIsLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await getQuizDetails(id);
      setSelectedQuiz(res?.data || null);
      setViewMode('history-detail');
    } catch (error) {
      setHistoryError(
        error?.response?.data?.message || error.message || 'Failed to load quiz details'
      );
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleQuizComplete = () => {
    onQuizComplete?.();
  };

  return (
    <section className="trivia-quiz-section chart-card">
      <div className="panel-header-row">
        <SectionTitle>
          {viewMode === 'config' && 'Take a Quiz'}
          {viewMode === 'quiz' && 'Active Quiz'}
          {viewMode === 'history' && 'Quiz History'}
          {viewMode === 'history-detail' && 'Quiz Results'}
        </SectionTitle>
        {viewMode !== 'config' && viewMode !== 'quiz' && (
          <button
            type="button"
            className="back-btn"
            onClick={() => {
              if (viewMode === 'history-detail') {
                setViewMode('history');
              } else {
                setViewMode('config');
              }
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}
      </div>

      {historyError && viewMode !== 'config' && viewMode !== 'quiz' && (
        <div className="trivia-error-banner compact">
          <p>{historyError}</p>
        </div>
      )}

      {viewMode === 'config' && (
        <QuizConfigView
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          isStarting={isStarting}
          startQuiz={startQuiz}
          loadHistory={loadHistory}
        />
      )}

      {viewMode === 'quiz' && (
        <ActiveQuizView
          quizQuestions={quizQuestions}
          selectedDifficulty={selectedDifficulty}
          setViewMode={setViewMode}
          initialStartTime={initialStartTime}
          onQuizComplete={handleQuizComplete}
        />
      )}

      {viewMode === 'history' && (
        <QuizHistoryList
          isLoadingHistory={isLoadingHistory}
          pastQuizzes={pastQuizzes}
          loadQuizDetail={loadQuizDetail}
        />
      )}

      {viewMode === 'history-detail' && selectedQuiz && (
        <QuizHistoryDetail selectedQuiz={selectedQuiz} />
      )}
    </section>
  );
}
