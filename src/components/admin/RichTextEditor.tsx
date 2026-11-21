"use client";

import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading2, Heading3, List, ListOrdered,
  Quote, Link2, Unlink, ImagePlus, AlignLeft, AlignCenter, AlignRight, Minus, Undo2, Redo2, Pilcrow, Loader2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  /** Uploads a file and resolves to its public URL ("" on failure). */
  onUploadImage: (file: File) => Promise<string>;
  placeholder?: string;
  invalid?: boolean;
}

export default function RichTextEditor({ value, onChange, onUploadImage, placeholder, invalid }: RichTextEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Image.configure({ HTMLAttributes: { class: "article-inline-image" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder || "Start writing your story…" }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
    editorProps: { attributes: { class: "article-body article-editor focus:outline-none min-h-[320px] px-5 py-4" } },
  });

  // Sync when the parent swaps content (e.g. opening another article or restoring a draft).
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (value !== current) editor.commands.setContent(value || "", false);
  }, [value, editor]);

  const insertImageFile = async (file: File) => {
    setImageError("");
    if (!file.type.startsWith("image/")) {
      setImageError("That file isn't an image. Use JPG, PNG, WebP or GIF.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setImageError("Image is larger than 8 MB. Please compress it and try again.");
      return;
    }
    setUploading(true);
    try {
      const url = await onUploadImage(file);
      if (!url) throw new Error("Upload returned no URL");
      const alt = window.prompt("Image description (alt text, optional):", "") || "";
      editor?.chain().focus().setImage({ src: url, alt }).run();
    } catch {
      setImageError("Image upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  const insertImageUrl = () => {
    const url = window.prompt("Image URL:");
    if (!url) return;
    if (!/^(https?:\/\/|\/)/i.test(url.trim())) {
      setImageError("Image URL must start with http://, https:// or /");
      return;
    }
    setImageError("");
    editor?.chain().focus().setImage({ src: url.trim() }).run();
  };

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL:", prev || "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div className={`rounded-[8px] border bg-white overflow-hidden ${invalid ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 focus-within:border-sortd-black"}`}>
      {editor && (
        <Toolbar
          editor={editor}
          onLink={setLink}
          onImageUpload={() => fileRef.current?.click()}
          onImageUrl={insertImageUrl}
          uploading={uploading}
        />
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) insertImageFile(f);
          e.target.value = "";
        }}
      />
      {imageError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-[11px] font-semibold text-red-700">{imageError}</div>
      )}
      <div
        className="max-h-[55vh] overflow-y-auto"
        onDrop={(e) => {
          const f = e.dataTransfer.files?.[0];
          if (f && f.type.startsWith("image/")) {
            e.preventDefault();
            insertImageFile(f);
          }
        }}
        onPaste={(e) => {
          const f = Array.from(e.clipboardData.files || []).find((x) => x.type.startsWith("image/"));
          if (f) {
            e.preventDefault();
            insertImageFile(f);
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({ editor, onLink, onImageUpload, onImageUrl, uploading }: {
  editor: Editor; onLink: () => void; onImageUpload: () => void; onImageUrl: () => void; uploading: boolean;
}) {
  const [, force] = useState(0);
  useEffect(() => {
    const rerender = () => force((n) => n + 1);
    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);
    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
    };
  }, [editor]);

  const c = () => editor.chain().focus();
  const Btn = ({ on, active, title, children, disabled }: { on: () => void; active?: boolean; title: string; children: React.ReactNode; disabled?: boolean }) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
      className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors disabled:opacity-30 ${active ? "bg-sortd-black text-white" : "text-sortd-black hover:bg-gray-200"}`}
    >
      {children}
    </button>
  );
  const Sep = () => <span className="w-px h-5 bg-gray-300 mx-1" />;
  const i = "w-4 h-4";

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
      <Btn title="Paragraph" on={() => c().setParagraph().run()} active={editor.isActive("paragraph")}><Pilcrow className={i} /></Btn>
      <Btn title="Heading 2" on={() => c().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 className={i} /></Btn>
      <Btn title="Heading 3" on={() => c().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3 className={i} /></Btn>
      <Sep />
      <Btn title="Bold (Ctrl+B)" on={() => c().toggleBold().run()} active={editor.isActive("bold")}><Bold className={i} /></Btn>
      <Btn title="Italic (Ctrl+I)" on={() => c().toggleItalic().run()} active={editor.isActive("italic")}><Italic className={i} /></Btn>
      <Btn title="Underline (Ctrl+U)" on={() => c().toggleUnderline().run()} active={editor.isActive("underline")}><UnderlineIcon className={i} /></Btn>
      <Btn title="Strikethrough" on={() => c().toggleStrike().run()} active={editor.isActive("strike")}><Strikethrough className={i} /></Btn>
      <Sep />
      <Btn title="Bulleted list" on={() => c().toggleBulletList().run()} active={editor.isActive("bulletList")}><List className={i} /></Btn>
      <Btn title="Numbered list" on={() => c().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered className={i} /></Btn>
      <Btn title="Quote" on={() => c().toggleBlockquote().run()} active={editor.isActive("blockquote")}><Quote className={i} /></Btn>
      <Btn title="Divider" on={() => c().setHorizontalRule().run()}><Minus className={i} /></Btn>
      <Sep />
      <Btn title="Align left" on={() => c().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })}><AlignLeft className={i} /></Btn>
      <Btn title="Align center" on={() => c().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}><AlignCenter className={i} /></Btn>
      <Btn title="Align right" on={() => c().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })}><AlignRight className={i} /></Btn>
      <Sep />
      <Btn title="Add / edit link" on={onLink} active={editor.isActive("link")}><Link2 className={i} /></Btn>
      <Btn title="Remove link" on={() => c().unsetLink().run()} disabled={!editor.isActive("link")}><Unlink className={i} /></Btn>
      <Btn title="Upload image" on={onImageUpload} disabled={uploading}>{uploading ? <Loader2 className={`${i} animate-spin`} /> : <ImagePlus className={i} />}</Btn>
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onImageUrl} className="h-8 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider text-sortd-black hover:bg-gray-200">Image URL</button>
      <Sep />
      <Btn title="Undo (Ctrl+Z)" on={() => c().undo().run()} disabled={!editor.can().undo()}><Undo2 className={i} /></Btn>
      <Btn title="Redo (Ctrl+Shift+Z)" on={() => c().redo().run()} disabled={!editor.can().redo()}><Redo2 className={i} /></Btn>
    </div>
  );
}
