import { useState } from 'react';
import { Marquee } from './Marquee';
import type { StackTool } from '../data/tools-stack';

function toolIconSources(tool: StackTool): string[] {
  const sources: string[] = [];
  if (tool.slug) {
    sources.push(`https://cdn.simpleicons.org/${tool.slug}/FFFFFF`);
    sources.push(`https://cdn.simpleicons.org/${tool.slug}`);
  }
  if (tool.devicon) {
    sources.push(
      `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tool.devicon}.svg`,
    );
  }
  return sources;
}

function ToolLogo({ tool }: { tool: StackTool }) {
  const sources = toolIconSources(tool);
  const [sourceIndex, setSourceIndex] = useState(0);
  const iconUrl = sources[sourceIndex];

  const handleIconError = () => {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex((current) => current + 1);
    }
  };

  if (!iconUrl) return null;

  return (
    <div
      className="group/logo relative flex h-[76px] w-[76px] shrink-0 items-center justify-center md:h-[84px] md:w-[84px]"
      aria-label={tool.name}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] transition-all duration-300 ease-out group-hover/logo:-translate-y-0.5 group-hover/logo:border-white/18 group-hover/logo:bg-white/[0.1] group-hover/logo:shadow-[0_10px_28px_rgba(0,0,0,0.28)] md:h-[60px] md:w-[60px]">
        <img
          src={iconUrl}
          alt=""
          className="h-7 w-7 object-contain opacity-90 transition-transform duration-300 ease-out group-hover/logo:scale-105 group-hover/logo:opacity-100 md:h-8 md:w-8"
          loading="lazy"
          decoding="async"
          onError={handleIconError}
        />
      </div>

      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 -translate-x-1/2 translate-y-1 rounded-lg border border-white/12 bg-[#161616]/95 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 ease-out group-hover/logo:translate-y-0 group-hover/logo:opacity-100 md:text-xs"
      >
        {tool.name}
      </span>
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
    <Marquee direction={direction} className={className} gapClass="gap-8 md:gap-12">
      {tools.map((tool) => (
        <ToolLogo key={`${direction}-${tool.slug ?? tool.name}`} tool={tool} />
      ))}
    </Marquee>
  );
}
