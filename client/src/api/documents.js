import axios from './axios';

export const documentsAPI = {
  createDocument: async (data) => {
    const response = await axios.post('/docs/create', data);
    return response.data;
  },

  getUserDocuments: async () => {
    const response = await axios.get('/docs/user/all');
    return response.data;
  },

  getDocument: async (id) => {
    const response = await axios.get(`/docs/${id}`);
    return response.data;
  },

  updateDocument: async (id, data) => {
    const response = await axios.put(`/docs/${id}`, data);
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await axios.delete(`/docs/${id}`);
    return response.data;
  },

  getVersions: async (id) => {
    const response = await axios.get(`/docs/${id}/versions`);
    return response.data;
  },

  restoreVersion: async (docId, versionId) => {
    const response = await axios.post(`/docs/${docId}/restore/${versionId}`);
    return response.data;
  },

  addCollaborator: async (docId, userId) => {
    const response = await axios.post(`/docs/${docId}/collaborators`, { userId });
    return response.data;
  },

  removeCollaborator: async (docId, userId) => {
    const response = await axios.delete(`/docs/${docId}/collaborators/${userId}`);
    return response.data;
  },
};
