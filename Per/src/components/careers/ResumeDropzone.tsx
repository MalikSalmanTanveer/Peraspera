import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import { validateResumeFile } from '../../lib/careers';

type Props = {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string | null;
  id?: string;
};

export function ResumeDropzone({ file, onChange, error, id = 'resume' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const applyFile = (next: File | null) => {
    if (!next) {
      setLocalError(null);
      onChange(null);
      return;
    }
    const validation = validateResumeFile(next);
    if (validation) {
      setLocalError(validation);
      onChange(null);
      return;
    }
    setLocalError(null);
    onChange(next);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0] ?? null;
    applyFile(dropped);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const displayError = error || localError;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
        Resume <span aria-hidden="true">*</span>
      </label>
      <div
        role="button"
        tabIndex={0}
        aria-describedby={displayError ? `${id}-error` : `${id}-help`}
        onKeyDown={onKeyDown}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-5 py-9 text-center transition outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
          dragging
            ? 'border-accent bg-accent/10'
            : displayError
              ? 'border-red-300 bg-red-50/60'
              : 'border-border bg-paper/80 hover:border-accent/50 hover:bg-white'
        }`}
      >
        <p className="font-display text-sm font-bold text-ink">
          {file ? file.name : 'Drop your resume here, or click to browse'}
        </p>
        <p id={`${id}-help`} className="mt-2 text-xs leading-relaxed text-muted">
          PDF or DOC/DOCX, max 10 MB
        </p>
        {file ? (
          <button
            type="button"
            className="mt-3 text-xs font-semibold text-muted underline"
            onClick={(e) => {
              e.stopPropagation();
              applyFile(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
          >
            Remove
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={(e) => applyFile(e.target.files?.[0] ?? null)}
      />
      {displayError ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-semibold text-red-600" role="alert">
          {displayError}
        </p>
      ) : null}
    </div>
  );
}
