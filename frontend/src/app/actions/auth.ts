import axios from 'axios';

export const login = async (formData: unknown) => {
  return axios.post('http://localhost:3020/api/v1/auth/login', formData)
}