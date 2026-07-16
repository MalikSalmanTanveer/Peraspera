import { useState } from 'react';
import { Marquee } from './Marquee';
import type { StackTool } from '../data/tools-stack';

function iconColorForBadge(hex?: string): string {
  if (!hex) return 'FFFFFF';
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 90 ? 'FFFFFF' : hex;
}

function toolIconSources(tool: StackTool): string[] {
  const sources: string[] = [];
  if (tool.slug) {
    const color = iconColorForBadge(tool.color);
    sources.push(`https://cdn.simpleicons.org/${tool.slug}/${color}`);
  }
  if (tool.devicon) {
    sources.push(
      `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tool.devicon}.svg`,
    );
  }
  return sources;
}

function toolInitials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function ToolBadge({ tool }: { tool: StackTool }) {
  const glow = tool.color ? `#${tool.color}` : '#fea327';
  const sources = toolIconSources(tool);
  const [sourceIndex, setSourceIndex] = useState(0);
  const iconUrl = sources[sourceIndex];
  const showIcon = Boolean(iconUrl);

  const handleIconError = () => {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex((current) => current + 1);
    } else {
      setSourceIndex(sources.length);
    }
  };

  return (
    <div
      className="group/badge relative flex h-[88px] w-[88px] shrink-0 items-center justify-center md:h-[96px] md:w-[96px]"
      title={tool.name}
      aria-label={tool.name}
    >
      <div
        className="pointer-events-none absolute inset-[18%] rounded-full opacity-50 blur-2xl transition-opacity duration-normal group-hover/badge:opacity-80"
        style={{ background: glow }}
        aria-hidden="true"
      />
      {showIcon && sourceIndex < sources.length ? (
        <img
          src={iconUrl}
          alt=""
          className="relative h-12 w-12 object-contain transition-transform duration-normal group-hover/badge:scale-110 md:h-[52px] md:w-[52px]"
          style={{
            filter: `drop-shadow(0 0 10px ${glow}) drop-shadow(0 0 22px ${glow}aa)`,
          }}
          loading="lazy"
          decoding="async"
          onError={handleIconError}
        />
      ) : (
        <span
          className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] font-display text-sm font-extrabold md:h-[52px] md:w-[52px] md:text-base"
          style={{ color: glow, textShadow: `0 0 14px ${glow}` }}
        >
          {toolInitials(tool.name)}
        </span>
      )}
    </div>
  );
}

interface ToolsMarqueeProps {
  tools: StackTool[];
  direction?: 'left-tools' | 'right-tools';
  className?: string;
}

export function ToolsMarquee({ tools, direction = 'left-tools', className = '' }: ToolsMarqueeProps) {
  return (
    <Marquee direction={direction} className={className} gapClass="gap-6 md:gap-10">
      {tools.map((tool) => (
        <ToolBadge key={`${direction}-${tool.name}`} tool={tool} />
      ))}
    </Marquee>
  );
}
