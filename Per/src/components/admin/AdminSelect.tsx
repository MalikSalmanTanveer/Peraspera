import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';

export type AdminSelectOption = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  options: AdminSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  /** box = admin bordered control; underline = public apply form fields */
  variant?: 'box' | 'underline';
  id?: string;
  'aria-label'?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

type MenuPos = { top: number; left: number; width: number };

export function AdminSelect({
  value,
  options,
  onChange,
  placeholder = 'Select…',
  className = '',
  disabled = false,
  variant = 'box',
  id,
  'aria-label': ariaLabel,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPos | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const display = selected?.label ?? placeholder;
  const underline = variant === 'underline';

  const updatePos = () => {
    const el = buttonRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const menuH = Math.min(240, options.length * 44 + 8);
    const spaceBelow = window.innerHeight - r.bottom - 8;
    const openUp = spaceBelow < menuH && r.top > spaceBelow;
    setPos({
      top: openUp ? r.top - menuH - 6 : r.bottom + 6,
      left: r.left,
      width: Math.max(r.width, underline ? r.width : 160),
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePos();
  }, [open, options.length]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onReposition = () => updatePos();
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [open, options.length]);

  const triggerClass = underline
    ? `flex w-full items-center justify-between gap-2 border-0 border-b-[1.5px] bg-transparent py-2.5 pr-1 text-left font-body text-md outline-none transition ${
        open || ariaInvalid ? 'border-ink' : 'border-[#d8d8d8] hover:border-[#b0b0b0]'
      } ${disabled ? 'cursor-not-allowed text-[#9a9a9a]' : 'text-ink'}`
    : `flex w-full min-w-[10rem] items-center justify-between gap-2 rounded-xl border bg-white py-2.5 pl-3.5 pr-3 text-left text-sm font-medium outline-none transition ${
        open
          ? 'border-accent ring-2 ring-accent/25'
          : ariaInvalid
            ? 'border-red-400'
            : 'border-[#e0e0e0] hover:border-[#c8c8c8]'
      } ${disabled ? 'cursor-not-allowed bg-[#f5f5f5] text-[#9a9a9a]' : 'text-ink'}`;

  const menu =
    open && pos
      ? createPortal(
          <ul
            ref={menuRef}
            id={listId}
            role="listbox"
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }}
            className="z-[200] max-h-60 overflow-auto rounded-xl border border-[#e8e8e8] bg-white py-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.14)]"
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <li key={opt.value || '__empty'} role="option" aria-selected={active}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition ${
                      active
                        ? 'bg-accent/20 font-semibold text-ink'
                        : 'text-ink hover:bg-[#f5f5f5]'
                    }`}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    <span className="truncate">{opt.label}</span>
                    {active ? (
                      <Check className="h-4 w-4 shrink-0 text-ink" strokeWidth={2.5} aria-hidden />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        onClick={() => setOpen((v) => !v)}
        className={triggerClass}
      >
        <span className={`truncate ${selected ? 'text-ink' : 'text-[#8a8a8a]'}`}>{display}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#6b6b6b] transition ${open ? 'rotate-180 text-ink' : ''}`}
          strokeWidth={2}
          aria-hidden
        />
      </button>
      {menu}
    </div>
  );
}
