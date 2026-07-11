"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

const HOTSPOT_X = 4;
const HOTSPOT_Y = 4;

function CursorArrow() {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="cursorDepth" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#5A320E" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Deepest layer */}
      <path
        d="M8 36 C10 30 14 24 18 18 L28 8 L38 6 L34 16 L24 28 C18 34 12 38 8 36 Z"
        fill="#8A4A12"
        filter="url(#cursorDepth)"
      />

      {/* Mid shadow layer */}
      <path
        d="M10 34 C12 28 16 22 20 16 L30 8 L36 7 L32 15 L22 26 C17 31 13 35 10 34 Z"
        fill="#C47320"
      />

      {/* Organic drip accent */}
      <path
        d="M14 32 C15 28 17 24 19 20 C20 23 21 27 20 30 C18 33 15 34 14 32 Z"
        fill="#A85E18"
      />

      {/* Main arrow body */}
      <path
        d="M12 32 C14 26 18 20 22 14 L32 6 L40 5 L35 14 L25 24 C20 29 15 33 12 32 Z"
        fill="#F59531"
      />

      {/* Top highlight layer */}
      <path
        d="M14 30 C16 25 19 20 23 15 L31 8 L37 7 L33 13 L25 22 C21 26 17 30 14 30 Z"
        fill="#FFB56A"
        opacity="0.85"
      />

      {/* Cut-out circles (paper layers) */}
      <circle cx="28" cy="12" r="2.2" fill="#C47320" opacity="0.7" />
      <circle cx="22" cy="18" r="1.4" fill="#8A4A12" opacity="0.5" />

      {/* Tip highlight */}
      <path
        d="M36 6 L40 5 L38 9 Z"
        fill="#FFD4A0"
      />
    </svg>
  );
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const cursorX = useRef(0);
  const cursorY = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    let animationFrameId: number;
    const updateCursor = () => {
      const ease = 0.18;
      cursorX.current += (mouseX.current - cursorX.current) * ease;
      cursorY.current += (mouseY.current - cursorY.current) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX.current - HOTSPOT_X}px, ${cursorY.current - HOTSPOT_Y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select")) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select")) {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    animationFrameId = requestAnimationFrame(updateCursor);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (typeof window === "undefined" || !isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursor} ${isHovered ? styles.cursorHovered : ""}`}
      aria-hidden="true"
    >
      <CursorArrow />
    </div>
  );
}
