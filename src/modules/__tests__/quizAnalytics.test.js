import {
  emptyQuizStats,
  buildQuizStatsFromQuizzes,
  normalizeQuizStats,
  toSummaryStats,
  toDifficultyChartData,
  toScoreTrendChartData,
  isQuizStatsEmpty,
} from '../quizAnalytics';

describe('quizAnalytics', () => {
  const sampleQuizzes = [
    {
      id: '1',
      score: 8,
      total_questions: 10,
      difficulty: 'easy',
      time_taken: 300,
      created_at: '2026-06-01T10:00:00.000Z',
    },
    {
      id: '2',
      score: 14,
      total_questions: 20,
      difficulty: 'medium',
      time_taken: 600,
      created_at: '2026-06-15T10:00:00.000Z',
    },
    {
      id: '3',
      score: 6,
      total_questions: 10,
      difficulty: 'hard',
      time_taken: 420,
      created_at: '2026-06-20T10:00:00.000Z',
    },
  ];

  test('emptyQuizStats returns zeroed structure', () => {
    const stats = emptyQuizStats();
    expect(stats.summary.totalQuizzes).toBe(0);
    expect(stats.byDifficulty).toHaveLength(4);
    expect(stats.scoreTrend).toEqual([]);
  });

  test('buildQuizStatsFromQuizzes aggregates summary and trend', () => {
    const stats = buildQuizStatsFromQuizzes(sampleQuizzes);

    expect(stats.summary.totalQuizzes).toBe(3);
    expect(stats.summary.bestScorePercent).toBe(80);
    expect(stats.summary.totalQuestionsAnswered).toBe(40);
    expect(stats.summary.averageTimeSeconds).toBe(440);
    expect(stats.scoreTrend).toHaveLength(3);
    expect(stats.scoreTrend[0].date).toBe('2026-06-01');
    expect(stats.scoreTrend[2].scorePercent).toBe(60);
  });

  test('buildQuizStatsFromQuizzes groups difficulty averages', () => {
    const stats = buildQuizStatsFromQuizzes(sampleQuizzes);
    const easy = stats.byDifficulty.find((item) => item.difficulty === 'easy');
    const medium = stats.byDifficulty.find((item) => item.difficulty === 'medium');
    const hard = stats.byDifficulty.find((item) => item.difficulty === 'hard');

    expect(easy.attempts).toBe(1);
    expect(easy.averageScorePercent).toBe(80);
    expect(medium.averageScorePercent).toBe(70);
    expect(hard.averageScorePercent).toBe(60);
  });

  test('normalizeQuizStats guards missing fields', () => {
    const stats = normalizeQuizStats({});
    expect(stats).toEqual(emptyQuizStats());
  });

  test('normalizeQuizStats maps API payload', () => {
    const stats = normalizeQuizStats({
      data: {
        summary: {
          totalQuizzes: 2,
          averageScorePercent: 75,
          bestScorePercent: 80,
          totalQuestionsAnswered: 30,
          averageTimeSeconds: 500,
          lastQuizAt: '2026-06-20T10:00:00.000Z',
        },
        byDifficulty: [
          { difficulty: 'easy', attempts: 2, averageScorePercent: 75 },
        ],
        scoreTrend: [
          {
            quizId: 'abc',
            date: '2026-06-20',
            scorePercent: 80,
            score: 16,
            totalQuestions: 20,
          },
        ],
      },
    });

    expect(stats.summary.totalQuizzes).toBe(2);
    expect(stats.scoreTrend[0].quizId).toBe('abc');
    expect(stats.byDifficulty.find((item) => item.difficulty === 'medium').attempts).toBe(0);
  });

  test('transform helpers shape chart and stat card data', () => {
    const stats = buildQuizStatsFromQuizzes(sampleQuizzes);

    expect(toSummaryStats(stats.summary)).toHaveLength(4);
    expect(toDifficultyChartData(stats.byDifficulty)).toHaveLength(3);
    expect(toScoreTrendChartData(stats.scoreTrend)[0]).toMatchObject({
      scorePercent: 80,
      label: '8/10',
    });
  });

  test('isQuizStatsEmpty detects empty analytics', () => {
    expect(isQuizStatsEmpty(emptyQuizStats())).toBe(true);
    expect(isQuizStatsEmpty(buildQuizStatsFromQuizzes(sampleQuizzes))).toBe(false);
  });
});
