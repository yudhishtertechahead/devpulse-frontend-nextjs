import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const submitContact = async (data) => {
  const response = await axios.post(`${BASE_URL}/contact`, data);
  return response.data;
};
