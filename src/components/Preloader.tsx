"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [wipeActive, setWipeActive] = useState(false);
  const [preloaderHidden, setPreloaderHidden] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const loadingTexts = [
    "Custom Web Development",
    "UI/UX Design Agency",
    "AI Automations",
    "Digital Marketing",
  ];

  useEffect(() => {
    // Add loading class to body to prevent scroll
    document.body.classList.add("loading");

    // Text cycler
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 600);

    // Counter incrementer
    const counterInterval = setInterval(() => {
      setCount((prev) => {
        const next = prev + Math.floor(Math.random() * 15) + 1;
        if (next >= 100) {
          clearInterval(counterInterval);
          clearInterval(textInterval);
          
          // Trigger Orange Wipe Exit
          setTimeout(() => {
            setWipeActive(true);
            setTimeout(() => {
              setPreloaderHidden(true);
              document.body.classList.remove("loading");
              // Remove the component from DOM after animation completes
              setTimeout(() => {
                setIsVisible(false);
              }, 800);
            }, 600);
          }, 200);

          return 100;
        }
        return next;
      });
    }, 80);

    return () => {
      clearInterval(textInterval);
      clearInterval(counterInterval);
      document.body.classList.remove("loading");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      id="preloader"
      className={`preloader-hidden`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transform: preloaderHidden ? "translateY(-100%)" : "translateY(0%)",
        transition: "transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)",
      }}
    >
      <div
        style={{
          color: "#F59531",
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(5rem, 15vw, 8rem)",
          fontWeight: "bold",
          marginBottom: "2rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        {count}%
      </div>

      <div
        style={{
          height: "24px",
          overflow: "hidden",
          color: "#94a3b8",
          fontFamily: "var(--font-mono)",
          fontSize: "0.875rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            transform: `translateY(-${textIndex * 24}px)`,
            transition: "transform 0.5s ease-in-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {loadingTexts.map((text, idx) => (
            <span key={idx} style={{ height: "24px", display: "block" }}>
              {text}
            </span>
          ))}
        </div>
      </div>

      <div
        id="preloader-wipe"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: wipeActive ? "100%" : "0%",
          backgroundColor: "#F59531",
          zIndex: 5,
          transition: "height 0.6s cubic-bezier(0.77, 0, 0.175, 1)",
        }}
      />
    </div>
  );
}
