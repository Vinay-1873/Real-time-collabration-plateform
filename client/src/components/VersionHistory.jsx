import { useState, useEffect } from 'react';
import { documentsAPI } from '../api/documents';

const VersionHistory = ({ documentId, onClose, onRestore }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVersions();
  }, [documentId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const response = await documentsAPI.getVersions(documentId);
      setVersions(response.data.versions);
    } catch (err) {
      setError('Failed to load versions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (version) => {
    if (!window.confirm('Are you sure you want to restore this version? Current changes will be saved as a new version.')) {
      return;
    }

    try {
      const response = await documentsAPI.restoreVersion(documentId, version._id);
      onRestore(response.data.document.content);
      loadVersions(); // Reload versions
    } catch (err) {
      setError('Failed to restore version');
      console.error(err);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Version History</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="m-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : versions.length === 0 ? (
        <div className="text-center py-8 px-4">
          <p className="text-gray-500 text-sm">No version history available</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {versions.map((version, index) => (
            <div
              key={version._id}
              className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                selectedVersion?._id === version._id ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedVersion(version)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {index === 0 ? 'Current Version' : `Version ${versions.length - index}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(version.savedAt)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Saved by {version.savedBy?.name || 'Unknown'}
                  </p>
                </div>
              </div>

              {selectedVersion?._id === version._id && index !== 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore(version);
                  }}
                  className="mt-2 w-full px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded transition"
                >
                  Restore This Version
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600">
          Versions are automatically saved every time the document is updated. 
          The last 50 versions are kept.
        </p>
      </div>
    </div>
  );
};

export default VersionHistory;
