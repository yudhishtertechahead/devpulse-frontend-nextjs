export function getTriviaStats(questions) {
  const total = questions.length;

  const results = questions.map((q, i) => {
    const allAnswers = [...q.incorrect_answers, q.correct_answer].sort();
    return {
      id: i,
      question: q.question,
      correct: q.correct_answer,
      allAnswers,
      category: q.category,
      difficulty: q.difficulty,
    };
  });

  return { total, results };
}
