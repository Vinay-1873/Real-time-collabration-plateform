import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useAuth } from '../context/AuthContext';
import { documentsAPI } from '../api/documents';
import { getSocket } from '../sockets/socket';
import EditorToolbar from '../components/EditorToolbar';
import VersionHistory from '../components/VersionHistory';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [activeUsers, setActiveUsers] = useState(1);
  const [showVersions, setShowVersions] = useState(false);
  const [error, setError] = useState('');
  
  const socketRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const isRemoteChange = useRef(false);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing your document...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      if (!isRemoteChange.current) {
        handleLocalChange(editor);
      }
      isRemoteChange.current = false;
    },
  });

  // Load document on mount
  useEffect(() => {
    loadDocument();
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [id]);

  // Setup socket listeners
  useEffect(() => {
    if (!document) return;

    const socket = getSocket();
    socketRef.current = socket;

    // Join document room
    socket.emit('join-document', id);

    // Listen for changes from other users
    socket.on('receive-changes', ({ delta }) => {
      if (editor && delta) {
        isRemoteChange.current = true;
        editor.commands.setContent(delta, false);
      }
    });

    // Listen for user count updates
    socket.on('users-update', ({ count }) => {
      setActiveUsers(count);
    });

    // Listen for save success
    socket.on('save-success', ({ savedAt }) => {
      setSaveStatus('saved');
      setDocument(prev => ({ ...prev, updatedAt: savedAt }));
    });

    // Listen for errors
    socket.on('error', ({ message }) => {
      setError(message);
    });

    return () => {
      socket.off('receive-changes');
      socket.off('users-update');
      socket.off('save-success');
      socket.off('error');
    };
  }, [document, editor, id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const response = await documentsAPI.getDocument(id);
      const doc = response.data.document;
      
      setDocument(doc);
      
      if (editor && doc.content) {
        editor.commands.setContent(doc.content);
      }
    } catch (err) {
      setError('Failed to load document. You may not have access.');
      console.error(err);
      setTimeout(() => navigate('/dashboard'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleLocalChange = useCallback((editor) => {
    setSaveStatus('unsaved');
    
    const content = editor.getJSON();
    
    // Emit changes to other users
    if (socketRef.current) {
      socketRef.current.emit('send-changes', {
        docId: id,
        delta: content,
      });
    }

    // Auto-save after 5 seconds of inactivity
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSave(content);
    }, 5000);
  }, [id]);

  const handleSave = async (content) => {
    if (!content && editor) {
      content = editor.getJSON();
    }

    setSaveStatus('saving');

    try {
      // Save via socket for real-time sync
      if (socketRef.current) {
        socketRef.current.emit('save-document', {
          docId: id,
          content: content,
        });
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('error');
      setError('Failed to save document');
    }
  };

  const handleTitleChange = async (newTitle) => {
    try {
      await documentsAPI.updateDocument(id, { title: newTitle });
      setDocument(prev => ({ ...prev, title: newTitle }));
    } catch (err) {
      console.error('Title update error:', err);
    }
  };

  const handleVersionRestore = async (content) => {
    if (editor) {
      isRemoteChange.current = true;
      editor.commands.setContent(content);
      setShowVersions(false);
      handleSave(content);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary-600 hover:text-primary-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>

            <div className="flex items-center gap-4">
              {/* Active Users */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{activeUsers} active user{activeUsers !== 1 ? 's' : ''}</span>
              </div>

              {/* Save Status */}
              <div className="text-sm">
                {saveStatus === 'saving' && (
                  <span className="text-yellow-600">Saving...</span>
                )}
                {saveStatus === 'saved' && (
                  <span className="text-green-600">Saved</span>
                )}
                {saveStatus === 'unsaved' && (
                  <span className="text-gray-600">Unsaved changes</span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-red-600">Save failed</span>
                )}
              </div>

              {/* Version History Button */}
              <button
                onClick={() => setShowVersions(!showVersions)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Version History
              </button>
            </div>
          </div>

          {/* Document Title */}
          <input
            type="text"
            value={document?.title || ''}
            onChange={(e) => setDocument(prev => ({ ...prev, title: e.target.value }))}
            onBlur={(e) => handleTitleChange(e.target.value)}
            className="text-2xl font-semibold text-gray-900 bg-transparent border-none outline-none focus:ring-0 w-full"
            placeholder="Untitled Document"
          />
        </div>

        {/* Toolbar */}
        {editor && <EditorToolbar editor={editor} />}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className={`flex-1 ${showVersions ? 'mr-80' : ''} transition-all duration-300`}>
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
              <EditorContent editor={editor} className="prose max-w-none" />
            </div>
          </div>
        </div>

        {/* Version History Sidebar */}
        {showVersions && (
          <VersionHistory
            documentId={id}
            onClose={() => setShowVersions(false)}
            onRestore={handleVersionRestore}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
