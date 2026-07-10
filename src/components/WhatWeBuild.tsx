"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./WhatWeBuild.module.css";

type NodeAlign =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface EcosystemNode {
  id: number;
  title: string;
  description: string;
  icon: string;
  x: number;
  y: number;
  align: NodeAlign;
}

const CENTER = { x: 50, y: 50 };

const NODES: EcosystemNode[] = [
  {
    id: 1,
    title: "Automation",
    description: "Streamline workflows and eliminate manual tasks.",
    icon: "settings",
    x: 50,
    y: 7,
    align: "top",
  },
  {
    id: 2,
    title: "AI Agents",
    description: "Intelligent agents that think, learn and automate for you.",
    icon: "psychology",
    x: 74,
    y: 11,
    align: "top-right",
  },
  {
    id: 3,
    title: "SaaS",
    description: "Scalable SaaS products built for growth.",
    icon: "bolt",
    x: 91,
    y: 30,
    align: "right",
  },
  {
    id: 4,
    title: "Accounting",
    description: "Smart accounting, bookkeeping and financial automation.",
    icon: "account_balance",
    x: 90,
    y: 56,
    align: "right",
  },
  {
    id: 5,
    title: "Marketing",
    description: "Data-driven marketing that attracts and converts.",
    icon: "campaign",
    x: 74,
    y: 76,
    align: "bottom-right",
  },
  {
    id: 6,
    title: "Analytics",
    description: "Real-time insights that help you make better decisions.",
    icon: "analytics",
    x: 50,
    y: 84,
    align: "bottom",
  },
  {
    id: 7,
    title: "CRM",
    description: "Manage relationships and grow customer loyalty.",
    icon: "groups",
    x: 26,
    y: 76,
    align: "bottom-left",
  },
  {
    id: 8,
    title: "Cloud",
    description: "Secure, scalable and reliable cloud infrastructure.",
    icon: "cloud",
    x: 9,
    y: 30,
    align: "left",
  },
  {
    id: 9,
    title: "Software",
    description: "Custom software that solves real business problems.",
    icon: "code",
    x: 26,
    y: 11,
    align: "top-left",
  },
];

const PILLARS = [
  {
    title: "Fully Connected",
    description: "Every module works together in perfect sync to power your business.",
    icon: "hub",
  },
  {
    title: "Built for Scale",
    description: "From startups to enterprises, our ecosystem grows with your ambition.",
    icon: "shield",
  },
  {
    title: "Future Ready",
    description: "Modern technology, continuous innovation and a vision for tomorrow.",
    icon: "rocket_launch",
  },
];

const ALIGN_CLASS: Record<NodeAlign, string> = {
  top: styles.alignTop,
  bottom: styles.alignBottom,
  left: styles.alignLeft,
  right: styles.alignRight,
  "top-left": styles.alignTopLeft,
  "top-right": styles.alignTopRight,
  "bottom-left": styles.alignBottomLeft,
  "bottom-right": styles.alignBottomRight,
};

function circuitPath(tx: number, ty: number) {
  const { x: cx, y: cy } = CENTER;
  const dx = tx - cx;
  const dy = ty - cy;
  const midX = cx + dx * 0.45;
  const midY = cy + dy * 0.45;

  if (Math.abs(dx) > Math.abs(dy)) {
    return `M ${cx} ${cy} L ${midX} ${cy} L ${midX} ${midY} L ${tx} ${ty}`;
  }
  return `M ${cx} ${cy} L ${cx} ${midY} L ${midX} ${midY} L ${tx} ${ty}`;
}

function NodeCard({
  node,
  isActive,
  onEnter,
  onLeave,
  onClick,
}: {
  node: EcosystemNode;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  return (
    <motion.button
      className={`${styles.node} ${isActive ? styles.nodeActive : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      animate={{ scale: isActive ? 1.03 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={styles.nodeIcon}>
        <span className="material-icons">{node.icon}</span>
      </div>
      <div className={styles.nodeContent}>
        <div className={styles.nodeTitle}>{node.title}</div>
        <div className={styles.nodeDesc}>{node.description}</div>
      </div>
    </motion.button>
  );
}

export default function WhatWeBuild() {
  const [activeId, setActiveId] = useState(1);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const highlightedId = hoveredId ?? activeId;

  const cycleNext = useCallback(() => {
    setActiveId((prev) => {
      const idx = NODES.findIndex((n) => n.id === prev);
      return NODES[(idx + 1) % NODES.length].id;
    });
  }, []);

  useEffect(() => {
    if (!isInView || hoveredId !== null) return;
    const interval = setInterval(cycleNext, 4500);
    return () => clearInterval(interval);
  }, [isInView, hoveredId, cycleNext]);

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="what-we-build" className={styles.section}>
      <div className={styles.gridBg} />
      <div className={styles.radialGlow} />

      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.headerGrid}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.headerLeft}>
            <span className={styles.headerTagline}>Connected.</span>
            <span className={styles.headerTagline}>Intelligent.</span>
            <span className={styles.headerTagline}>Powerful.</span>
          </div>

          <div className={styles.headerCenter}>
            <p className={styles.eyebrow}>Our Ecosystem</p>
            <h2 className={styles.title}>
              The Per Aspera{" "}
              <span className={styles.titleAccent}>Intelligence Core.</span>
            </h2>
            <p className={styles.subtitle}>
              Every solution we build connects, communicates, and collaborates —
              creating intelligent ecosystems that help businesses scale faster and smarter.
            </p>
          </div>

          <div className={styles.headerRight}>
            <button className={styles.exploreBtn} onClick={scrollToServices}>
              Explore Solutions
              <span className="material-icons" style={{ fontSize: "0.95rem" }}>
                arrow_forward
              </span>
            </button>
          </div>
        </motion.div>

        {/* Desktop diagram */}
        <div className={styles.diagramStage}>
          <span className={styles.sideLabel}>Per Aspera Ecosystem</span>

          <div className={styles.diagramWrap}>
            <svg
              className={styles.circuitSvg}
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="circuitGlow">
                  <feGaussianBlur stdDeviation="0.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,204,0,0.12)" />
                  <stop offset="100%" stopColor="rgba(255,204,0,0)" />
                </radialGradient>
              </defs>

              {/* Orbit ring */}
              <ellipse
                cx="50"
                cy="50"
                rx="38"
                ry="36"
                fill="none"
                stroke="rgba(255,204,0,0.06)"
                strokeWidth="0.15"
                strokeDasharray="1.5 2"
              />

              <circle cx="50" cy="50" r="14" fill="url(#hubGrad)" />

              {NODES.map((node) => {
                const path = circuitPath(node.x, node.y);
                const isHighlighted = highlightedId === node.id;

                return (
                  <g key={node.id}>
                    <path
                      d={path}
                      fill="none"
                      stroke={isHighlighted ? "rgba(255,204,0,0.5)" : "rgba(255,204,0,0.1)"}
                      strokeWidth={isHighlighted ? "0.3" : "0.18"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={isHighlighted ? "url(#circuitGlow)" : undefined}
                      style={{ transition: "stroke 0.4s ease" }}
                    />

                    {isHighlighted && (
                      <>
                        <path
                          d={path}
                          fill="none"
                          stroke="rgba(255,204,0,0.55)"
                          strokeWidth="0.4"
                          strokeDasharray="1.5 3"
                          style={{ animation: "circuitFlow 1.4s linear infinite" }}
                        />
                        <circle r="0.45" fill="#FFCC00">
                          <animateMotion dur="2s" repeatCount="indefinite" path={path} />
                        </circle>
                      </>
                    )}

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="0.5"
                      fill={isHighlighted ? "#FFCC00" : "rgba(255,204,0,0.2)"}
                      style={{ transition: "fill 0.4s ease" }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Central hub */}
            <motion.div
              className={styles.hub}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className={styles.pedestal}>
                <div className={`${styles.pedestalRing} ${styles.pedestalRing1}`} />
                <div className={`${styles.pedestalRing} ${styles.pedestalRing2}`} />
                <div className={`${styles.pedestalRing} ${styles.pedestalRing3}`} />
                <div className={styles.pedestalGrid} />
                <div className={styles.pedestalGlow} />

                <div className={styles.cubeWrap}>
                  <div className={styles.cube}>
                    <div className={`${styles.cubeFace} ${styles.cubeTop}`}>
                      <img src="/logo2.png" alt="Per Aspera" className={styles.cubeLogo} />
                    </div>
                    <div className={`${styles.cubeFace} ${styles.cubeFront}`} />
                    <div className={`${styles.cubeFace} ${styles.cubeRight}`} />
                  </div>
                </div>
              </div>
              <span className={styles.hubBrand}>per</span>
            </motion.div>

            {/* Orbital nodes */}
            {NODES.map((node, i) => (
              <motion.div
                key={node.id}
                className={`${styles.nodeAnchor} ${ALIGN_CLASS[node.align]}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.45 }}
              >
                <NodeCard
                  node={node}
                  isActive={highlightedId === node.id}
                  onEnter={() => setHoveredId(node.id)}
                  onLeave={() => setHoveredId(null)}
                  onClick={() => setActiveId(node.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile grid */}
        <div className={styles.mobileGrid}>
          {NODES.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.04, duration: 0.35 }}
            >
              <NodeCard
                node={node}
                isActive={highlightedId === node.id}
                onEnter={() => setHoveredId(node.id)}
                onLeave={() => setHoveredId(null)}
                onClick={() => setActiveId(node.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom pillars */}
        <motion.div
          className={styles.pillars}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              className={styles.pillar}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55 + i * 0.08, duration: 0.45 }}
            >
              <div className={styles.pillarIcon}>
                <span className="material-icons">{pillar.icon}</span>
              </div>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarDesc}>{pillar.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
