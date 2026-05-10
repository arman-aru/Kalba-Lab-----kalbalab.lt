"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef, useState } from "react";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Code, Link2, Image as ImageIcon, Undo2, Redo2, Minus,
} from "lucide-react";

type EditorValue = { json: unknown; html: string };

export function PostEditor({
  initialJson,
  onChange,
}: {
  initialJson?: unknown;
  onChange: (v: EditorValue) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({
        placeholder: "Start writing your post… use ## for headings, ** for bold, > for quotes.",
      }),
    ],
    content: initialJson ?? { type: "doc", content: [{ type: "paragraph" }] },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "blog-prose min-h-[400px] focus:outline-none px-5 py-6",
      },
    },
    onUpdate: ({ editor }) => {
      onChange({ json: editor.getJSON(), html: editor.getHTML() });
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleImage = async (file: File) => {
    if (!editor) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const alt = window.prompt("Alt text (required for SEO & a11y)", file.name.replace(/\.[^.]+$/, "")) ?? "";
      if (alt.length < 4) {
        alert("Alt text must be at least 4 characters.");
        return;
      }
      fd.append("alt", alt);
      const res = await fetch("/api/admin/blog/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Upload failed" }));
        alert(error || "Upload failed");
        return;
      }
      const json = (await res.json()) as { url: string; width: number; height: number };
      editor.chain().focus().setImage({ src: json.url, alt }).run();
    } finally {
      setUploading(false);
    }
  };

  if (!editor) return null;

  const Btn = ({
    onClick,
    active,
    label,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={[
        "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
        active ? "bg-amber-500/15 text-amber-300" : "text-gray-400 hover:bg-white/5 hover:text-gray-200",
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-white/10 bg-black/30 sticky top-14 md:top-0 z-20">
        <Btn label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={14} />
        </Btn>
        <Btn label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={14} />
        </Btn>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <Btn label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={14} />
        </Btn>
        <Btn label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={14} />
        </Btn>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <Btn label="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={14} />
        </Btn>
        <Btn label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={14} />
        </Btn>
        <Btn label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={14} />
        </Btn>
        <Btn label="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code size={14} />
        </Btn>
        <Btn label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={14} />
        </Btn>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <Btn label="Link" active={editor.isActive("link")} onClick={setLink}>
          <Link2 size={14} />
        </Btn>
        <Btn label="Insert image" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon size={14} />
        </Btn>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <Btn label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={14} />
        </Btn>
        <Btn label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={14} />
        </Btn>
        {uploading && <span className="ml-2 text-xs text-amber-300">Uploading…</span>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleImage(f);
          e.target.value = "";
        }}
      />

      <EditorContent editor={editor} />
    </div>
  );
}
