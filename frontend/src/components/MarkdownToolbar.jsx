import { useState } from 'react';

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

export default function MarkdownToolbar({ textareaRef, value, onChange }) {
  const [open, setOpen] = useState(false);

  const insertMarkdown = (tool) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const text = selected || tool.placeholder;

    const before = value.substring(0, start);
    const after = value.substring(end);
    const inserted = `${tool.prefix}${text}${tool.suffix}`;

    onChange(before + inserted + after);

    // Set cursor position after React re-renders
    requestAnimationFrame(() => {
      const cursorPos = selected
        ? start + inserted.length
        : start + tool.prefix.length + text.length;
      textarea.focus();
      textarea.setSelectionRange(
        start + tool.prefix.length,
        start + tool.prefix.length + text.length
      );
    });
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
      </div>
    </div>
  );
}
