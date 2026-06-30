import { api } from './authApi';

/**
 * Submits the completed quiz results to the backend.
 * @param {Object} payload 
 * @param {string} payload.difficulty
 * @param {number} payload.score
 * @param {number} payload.total_questions
 * @param {number} payload.time_taken
 * @param {Array} payload.questions
 * @returns {Promise<Object>} The saved quiz response from the server
 */
export const submitQuizResult = async (payload) => {
  const response = await api.post('/quizzes', payload);
  return response.data;
};

/**
 * Fetches the user's past quizzes overview.
 * @returns {Promise<Object>} The history of quizzes
 */
export const getPastQuizzes = async () => {
  const response = await api.get('/quizzes');
  return response.data;
};

/**
 * Fetches the detailed results of a specific quiz.
 * @param {string} id - The quiz ID
 * @returns {Promise<Object>} Detailed quiz information including questions and options
 */
export const getQuizDetails = async (id) => {
  const response = await api.get(`/quizzes/${id}`);
  return response.data;
};
