import { useState, useEffect } from 'react';
import { usersAPI } from '../api/users';
import { documentsAPI } from '../api/documents';

const ShareDocument = ({ document, onUpdate, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAllUsers();
      // Filter out owner and existing collaborators
      const availableUsers = response.data.users.filter(user => {
        const isOwner = user._id === document.ownerId._id;
        const isCollaborator = document.collaborators.some(c => c._id === user._id);
        return !isOwner && !isCollaborator;
      });
      setUsers(availableUsers);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollaborator = async (userId) => {
    try {
      setAdding(true);
      setError('');
      await documentsAPI.addCollaborator(document._id, userId);
      onUpdate(); // Refresh documents list
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add collaborator');
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    try {
      setError('');
      await documentsAPI.removeCollaborator(document._id, userId);
      onUpdate(); // Refresh documents list
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove collaborator');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Share Document</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Document:</strong> {document.title}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Owner:</strong> {document.ownerId.name}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-4">
            {error}
          </div>
        )}

        {/* Current Collaborators */}
        {document.collaborators.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Collaborators:</h4>
            <div className="space-y-2">
              {document.collaborators.map((collaborator) => (
                <div key={collaborator._id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{collaborator.name}</p>
                    <p className="text-xs text-gray-500">{collaborator.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveCollaborator(collaborator._id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Collaborators */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Add Collaborator:</h4>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No more users available to add</p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2">
              {users.map((user) => (
                <div key={user._id} className="flex items-center justify-between bg-gray-50 p-2 rounded hover:bg-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleAddCollaborator(user._id)}
                    disabled={adding}
                    className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
                  >
                    {adding ? 'Adding...' : 'Add'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDocument;
