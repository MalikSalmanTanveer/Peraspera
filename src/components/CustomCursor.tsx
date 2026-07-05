"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const outlineX = useRef(0);
  const outlineY = useRef(0);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Enable custom cursor styling on body (hides default cursor on desktop)
    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      
      if (!isVisible) setIsVisible(true);
      
      // Update dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    // Smooth animation loop for cursor outline (Lerp)
    let animationFrameId: number;
    const updateOutline = () => {
      const ease = 0.15; // interpolation factor
      
      outlineX.current += (mouseX.current - outlineX.current) * ease;
      outlineY.current += (mouseY.current - outlineY.current) * ease;
      
      if (outlineRef.current) {
        outlineRef.current.style.transform = `translate3d(${outlineX.current}px, ${outlineY.current}px, 0) translate(-50%, -50%) ${
          isHovered ? "scale(1.5)" : "scale(1)"
        }`;
      }
      
      animationFrameId = requestAnimationFrame(updateOutline);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    // Event delegation for hover effect
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
    
    animationFrameId = requestAnimationFrame(updateOutline);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, isVisible]);

  if (typeof window === "undefined" || !isVisible) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "8px",
          height: "8px",
          backgroundColor: "var(--primary)",
          borderRadius: "50%",
          zIndex: 9999,
          pointerEvents: "none",
          willChange: "transform",
        }}
      />
      <div
        ref={outlineRef}
        className="cursor-outline"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "40px",
          height: "40px",
          border: "2px solid rgba(255, 107, 53, 0.5)",
          backgroundColor: isHovered ? "rgba(255, 107, 53, 0.1)" : "transparent",
          borderRadius: "50%",
          zIndex: 9998,
          pointerEvents: "none",
          willChange: "transform",
          transition: "transform 0.15s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out",
        }}
      />
    </>
  );
}
