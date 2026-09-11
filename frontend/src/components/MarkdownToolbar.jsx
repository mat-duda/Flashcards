import { useState, useRef } from 'react';
import { uploadImage } from '../api/uploadApi';

const TOOLS = [
  { label: 'B', title: 'Bold', prefix: '**', suffix: '**', placeholder: 'bold text' },
  { label: 'I', title: 'Italic', prefix: '*', suffix: '*', placeholder: 'italic text', style: { fontStyle: 'italic' } },
  { label: 'H', title: 'Heading', prefix: '## ', suffix: '', placeholder: 'heading' },
  { label: '<>', title: 'Code', prefix: '`', suffix: '`', placeholder: 'code' },
  { label: '```', title: 'Code Block', prefix: '```\n', suffix: '\n```', placeholder: 'code block', style: { fontSize: '0.65rem' } },
  { label: '🔗', title: 'Link', prefix: '[', suffix: '](url)', placeholder: 'link text' },
  { label: '•', title: 'Bullet List', prefix: '- ', suffix: '', placeholder: 'list item' },
  { label: '1.', title: 'Numbered List', prefix: '1. ', suffix: '', placeholder: 'list item' },
];

export default function MarkdownToolbar({ textareaRef, value, onChange, userId }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const insertAtCursor = (text) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + text);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const after = value.substring(end);
    onChange(before + text + after);

    requestAnimationFrame(() => {
      const pos = start + text.length;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    });
  };

  const insertMarkdown = (tool) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const text = selected || tool.placeholder;
    const inserted = `${tool.prefix}${text}${tool.suffix}`;

    const before = value.substring(0, start);
    const after = value.substring(end);
    onChange(before + inserted + after);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + tool.prefix.length,
        start + tool.prefix.length + text.length
      );
    });
  };

  const handleFileUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const result = await uploadImage(file, userId);
      const imageUrl = `http://localhost:8080${result.url}`;
      insertAtCursor(`![${file.name}](${imageUrl})\n`);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. Make sure the backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = ''; // Reset so same file can be picked again
  };

  // Call this from the parent's onPaste handler
  // Exported via the component for the parent to use
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleFileUpload(file);
        return;
      }
    }
  };

  return (
    <div className="md-toolbar-wrapper">
      <button
        type="button"
        className={`md-toolbar-toggle ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        title="Formatting"
      >
        Aa
      </button>
      <div className={`md-toolbar ${open ? 'open' : ''}`}>
        {TOOLS.map((tool) => (
          <button
            key={tool.title}
            type="button"
            className="md-toolbar-btn"
            title={tool.title}
            style={tool.style}
            onClick={() => insertMarkdown(tool)}
          >
            {tool.label}
          </button>
        ))}
        <button
          type="button"
          className="md-toolbar-btn md-toolbar-img-btn"
          title="Upload Image"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? '⏳' : '📎'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

// Export the paste handler creator so modals can use it
export function createPasteHandler(uploadFn, userId, insertFn) {
  return (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          uploadFn(file, userId).then((result) => {
            const imageUrl = `http://localhost:8080${result.url}`;
            insertFn(`![${file.name}](${imageUrl})\n`);
          }).catch((err) => {
            console.error('Paste image upload failed:', err);
          });
        }
        return;
      }
    }
  };
}
