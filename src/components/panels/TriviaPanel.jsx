'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import SectionTitle from '../shared/SectionTitle';
import { fetchTrivia } from '@/lib/api/fetchTrivia';
import { getPastQuizzes, getQuizDetails } from '@/lib/api/quizApi';
import '@/styles/TriviaPanel.css';

// Subcomponents
import TriviaStatsGrid from './trivia/TriviaStatsGrid';
import TriviaPieChart from './trivia/TriviaPieChart';
import QuizConfigView from './trivia/QuizConfigView';
import ActiveQuizView from './trivia/ActiveQuizView';
import QuizHistoryList from './trivia/QuizHistoryList';
import QuizHistoryDetail from './trivia/QuizHistoryDetail';

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function TriviaPanel({ data }) {
  const [viewMode, setViewMode] = useState('config'); // 'config', 'quiz', 'history', 'history-detail'
  
  // Shared Quiz State
  const [selectedDifficulty, setSelectedDifficulty] = useState('any');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isStarting, setIsStarting] = useState(false);
  const [initialStartTime, setInitialStartTime] = useState(null);

  // Shared History State
  const [pastQuizzes, setPastQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const startQuiz = async () => {
    setIsStarting(true);
    try {
      const results = await fetchTrivia(20, selectedDifficulty);
      const formattedQuestions = results.map((q, index) => ({
        ...q,
        id: index,
        options: shuffleArray([q.correct_answer, ...q.incorrect_answers])
      }));
      setQuizQuestions(formattedQuestions);
      setInitialStartTime(Date.now());
      setViewMode('quiz');
    } catch (error) {
      console.error("Error starting quiz:", error);
    } finally {
      setIsStarting(false);
    }
  };

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    setViewMode('history');
    try {
      const res = await getPastQuizzes();
      setPastQuizzes(res?.data || []);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadQuizDetail = async (id) => {
    setIsLoadingHistory(true);
    try {
      const res = await getQuizDetails(id);
      setSelectedQuiz(res?.data || null);
      setViewMode('history-detail');
    } catch (error) {
      console.error("Failed to load quiz detail", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  if (!data) return <div className="error-card">Trivia data unavailable</div>;

  const { total, results } = data;

  return (
    <div className="trivia-panel">
      <SectionTitle>Trivia Overview</SectionTitle>
      
      <TriviaStatsGrid results={results} total={total} />

      <div className="trivia-main">
        <TriviaPieChart results={results} />

        <div className="chart-card flex-col-container">
          <div className="panel-header-row">
            <SectionTitle>
              {viewMode === 'config' && 'Take a Quiz'}
              {viewMode === 'quiz' && 'Active Quiz'}
              {viewMode === 'history' && 'Quiz History'}
              {viewMode === 'history-detail' && 'Quiz Results'}
            </SectionTitle>
            {viewMode !== 'config' && viewMode !== 'quiz' && (
              <button 
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
            <QuizHistoryDetail 
              selectedQuiz={selectedQuiz}
            />
          )}
        </div>
      </div>
    </div>
  );
}
