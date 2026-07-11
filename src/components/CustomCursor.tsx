"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

/* Tip of the pointer — standard top-left hotspot */
const HOTSPOT_X = 3;
const HOTSPOT_Y = 3;

function CursorArrow() {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 44 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="cursorShadow" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#3D2208" floodOpacity="0.55" />
        </filter>
        <clipPath id="arrowClip">
          <path d="M4 4 L4 31 L12 25 L16 39 L20 37 L15 23 L36 23 L4 4 Z" />
        </clipPath>
      </defs>

      <g filter="url(#cursorShadow)">
        {/* ── Deepest back layer + paint drips ── */}
        <path
          d="M4 4 L4 31 L12 25 L16 39 L20 37 L15 23 L36 23 L4 4 Z"
          fill="#6B3A0E"
        />
        {/* Drips — back layer (dark) */}
        <path
          d="M14 39 C13 41 12 44 13 47 C14 50 15 49 15 46 C15 43 16 41 14 39 Z"
          fill="#6B3A0E"
        />
        <path
          d="M19 37 C18 40 17 44 18 48 C19 52 21 51 21 47 C21 43 22 40 19 37 Z"
          fill="#6B3A0E"
        />
        <path
          d="M24 37 C23 39 22 42 23 45 C24 48 25 47 25 44 C25 41 26 39 24 37 Z"
          fill="#6B3A0E"
        />
        <path
          d="M30 23 C31 26 32 30 31 34 C30 38 28 37 28 33 C28 29 29 26 30 23 Z"
          fill="#6B3A0E"
        />

        {/* ── Mid layer (offset organic shape) ── */}
        <path
          d="M5 5 L5 29 L12 24 L15 36 L18 34 L14 22 L33 22 L5 5 Z"
          fill="#B86518"
        />
        <path
          d="M14 36 C13.5 38 13 41 14 44 C15 47 16.5 46 16 43 C15.5 40 16 37 14 36 Z"
          fill="#B86518"
        />
        <path
          d="M18 34 C17.5 37 17 41 18 45 C19 49 20.5 48 20 44 C19.5 40 20 37 18 34 Z"
          fill="#B86518"
        />
        <path
          d="M23 34 C22.5 36 22 39 23 42 C24 45 25 44 25 41 C25 38 25.5 36 23 34 Z"
          fill="#B86518"
        />
        <path
          d="M29 22 C30 25 30.5 29 29.5 32 C28.5 35 27 34 27 30 C27 26 28 23 29 22 Z"
          fill="#B86518"
        />

        {/* ── Main front layer ── */}
        <path
          d="M6 6 L6 28 L12 24 L14 34 L17 32 L13 21 L31 21 L6 6 Z"
          fill="#F59531"
        />

        {/* Internal organic splatter layers (clipped inside arrow) */}
        <g clipPath="url(#arrowClip)">
          <path
            d="M8 10 C12 14 16 12 20 16 C24 20 18 24 14 22 C10 20 6 16 8 10 Z"
            fill="#C47320"
            opacity="0.9"
          />
          <path
            d="M10 18 C14 22 20 20 24 24 C22 28 16 26 12 24 C9 22 8 20 10 18 Z"
            fill="#FFB56A"
            opacity="0.75"
          />
          <circle cx="22" cy="14" r="2.5" fill="#8A4A12" opacity="0.6" />
          <circle cx="16" cy="20" r="1.6" fill="#6B3A0E" opacity="0.45" />
        </g>

        {/* Top highlight sheen */}
        <path
          d="M7 7 L7 20 L11 17 L13 26 L15 25 L12 16 L26 16 L7 7 Z"
          fill="#FFD4A0"
          opacity="0.55"
        />

        {/* Tip accent */}
        <circle cx="6" cy="6" r="1.2" fill="#FFD4A0" opacity="0.9" />

        {/* ── Front paint drips (bright, liquid) ── */}
        <g className={styles.drips}>
          <path
            d="M14 34 C13 36 12.5 39 13.5 42.5 C14.5 46 16 45 15.5 41.5 C15 38 15.5 36 14 34 Z"
            fill="#F59531"
          />
          <path
            d="M13.5 42 C13.2 44 13.5 46 14.5 47.5 C15.5 49 16 47.5 15.5 45.5 C15 43.5 14.8 43 13.5 42 Z"
            fill="#FFB56A"
          />

          <path
            d="M18 32 C17 35 16.5 39 17.5 43.5 C18.5 48 20.5 47 20 42.5 C19.5 38 20 34 18 32 Z"
            fill="#F59531"
          />
          <path
            d="M17.5 43 C17 45.5 17.5 48.5 19 50.5 C20.5 52.5 21.5 50.5 21 47.5 C20.5 44.5 19.5 43 17.5 43 Z"
            fill="#FFB56A"
          />

          <path
            d="M23 32 C22.5 34 22 37 23 40 C24 43 25.5 42 25 39 C24.5 36 25 33 23 32 Z"
            fill="#F59531"
          />
          <path
            d="M22.8 40 C22.5 42 23 44 24 45.5 C25 47 25.5 45 25 43 C24.5 41 24 40 22.8 40 Z"
            fill="#FFB56A"
          />

          <path
            d="M28 21 C29 24 29.5 28 28.5 31.5 C27.5 35 26 34 26 30 C26 26 27 23 28 21 Z"
            fill="#F59531"
          />
          <path
            d="M28 31 C28.5 33 28.5 35.5 27.5 37.5 C26.5 39.5 25.5 38 26 35.5 C26.5 33 27.5 31 28 31 Z"
            fill="#FFB56A"
          />
        </g>
      </g>
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
      const ease = 0.2;
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
