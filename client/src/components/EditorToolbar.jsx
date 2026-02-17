const EditorToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const buttons = [
    {
      label: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      icon: 'B',
    },
    {
      label: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      icon: 'I',
    },
    {
      label: 'Strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      icon: 'S',
    },
    {
      label: 'Code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      icon: '</>',
    },
  ];

  const headings = [
    {
      label: 'H1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      label: 'H2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      label: 'H3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
  ];

  const lists = [
    {
      label: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      icon: '•',
    },
    {
      label: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      icon: '1.',
    },
  ];

  const blocks = [
    {
      label: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      icon: '"',
    },
    {
      label: 'Code Block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
      icon: '{}',
    },
  ];

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
      <div className="flex flex-wrap gap-2">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          {buttons.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                btn.isActive
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } border border-gray-300 transition`}
              title={btn.label}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          {headings.map((heading) => (
            <button
              key={heading.label}
              onClick={heading.action}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                heading.isActive
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } border border-gray-300 transition`}
              title={heading.label}
            >
              {heading.label}
            </button>
          ))}
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          {lists.map((list) => (
            <button
              key={list.label}
              onClick={list.action}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                list.isActive
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } border border-gray-300 transition`}
              title={list.label}
            >
              {list.icon}
            </button>
          ))}
        </div>

        {/* Blocks */}
        <div className="flex gap-1">
          {blocks.map((block) => (
            <button
              key={block.label}
              onClick={block.action}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                block.isActive
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } border border-gray-300 transition`}
              title={block.label}
            >
              {block.icon}
            </button>
          ))}
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="px-3 py-1.5 text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Undo"
          >
            ↶
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="px-3 py-1.5 text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Redo"
          >
            ↷
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
