import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  ListOrdered,
  List,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  ChevronsLeft,
  ChevronsRight,
  Quote,
  Code,
  Link as LinkIcon,
  AlignLeft,
  RemoveFormatting,
  Palette,
  Highlighter,
} from 'lucide-react';

const ToolbarButton = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
      active ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
    }`}
  >
    {children}
  </button>
);

const RichTextEditor = ({ value, onChange, placeholder = 'Write here...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
        underline: false,
      }),
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[160px] px-3 py-2 focus:outline-none',
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const setColor = useCallback(() => {
    if (!editor) return;
    const color = window.prompt('Enter text color (hex, e.g. #ef4444)', '#000000');
    if (color) editor.chain().focus().setColor(color).run();
  }, [editor]);

  const setHighlight = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run();
  }, [editor]);

  const clearFormatting = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  }, [editor]);

  const setHeading = (e) => {
    const val = e.target.value;
    if (!editor) return;
    if (val === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: Number(val) }).run();
    }
  };

  const currentBlock = () => {
    if (!editor) return 'paragraph';
    if (editor.isActive('heading', { level: 1 })) return '1';
    if (editor.isActive('heading', { level: 2 })) return '2';
    if (editor.isActive('heading', { level: 3 })) return '3';
    return 'paragraph';
  };

  if (!editor) return null;

  return (
    <div className="w-full border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <select
          value={currentBlock()}
          onChange={setHeading}
          className="text-sm border border-gray-200 rounded px-2 py-1 bg-white mr-1"
        >
          <option value="paragraph">Normal</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>

        <ToolbarButton
          title="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          title="Ordered List"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Bullet List"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          title="Subscript"
          active={editor.isActive('subscript')}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <SubscriptIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Superscript"
          active={editor.isActive('superscript')}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <SuperscriptIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          title="Outdent"
          onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        >
          <ChevronsLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Indent"
          onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        >
          <ChevronsRight className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          title="Blockquote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Code Block"
          active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton title="Text Color" onClick={setColor}>
          <Palette className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Highlight"
          active={editor.isActive('highlight')}
          onClick={setHighlight}
        >
          <Highlighter className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          title="Align Left"
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          title="Insert Link"
          active={editor.isActive('link')}
          onClick={setLink}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton title="Clear Formatting" onClick={clearFormatting}>
          <RemoveFormatting className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
};

export default RichTextEditor;