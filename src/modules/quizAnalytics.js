/**
 * @typedef {Object} QuizSummary
 * @property {number} totalQuizzes
 * @property {number} averageScorePercent
 * @property {number} bestScorePercent
 * @property {number} totalQuestionsAnswered
 * @property {number} averageTimeSeconds
 * @property {string|null} lastQuizAt
 */

/**
 * @typedef {Object} DifficultyStat
 * @property {string} difficulty
 * @property {number} attempts
 * @property {number} averageScorePercent
 */

/**
 * @typedef {Object} ScoreTrendPoint
 * @property {string} quizId
 * @property {string} date
 * @property {number} scorePercent
 * @property {number} score
 * @property {number} totalQuestions
 */

/**
 * @typedef {Object} QuizStats
 * @property {QuizSummary} summary
 * @property {DifficultyStat[]} byDifficulty
 * @property {ScoreTrendPoint[]} scoreTrend
 */

const DIFFICULTIES = ['easy', 'medium', 'hard', 'any'];

function round1(value) {
  return Math.round(value * 10) / 10;
}

function scorePercent(score, totalQuestions) {
  if (!totalQuestions) return 0;
  return round1((score / totalQuestions) * 100);
}

function formatTrendDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

export function emptyQuizStats() {
  return {
    summary: {
      totalQuizzes: 0,
      averageScorePercent: 0,
      bestScorePercent: 0,
      totalQuestionsAnswered: 0,
      averageTimeSeconds: 0,
      lastQuizAt: null,
    },
    byDifficulty: DIFFICULTIES.map((difficulty) => ({
      difficulty,
      attempts: 0,
      averageScorePercent: 0,
    })),
    scoreTrend: [],
  };
}

/**
 * Mirrors backend GET /quizzes/stats aggregation for client-side fallback.
 * @param {Array<{ id: string, score: number, total_questions: number, difficulty: string, time_taken: number, created_at: string }>} quizzes
 * @returns {QuizStats}
 */
export function buildQuizStatsFromQuizzes(quizzes) {
  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    return emptyQuizStats();
  }

  const sortedByDate = [...quizzes].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const percents = sortedByDate.map((quiz) =>
    scorePercent(quiz.score, quiz.total_questions)
  );

  const summary = {
    totalQuizzes: sortedByDate.length,
    averageScorePercent: round1(
      percents.reduce((sum, value) => sum + value, 0) / sortedByDate.length
    ),
    bestScorePercent: round1(Math.max(...percents)),
    totalQuestionsAnswered: sortedByDate.reduce(
      (sum, quiz) => sum + quiz.total_questions,
      0
    ),
    averageTimeSeconds: Math.round(
      sortedByDate.reduce((sum, quiz) => sum + quiz.time_taken, 0) /
        sortedByDate.length
    ),
    lastQuizAt: sortedByDate[sortedByDate.length - 1]?.created_at ?? null,
  };

  const byDifficulty = DIFFICULTIES.map((difficulty) => {
    const attempts = sortedByDate.filter(
      (quiz) => quiz.difficulty === difficulty
    );

    if (attempts.length === 0) {
      return { difficulty, attempts: 0, averageScorePercent: 0 };
    }

    const average = round1(
      attempts.reduce(
        (sum, quiz) => sum + scorePercent(quiz.score, quiz.total_questions),
        0
      ) / attempts.length
    );

    return {
      difficulty,
      attempts: attempts.length,
      averageScorePercent: average,
    };
  });

  const scoreTrend = sortedByDate.slice(-20).map((quiz) => ({
    quizId: quiz.id,
    date: formatTrendDate(quiz.created_at),
    scorePercent: scorePercent(quiz.score, quiz.total_questions),
    score: quiz.score,
    totalQuestions: quiz.total_questions,
  }));

  return { summary, byDifficulty, scoreTrend };
}

/**
 * @param {unknown} apiResponse
 * @returns {QuizStats}
 */
export function normalizeQuizStats(apiResponse) {
  const data = apiResponse?.data ?? apiResponse;

  if (!data || typeof data !== 'object') {
    return emptyQuizStats();
  }

  const summary = data.summary ?? {};
  const byDifficulty = Array.isArray(data.byDifficulty) ? data.byDifficulty : [];
  const scoreTrend = Array.isArray(data.scoreTrend) ? data.scoreTrend : [];

  return {
    summary: {
      totalQuizzes: Number(summary.totalQuizzes) || 0,
      averageScorePercent: Number(summary.averageScorePercent) || 0,
      bestScorePercent: Number(summary.bestScorePercent) || 0,
      totalQuestionsAnswered: Number(summary.totalQuestionsAnswered) || 0,
      averageTimeSeconds: Number(summary.averageTimeSeconds) || 0,
      lastQuizAt: summary.lastQuizAt ?? null,
    },
    byDifficulty: DIFFICULTIES.map((difficulty) => {
      const match = byDifficulty.find((item) => item.difficulty === difficulty);
      return {
        difficulty,
        attempts: Number(match?.attempts) || 0,
        averageScorePercent: Number(match?.averageScorePercent) || 0,
      };
    }),
    scoreTrend: scoreTrend.map((point) => ({
      quizId: point.quizId ?? '',
      date: point.date ?? '',
      scorePercent: Number(point.scorePercent) || 0,
      score: Number(point.score) || 0,
      totalQuestions: Number(point.totalQuestions) || 0,
    })),
  };
}

/**
 * @param {QuizSummary} summary
 * @returns {Array<{ label: string, value: string|number, sub?: string, color: string }>}
 */
export function toSummaryStats(summary = {}) {
  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return remainder ? `${minutes}m ${remainder}s` : `${minutes}m`;
  };

  return [
    {
      label: 'Quizzes Taken',
      value: summary.totalQuizzes,
      sub: summary.lastQuizAt
        ? `Last: ${new Date(summary.lastQuizAt).toLocaleDateString()}`
        : undefined,
      color: '#8b5cf6',
    },
    {
      label: 'Average Score',
      value: `${summary.averageScorePercent}%`,
      sub: `${summary.totalQuestionsAnswered} questions answered`,
      color: '#10b981',
    },
    {
      label: 'Best Score',
      value: `${summary.bestScorePercent}%`,
      color: '#f59e0b',
    },
    {
      label: 'Avg Time',
      value: formatTime(summary.averageTimeSeconds),
      sub: 'per quiz',
      color: '#0ea5e9',
    },
  ];
}

/**
 * @param {DifficultyStat[]} byDifficulty
 * @returns {Array<{ name: string, attempts: number, averageScorePercent: number }>}
 */
export function toDifficultyChartData(byDifficulty) {
  return byDifficulty
    .filter((item) => item.difficulty !== 'any')
    .map((item) => ({
      name: item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1),
      attempts: item.attempts,
      averageScorePercent: item.averageScorePercent,
    }));
}

/**
 * @param {ScoreTrendPoint[]} scoreTrend
 * @returns {Array<{ date: string, scorePercent: number, label: string }>}
 */
export function toScoreTrendChartData(scoreTrend) {
  return scoreTrend.map((point, index) => ({
    date: point.date || `Quiz ${index + 1}`,
    scorePercent: point.scorePercent,
    label: `${point.score}/${point.totalQuestions}`,
  }));
}

export function isQuizStatsEmpty(stats) {
  return !stats || stats.summary.totalQuizzes === 0;
}
