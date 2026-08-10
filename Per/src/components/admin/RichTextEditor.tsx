import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect, useRef, useState } from 'react';
import { ResizableBlogImageView } from './ResizableBlogImageView';
import {
  buildBlogImageClass,
  clampWidthPct,
  parseBlogImageFloat,
  type BlogImageFloat,
} from '../../lib/blogImage';
import { purifyBulletHtml, purifyParagraphHtml } from '../../lib/sanitizeHtml';

type Mode = 'paragraph' | 'bullet';

type Props = {
  mode: Mode;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  onUploadImage?: (file: File) => Promise<string>;
};

const BlogImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: buildBlogImageClass('center'),
        parseHTML: (element) =>
          buildBlogImageClass(parseBlogImageFloat(element.getAttribute('class'))),
        renderHTML: (attributes) => ({
          class: attributes.class || buildBlogImageClass('center'),
        }),
      },
      widthPct: {
        default: 60,
        parseHTML: (element) => {
          const style = element.getAttribute('style') ?? '';
          const match = style.match(/width:\s*(\d{1,3})\s*%/i);
          if (match) return clampWidthPct(Number(match[1]));
          const className = element.getAttribute('class') ?? '';
          if (className.includes('blog-img--w25')) return 25;
          if (className.includes('blog-img--w40')) return 40;
          if (className.includes('blog-img--w60')) return 60;
          if (className.includes('blog-img--w100')) return 100;
          return 60;
        },
        renderHTML: (attributes) => ({
          style: `width: ${clampWidthPct(Number(attributes.widthPct ?? 60))}%`,
        }),
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute('title'),
        renderHTML: (attributes) =>
          attributes.title ? { title: attributes.title } : {},
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableBlogImageView);
  },
});

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs font-semibold transition disabled:opacity-50 ${
        active ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-paper'
      }`}
    >
      {label}
    </button>
  );
}

export function RichTextEditor({
  mode,
  value,
  onChange,
  placeholder,
  className = '',
  onUploadImage,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [, setTick] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure(
        mode === 'paragraph'
          ? {
              heading: { levels: [2, 3, 4] },
              code: false,
              codeBlock: false,
              horizontalRule: false,
            }
          : {
              heading: false,
              blockquote: false,
              bulletList: false,
              orderedList: false,
              code: false,
              codeBlock: false,
              horizontalRule: false,
            },
      ),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      ...(mode === 'paragraph'
        ? [
            BlogImage.configure({
              allowBase64: false,
              inline: false,
            }),
          ]
        : []),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          mode === 'paragraph'
            ? 'min-h-[120px] px-3 py-2 text-sm leading-relaxed text-ink outline-none prose prose-sm max-w-none'
            : 'min-h-[36px] px-3 py-2 text-sm leading-relaxed text-ink outline-none',
        'data-placeholder': placeholder ?? '',
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(mode === 'paragraph' ? purifyParagraphHtml(html) : purifyBulletHtml(html));
    },
    onSelectionUpdate: () => setTick((n) => n + 1),
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || '';
    if (current === next) return;
    editor.commands.setContent(next, { emitUpdate: false });
  }, [value, editor]);

  if (!editor) return null;

  const imageSelected = mode === 'paragraph' && editor.isActive('image');
  const imageFloat = imageSelected
    ? parseBlogImageFloat(String(editor.getAttributes('image').class ?? ''))
    : 'center';
  const imageWidth = imageSelected
    ? clampWidthPct(Number(editor.getAttributes('image').widthPct ?? 60))
    : 60;
  const imageAlt = imageSelected
    ? String(editor.getAttributes('image').alt ?? '')
    : '';

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', prev ?? 'https://');
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const setImageFloat = (float: BlogImageFloat) => {
    editor
      .chain()
      .focus()
      .updateAttributes('image', { class: buildBlogImageClass(float) })
      .run();
  };

  const setImageWidth = (pct: number) => {
    editor
      .chain()
      .focus()
      .updateAttributes('image', { widthPct: clampWidthPct(pct) })
      .run();
  };

  const setImageCaption = () => {
    if (!imageSelected) return;
    const next = window.prompt(
      'Caption / alt text (shows when hovering; also helps accessibility)',
      imageAlt,
    );
    if (next === null) return;
    editor
      .chain()
      .focus()
      .updateAttributes('image', { alt: next.trim(), title: next.trim() || null })
      .run();
  };

  const onPickImage = () => {
    if (!onUploadImage || uploadingImage) return;
    fileInputRef.current?.click();
  };

  const onImageFile = async (file: File | undefined) => {
    if (!file || !onUploadImage) return;
    setUploadingImage(true);
    try {
      const url = await onUploadImage(file);
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: {
            src: url,
            alt: '',
            class: buildBlogImageClass('center'),
            widthPct: 60,
          },
        })
        .run();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-white ${className}`}>
      <div className="flex flex-wrap gap-1 border-b border-border bg-paper/80 px-2 py-1.5">
        <ToolbarButton
          label="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton label="Link" active={editor.isActive('link')} onClick={setLink} />
        {mode === 'paragraph' ? (
          <>
            <ToolbarButton
              label="H2"
              active={editor.isActive('heading', { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            />
            <ToolbarButton
              label="H3"
              active={editor.isActive('heading', { level: 3 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            />
            <ToolbarButton
              label="Quote"
              active={editor.isActive('blockquote')}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            />
            <ToolbarButton
              label="List"
              active={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            {onUploadImage ? (
              <ToolbarButton
                label={uploadingImage ? 'Uploading…' : 'Image'}
                disabled={uploadingImage}
                onClick={onPickImage}
              />
            ) : null}
          </>
        ) : null}
      </div>

      {imageSelected ? (
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-[#fafafa] px-2 py-1.5">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-wide text-[#8a8a8a]">
            Image
          </span>
          <ToolbarButton
            label="Text right"
            active={imageFloat === 'left'}
            onClick={() => setImageFloat('left')}
          />
          <ToolbarButton
            label="Text left"
            active={imageFloat === 'right'}
            onClick={() => setImageFloat('right')}
          />
          <ToolbarButton
            label="Center"
            active={imageFloat === 'center'}
            onClick={() => setImageFloat('center')}
          />
          <span className="mx-1 h-4 w-px bg-[#ddd]" aria-hidden />
          {[25, 40, 60, 100].map((w) => (
            <ToolbarButton
              key={w}
              label={w === 100 ? 'Full' : `${w}%`}
              active={imageWidth === w}
              onClick={() => setImageWidth(w)}
            />
          ))}
          <span className="mx-1 text-[10px] text-[#8a8a8a]">or drag corners</span>
          <span className="mx-1 h-4 w-px bg-[#ddd]" aria-hidden />
          <ToolbarButton label="Caption" onClick={setImageCaption} />
        </div>
      ) : null}

      <EditorContent editor={editor} />
      {mode === 'paragraph' && onUploadImage ? (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => void onImageFile(e.target.files?.[0])}
        />
      ) : null}
    </div>
  );
}
