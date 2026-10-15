import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { uploadImage } from '../api/uploadApi';

const MenuBar = ({ editor, userId }) => {
  if (!editor) return null;

  const addImage = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await uploadImage(file, userId);
        const imageUrl = `http://localhost:8080${result.url}`;
        editor.chain().focus().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error('Image upload failed', error);
      }
    }
  };

  return (
    <div className="tiptap-toolbar">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>B</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>I</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading') ? 'active' : ''}>H</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''}>• List</button>
      <label className="tiptap-toolbar-btn">
        📎 Image
        <input type="file" accept="image/*" onChange={addImage} style={{ display: 'none' }} />
      </label>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, userId }) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              uploadImage(file, userId).then(result => {
                const imageUrl = `http://localhost:8080${result.url}`;
                const node = view.state.schema.nodes.image.create({ src: imageUrl });
                const tr = view.state.tr.replaceSelectionWith(node);
                view.dispatch(tr);
              }).catch(err => console.error("Paste upload failed:", err));
            }
            return true;
          }
        }
        return false;
      }
    }
  });

  return (
    <div className="tiptap-wrapper">
      <MenuBar editor={editor} userId={userId} />
      <EditorContent editor={editor} className="tiptap-editor-content" />
    </div>
  );
}
