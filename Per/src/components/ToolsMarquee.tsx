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
      className="group/logo relative flex h-[104px] w-[76px] shrink-0 flex-col items-center justify-end md:h-[112px] md:w-[84px]"
      aria-label={tool.name}
    >
      <div
        role="tooltip"
        className="pointer-events-none absolute top-0 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center opacity-0 transition-all duration-200 ease-out group-hover/logo:translate-y-0 group-hover/logo:opacity-100"
      >
        <span className="whitespace-nowrap rounded-lg border border-white/14 bg-[#141414] px-3.5 py-2 text-[11px] font-semibold tracking-wide text-white shadow-[0_10px_28px_rgba(0,0,0,0.4)] md:text-xs">
          {tool.name}
        </span>
        <span
          className="mt-[-1px] h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-[#141414]"
          aria-hidden="true"
        />
      </div>

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
