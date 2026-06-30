const fallbackTrivia = [
  { question: "What does HTML stand for?", correct_answer: "HyperText Markup Language", incorrect_answers: ["HyperText Machine Language", "HighText Markup Language", "HyperTool Markup Language"], category: "Technology", difficulty: "easy" },
  { question: "Which language runs in a web browser?", correct_answer: "JavaScript", incorrect_answers: ["Java", "Python", "C++"], category: "Technology", difficulty: "easy" },
  { question: "What does CSS stand for?", correct_answer: "Cascading Style Sheets", incorrect_answers: ["Creative Style System", "Computer Style Sheets", "Colorful Style Sheets"], category: "Technology", difficulty: "easy" },
  { question: "Which company created React?", correct_answer: "Facebook", incorrect_answers: ["Google", "Microsoft", "Apple"], category: "Technology", difficulty: "easy" },
  { question: "What does API stand for?", correct_answer: "Application Programming Interface", incorrect_answers: ["Applied Program Interface", "Application Process Integration", "Automated Program Interface"], category: "Technology", difficulty: "medium" },
  { question: "What is the latest version of JavaScript standard called?", correct_answer: "ESNext", incorrect_answers: ["ES4", "ES2", "ES1"], category: "Technology", difficulty: "medium" },
  { question: "Which HTML tag is used to link CSS?", correct_answer: "<link>", incorrect_answers: ["<style>", "<css>", "<script>"], category: "Technology", difficulty: "easy" },
  { question: "What is the default port for HTTP?", correct_answer: "80", incorrect_answers: ["443", "3000", "8080"], category: "Technology", difficulty: "medium" },
  { question: "Which method removes last element from an array in JS?", correct_answer: "pop()", incorrect_answers: ["push()", "shift()", "splice()"], category: "Technology", difficulty: "medium" },
  { question: "What does JSON stand for?", correct_answer: "JavaScript Object Notation", incorrect_answers: ["JavaScript Oriented Notation", "Java Standard Output Notation", "JavaScript Output Name"], category: "Technology", difficulty: "easy" },
];

export async function fetchTrivia(amount = 10, difficulty = 'any') {
  try {
    let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
    if (difficulty && difficulty !== 'any') {
      url += `&difficulty=${difficulty}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('API not available');
    const data = await res.json();
    if (data.response_code !== 0 || !data.results?.length) throw new Error('No results');
    return data.results;
  } catch {
    return fallbackTrivia;
  }
}