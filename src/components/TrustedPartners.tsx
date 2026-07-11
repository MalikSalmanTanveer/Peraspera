"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const CATEGORY_A = [
  { name: "Erasmus+", path: "/brands/ERASMUS+ (A).jpg" },
  { name: "Fiverr", path: "/brands/FIVERR (A).png" },
  { name: "Manchester Est", path: "/brands/MANCHESTER EST CLOTHING (A).png" },
  { name: "Opal Properties", path: "/brands/OPAL PROPERTIES DUBAI (A).jpg" },
  { name: "SBT", path: "/brands/SBT (A).png" },
  { name: "SLAP", path: "/brands/SLAP (A).jpeg" },
  { name: "You Tried It", path: "/brands/YOU TRIED IT.CO (A).png" },
];

const CATEGORY_B = [
  { name: "Limitless Minds", path: "/brands/ASSOCIATION  LIMITLESS MINDS (B).png" },
  { name: "Daystar", path: "/brands/ASSOCIATION DAYSTAR (B).png" },
  { name: "Dynamic Dreamers", path: "/brands/ASSOCIATION DYNAMIC DREAMERS (B).png" },
  { name: "BA Marketings", path: "/brands/BA MARKETINGS (B).png" },
  { name: "Bajo", path: "/brands/BAJO (B).png" },
  { name: "JC Buck Man", path: "/brands/JC BUCK MAN (B).png" },
  { name: "Niks Jewelery", path: "/brands/NIKS JEWELERY (B).png" },
  { name: "TFF Community", path: "/brands/TFF COMMUNITY (B).png" },
  { name: "Chocolate World", path: "/brands/THE CHOCLATE WORLD (B).png" },
];

const CATEGORY_C = [
  { name: "Karynsuarez", path: "/brands/Karynsuarez NAME (C).png" },
  { name: "Lollipops Grocery", path: "/brands/LOLLIPOPS GROCERY (C).jpg" },
  { name: "Stellar Structures", path: "/brands/STELLAR STRUCTURES PROPERTY (C).jpeg" },
  { name: "The Axbergs", path: "/brands/THE AXBERGS (C).png" },
  { name: "Viridian Real Estate", path: "/brands/VIRIDIAN REAL ESTATE (C).jpg" },
];

const ALL_BRANDS = [...CATEGORY_A, ...CATEGORY_B, ...CATEGORY_C];

export default function TrustedPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Counter animation
  const [count, setCount] = useState(0);
  const targetCount = ALL_BRANDS.length;
  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const step = Math.ceil(targetCount / 30);
    const interval = setInterval(() => {
      current += step;
      if (current >= targetCount) {
        current = targetCount;
        clearInterval(interval);
      }
      setCount(current);
    }, 40);
    return () => clearInterval(interval);
  }, [isInView, targetCount]);

  // Parallax for header
  const headerY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Track mouse for spotlight glow
  const handleSectionMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const rowA = [...CATEGORY_A, ...CATEGORY_A, ...CATEGORY_A];
  const rowB = [...CATEGORY_B, ...CATEGORY_B, ...CATEGORY_B];
  const rowC = [...CATEGORY_C, ...CATEGORY_C, ...CATEGORY_C, ...CATEGORY_C];

  return (
    <section
      ref={sectionRef}
      id="partners"
      onMouseMove={handleSectionMouseMove}
      style={{
        width: "100%",
        padding: "120px 0 100px",
        background: "#0A0A0A",
        borderTop: "1px solid rgba(255, 255, 255, 0.03)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial mouse-following spotlight */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          background: isInView
            ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 149, 49, 0.04), transparent 60%)`
            : "none",
          transition: "background 0.3s ease",
          zIndex: 0,
        }}
      />

      <style>{`
        .brand-card {
          width: 200px;
          height: 90px;
          padding: 16px 24px;
          margin: 0 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .brand-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(245, 149, 49, 0.08), transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .brand-card:hover::before {
          opacity: 1;
        }
        .brand-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(245, 149, 49, 0.4);
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 12px 40px rgba(245, 149, 49, 0.12), 0 0 0 1px rgba(245, 149, 49, 0.15);
        }
        .brand-logo {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: grayscale(100%) brightness(0.6) opacity(0.5);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          z-index: 1;
        }
        .brand-card:hover .brand-logo {
          filter: grayscale(0%) brightness(1) opacity(1);
          transform: scale(1.05);
        }
        .brand-name-tooltip {
          position: absolute;
          bottom: -28px;
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 500;
          color: #F59531;
          letter-spacing: 0.05em;
          white-space: nowrap;
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
        }
        .brand-card:hover .brand-name-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
          display: flex;
          padding: 14px 0;
        }
        .marquee-track-left {
          display: inline-flex;
          animation: marqueeLeft 35s linear infinite;
        }
        .marquee-track-right {
          display: inline-flex;
          animation: marqueeRight 40s linear infinite;
        }
        .marquee-container:hover .marquee-track-left,
        .marquee-container:hover .marquee-track-right {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <motion.div
        style={{
          width: "100%",
          padding: "0 24px",
          textAlign: "center",
          marginBottom: "64px",
          position: "relative",
          zIndex: 1,
          y: headerY,
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#F59531",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          Trusted Partners
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            color: "#F5F5F5",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            margin: "0 0 20px",
          }}
        >
          Brands that trust us with their vision.
        </motion.h2>

        {/* Animated counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: "999px",
            border: "1px solid rgba(245, 149, 49, 0.2)",
            background: "rgba(245, 149, 49, 0.05)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#F59531",
            }}
          >
            {count}+
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "#94A3B8",
              letterSpacing: "0.05em",
            }}
          >
            brands served
          </span>
        </motion.div>
      </motion.div>

      {/* Row 1: Category A — scrolls left */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="marquee-container"
      >
        <div className="marquee-track-left">
          {rowA.map((brand, i) => (
            <div
              className="brand-card"
              key={`cat-a-${i}`}
              onMouseEnter={() => setHoveredCard(`a-${i}`)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img src={brand.path} alt={`${brand.name} Logo`} className="brand-logo" />
              <span className="brand-name-tooltip">{brand.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Row 2: Category B — scrolls right */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="marquee-container"
        style={{ margin: "12px 0" }}
      >
        <div className="marquee-track-right">
          {rowB.map((brand, i) => (
            <div
              className="brand-card"
              key={`cat-b-${i}`}
              onMouseEnter={() => setHoveredCard(`b-${i}`)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img src={brand.path} alt={`${brand.name} Logo`} className="brand-logo" />
              <span className="brand-name-tooltip">{brand.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Row 3: Category C — scrolls left (faster) */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="marquee-container"
      >
        <div className="marquee-track-left" style={{ animationDuration: "28s" }}>
          {rowC.map((brand, i) => (
            <div
              className="brand-card"
              key={`cat-c-${i}`}
              onMouseEnter={() => setHoveredCard(`c-${i}`)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img src={brand.path} alt={`${brand.name} Logo`} className="brand-logo" />
              <span className="brand-name-tooltip">{brand.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
