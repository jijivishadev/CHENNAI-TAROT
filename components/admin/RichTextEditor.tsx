"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontSize } from "./FontSize";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
      }),
      Underline,
      TextStyle,
      Color,
      FontSize,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[300px] p-4 focus:outline-none",
        placeholder: placeholder || "Start writing your blog post here...",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-[#4B2E83]/20 rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-2 p-2 border-b border-[#4B2E83]/15 bg-gray-50">
        {/* Font Size Dropdown */}
        <select
          onChange={(e) => {
            const size = e.target.value;
            if (size) editor.chain().focus().setFontSize(size).run();
          }}
          className="px-2 py-1 border rounded text-sm bg-white"
          value={editor.getAttributes("textStyle").fontSize || ""}
        >
          <option value="">Font Size</option>
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
          <option value="20">20px</option>
          <option value="24">24px</option>
          <option value="28">28px</option>
          <option value="32">32px</option>
          <option value="36">36px</option>
          <option value="48">48px</option>
        </select>

        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${editor.isActive("bold") ? "bg-[#4B2E83]/20 text-[#4B2E83]" : "hover:bg-gray-200"}`}
        >
          <strong>B</strong>
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${editor.isActive("italic") ? "bg-[#4B2E83]/20 text-[#4B2E83]" : "hover:bg-gray-200"}`}
        >
          <em>I</em>
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded ${editor.isActive("underline") ? "bg-[#4B2E83]/20 text-[#4B2E83]" : "hover:bg-gray-200"}`}
        >
          <u>U</u>
        </button>

        {/* RGB Color Picker */}
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="w-8 h-8 border rounded cursor-pointer p-0"
          title="Text Color"
        />
      </div>

      <EditorContent editor={editor} />

      <style jsx>{`
        .ProseMirror {
          min-height: 300px;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror p {
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}