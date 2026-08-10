import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Toast, type ToastState } from '../../components/admin/Toast';
import {
  deleteAdminBlogPost,
  fetchAdminBlogPost,
  publishAdminBlogPost,
  unpublishAdminBlogPost,
  uploadAdminBlogImage,
  upsertAdminBlogPost,
} from '../../lib/adminApi';
import { suggestBlogSlug, type BlogPost } from '../../lib/blog';

export function AdminBlogEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [postId, setPostId] = useState<string | null>(isNew ? null : id);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isNew || !id) return;
    void (async () => {
      setLoading(true);
      const result = await fetchAdminBlogPost(id);
      setLoading(false);
      if (result.error || !result.data) {
        setError(result.error ?? 'Post not found');
        return;
      }
      applyPost(result.data);
    })();
  }, [id, isNew]);

  const applyPost = (post: BlogPost) => {
    setPostId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setSlugTouched(true);
    setExcerpt(post.excerpt);
    setBodyHtml(post.body_html);
    setCoverImageUrl(post.cover_image_url);
    setStatus(post.status);
  };

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(suggestBlogSlug(value));
  };

  const uploadImage = async (file: File, kind: 'cover' | 'inline') => {
    const result = await uploadAdminBlogImage(file, kind);
    if (result.error || !result.data?.url) {
      throw new Error(result.error ?? 'Upload failed');
    }
    return result.data.url;
  };

  const onCoverFile = async (file: File | undefined) => {
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadImage(file, 'cover');
      setCoverImageUrl(url);
      setToast({ message: 'Cover uploaded', tone: 'success' });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'Cover upload failed',
        tone: 'error',
      });
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const saveDraft = async () => {
    setSaving(true);
    setError(null);
    const result = await upsertAdminBlogPost({
      id: postId ?? undefined,
      title,
      slug,
      body_html: bodyHtml,
      excerpt,
      cover_image_url: coverImageUrl,
    });
    setSaving(false);
    if (result.error || !result.data) {
      setError(result.error ?? 'Save failed');
      setToast({ message: result.error ?? 'Save failed', tone: 'error' });
      return null;
    }
    applyPost(result.data);
    setToast({ message: 'Draft saved', tone: 'success' });
    if (isNew) navigate(`/admin/blog/${result.data.id}`, { replace: true });
    return result.data;
  };

  const onPublish = async () => {
    const saved = await saveDraft();
    if (!saved) return;
    const result = await publishAdminBlogPost(saved.id);
    if (result.error || !result.data) {
      setToast({ message: result.error ?? 'Publish failed', tone: 'error' });
      return;
    }
    applyPost(result.data);
    setToast({ message: 'Published', tone: 'success' });
  };

  const onHide = async () => {
    if (!postId) return;
    const result = await unpublishAdminBlogPost(postId);
    if (result.error || !result.data) {
      setToast({ message: result.error ?? 'Hide failed', tone: 'error' });
      return;
    }
    applyPost(result.data);
    setToast({ message: 'Hidden from public blog', tone: 'success' });
  };

  const onDelete = async () => {
    if (!postId) return;
    const result = await deleteAdminBlogPost(postId);
    setConfirmDelete(false);
    if (result.error) {
      setToast({ message: result.error, tone: 'error' });
      return;
    }
    navigate('/admin/blog', { replace: true });
  };

  if (loading) {
    return <p className="text-sm text-muted-alt">Loading post…</p>;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/admin/blog"
          className="text-sm font-semibold text-muted-alt underline-offset-2 hover:text-ink hover:underline"
        >
          ← Back to posts
        </Link>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => void saveDraft()}
            className="rounded-xl border border-[#e0e0e0] bg-white px-4 py-2.5 text-sm font-bold text-ink hover:bg-[#f7f7f7] disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          {status === 'published' ? (
            <button
              type="button"
              onClick={() => void onHide()}
              className="rounded-xl border border-[#e0e0e0] bg-white px-4 py-2.5 text-sm font-bold text-ink hover:bg-[#f7f7f7]"
            >
              Hide
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void onPublish()}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-ink hover:brightness-95"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5">
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Post title"
            className="w-full border-0 border-b border-[#e8e8e8] bg-transparent pb-3 font-display text-2xl font-bold text-ink outline-none placeholder:text-[#bbb] focus:border-accent"
          />
          <div className="mt-4">
            <RichTextEditor
              mode="paragraph"
              value={bodyHtml}
              onChange={setBodyHtml}
              placeholder="Write your article…"
              className="min-h-[360px]"
              onUploadImage={(file) => uploadImage(file, 'inline')}
            />
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-[#e8e8e8] bg-white p-5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#8a8a8a]">Status</p>
          <p className="mt-2 text-sm font-semibold text-ink">
            {status === 'published' ? 'Published' : 'Draft'}
          </p>

          <div className="mt-5">
            <p className="text-[13px] font-semibold text-ink">Cover image</p>
            {coverImageUrl ? (
              <img
                src={coverImageUrl}
                alt=""
                className="mt-2 aspect-[16/10] w-full rounded-xl border border-[#e8e8e8] object-cover"
              />
            ) : (
              <div className="mt-2 flex aspect-[16/10] items-center justify-center rounded-xl border border-dashed border-[#d8d8d8] bg-[#fafafa] text-xs text-[#8a8a8a]">
                No cover yet
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={uploadingCover}
                onClick={() => coverInputRef.current?.click()}
                className="rounded-lg border border-[#e0e0e0] bg-white px-3 py-2 text-xs font-bold text-ink hover:bg-[#f7f7f7] disabled:opacity-60"
              >
                {uploadingCover ? 'Uploading…' : coverImageUrl ? 'Replace' : 'Upload'}
              </button>
              {coverImageUrl ? (
                <button
                  type="button"
                  onClick={() => setCoverImageUrl(null)}
                  className="rounded-lg border border-[#e0e0e0] bg-white px-3 py-2 text-xs font-bold text-ink hover:bg-[#f7f7f7]"
                >
                  Clear
                </button>
              ) : null}
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => void onCoverFile(e.target.files?.[0])}
            />
          </div>

          <label className="mt-5 block text-[13px] font-semibold text-ink">
            Slug
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="mt-2 w-full rounded-xl border border-[#e0e0e0] px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>

          <label className="mt-4 block text-[13px] font-semibold text-ink">
            Excerpt
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-xl border border-[#e0e0e0] px-3 py-2.5 text-sm outline-none focus:border-accent"
              placeholder="Short summary for the blog list"
            />
          </label>

          {status === 'published' ? (
            <a
              href={`/blog/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-sm font-semibold text-ink underline-offset-2 hover:underline"
            >
              View public post ↗
            </a>
          ) : null}

          {postId ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="mt-6 w-full rounded-xl border border-red-200 px-3 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50"
            >
              Delete permanently
            </button>
          ) : null}
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this post permanently?"
        body="This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => void onDelete()}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
