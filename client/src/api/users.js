import axios from './axios';

export const usersAPI = {
  getAllUsers: async () => {
    const response = await axios.get('/users/all');
    return response.data;
  },
};
