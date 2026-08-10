import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { clampWidthPct, parseBlogImageFloat } from '../../lib/blogImage';

type Corner = 'se' | 'sw' | 'ne' | 'nw';

export function ResizableBlogImageView({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [widthPct, setWidthPct] = useState(() =>
    clampWidthPct(Number(node.attrs.widthPct ?? 60)),
  );
  const dragRef = useRef<{
    corner: Corner;
    startX: number;
    startPct: number;
    containerW: number;
  } | null>(null);

  useEffect(() => {
    setWidthPct(clampWidthPct(Number(node.attrs.widthPct ?? 60)));
  }, [node.attrs.widthPct]);

  const float = parseBlogImageFloat(String(node.attrs.class ?? ''));

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const deltaX = event.clientX - drag.startX;
      const sign = drag.corner === 'se' || drag.corner === 'ne' ? 1 : -1;
      const deltaPct = (deltaX / drag.containerW) * 100 * sign;
      const next = clampWidthPct(drag.startPct + deltaPct);
      setWidthPct(next);
      updateAttributes({ widthPct: next });
    },
    [updateAttributes],
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', endDrag);
    window.removeEventListener('pointercancel', endDrag);
  }, [onPointerMove]);

  const startDrag = (corner: Corner) => (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const editorRoot = wrap.closest('.ProseMirror') as HTMLElement | null;
    const containerW =
      editorRoot?.clientWidth || wrap.parentElement?.clientWidth || 600;
    dragRef.current = {
      corner,
      startX: event.clientX,
      startPct: widthPct,
      containerW,
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
  };

  useEffect(() => () => endDrag(), [endDrag]);

  return (
    <NodeViewWrapper
      as="div"
      className={`blog-img-resize ${node.attrs.class ?? 'blog-img blog-img--center'} ${
        selected ? 'is-selected' : ''
      }`}
      style={{ width: `${widthPct}%` }}
    >
      <div ref={wrapRef} className="blog-img-resize__frame">
        <img
          src={node.attrs.src}
          alt={node.attrs.alt ?? ''}
          title={node.attrs.title ?? undefined}
          className="blog-img-resize__img"
          draggable={false}
        />
        {selected ? (
          <>
            <span
              className="blog-img-resize__handle blog-img-resize__handle--nw"
              onPointerDown={startDrag('nw')}
            />
            <span
              className="blog-img-resize__handle blog-img-resize__handle--ne"
              onPointerDown={startDrag('ne')}
            />
            <span
              className="blog-img-resize__handle blog-img-resize__handle--sw"
              onPointerDown={startDrag('sw')}
            />
            <span
              className="blog-img-resize__handle blog-img-resize__handle--se"
              onPointerDown={startDrag('se')}
            />
            <span className="blog-img-resize__badge" aria-hidden>
              {widthPct}%
            </span>
          </>
        ) : null}
      </div>
      <span className="sr-only">
        Image {float}, width {widthPct} percent. Drag a corner to resize.
      </span>
    </NodeViewWrapper>
  );
}
