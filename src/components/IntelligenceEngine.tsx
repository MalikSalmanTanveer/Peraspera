"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import styles from "./IntelligenceEngine.module.css";

interface EngineNode {
  id: string;
  title: string;
  description: string;
  story: string;
  icon: string;
  angle: number;
  connectsWith: string[];
}

const CENTER = { x: 50, y: 50 };
const NODE_RADIUS = 41;
const LINE_END_RADIUS = 30;
const HUB_RADIUS = 13;

const NODES: EngineNode[] = [
  {
    id: "ai",
    title: "AI",
    description: "Intelligent systems that learn, adapt, and evolve with your business.",
    story: "Powers agents, insights, and intelligent products across the engine.",
    icon: "psychology",
    angle: -90,
    connectsWith: ["automation", "analytics", "development"],
  },
  {
    id: "finance",
    title: "Finance",
    description: "Smart accounting, bookkeeping, and financial automation.",
    story: "Feeds reporting, payroll, and secure infrastructure decisions.",
    icon: "account_balance",
    angle: -45,
    connectsWith: ["analytics", "automation", "cloud"],
  },
  {
    id: "development",
    title: "Development",
    description: "Custom software engineered for performance and scale.",
    story: "Ships products that run on scalable, automated infrastructure.",
    icon: "code",
    angle: 0,
    connectsWith: ["ai", "cloud", "automation"],
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Data-driven strategies that attract, engage, and convert.",
    story: "Uses analytics, brand identity, and AI-driven campaign intelligence.",
    icon: "campaign",
    angle: 45,
    connectsWith: ["analytics", "branding", "ai"],
  },
  {
    id: "branding",
    title: "Branding",
    description: "Identities that inspire, differentiate, and endure.",
    story: "Shapes how products look, feel, and communicate to the world.",
    icon: "brush",
    angle: 90,
    connectsWith: ["marketing", "development"],
  },
  {
    id: "automation",
    title: "Automation",
    description: "Workflows streamlined. Manual tasks eliminated.",
    story: "Removes repetitive work across operations, code, and finance.",
    icon: "settings",
    angle: 135,
    connectsWith: ["ai", "development", "finance"],
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Real-time insights for sharper, faster decisions.",
    story: "Turns data into action across growth, product, and finance.",
    icon: "analytics",
    angle: 180,
    connectsWith: ["ai", "marketing", "finance"],
  },
  {
    id: "cloud",
    title: "Cloud",
    description: "Secure, scalable infrastructure everything runs on.",
    story: "Hosts, protects, and scales the entire intelligence engine.",
    icon: "cloud",
    angle: -135,
    connectsWith: ["development", "ai", "finance"],
  },
];

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 4.8) % 90}%`,
  top: `${(i * 6.2) % 88}%`,
  delay: `${(i * 0.6) % 5}s`,
  duration: `${4 + (i % 4)}s`,
}));

const NODE_MAP = Object.fromEntries(NODES.map((n) => [n.id, n]));

function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER.x + radius * Math.cos(rad),
    y: CENTER.y + radius * Math.sin(rad),
  };
}

function outwardOffset(angleDeg: number, px: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.cos(rad) * px,
    y: Math.sin(rad) * px,
  };
}

export default function IntelligenceEngine() {
  const [activeId, setActiveId] = useState<string>("ai");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const highlightedId = hoveredId ?? activeId;

  const activeNode = highlightedId ? NODE_MAP[highlightedId] : null;

  const cycleNext = useCallback(() => {
    setActiveId((prev) => {
      const idx = NODES.findIndex((n) => n.id === prev);
      const next = NODES[(idx + 1) % NODES.length];
      return next.id;
    });
  }, []);

  useEffect(() => {
    if (!isInView || hoveredId !== null) return;
    const interval = setInterval(cycleNext, 4500);
    return () => clearInterval(interval);
  }, [isInView, hoveredId, cycleNext]);

  const secondaryPairs = useMemo(() => {
    if (!activeNode) return [];
    const pairs: [string, string][] = [];
    activeNode.connectsWith.forEach((targetId) => {
      pairs.push([activeNode.id, targetId]);
    });
    return pairs;
  }, [activeNode]);

  return (
    <section ref={sectionRef} id="engine" className={styles.section}>
      <div className={styles.gridBg} />
      <div className={styles.radialGlow} />

      <div className={styles.particles}>
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className={styles.particle}
            style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration }}
          />
        ))}
      </div>

      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <p className={styles.eyebrow}>The Intelligence Engine</p>
        <h2 className={styles.title}>Everything connects here.</h2>
        <p className={styles.hint}>
          Hover any node to see how our disciplines work as one unified system.
        </p>
      </motion.div>

      <div className={styles.stage}>
        <div className={styles.diagram}>
          <svg className={styles.circuitSvg} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="engineGlow">
                <feGaussianBlur stdDeviation="0.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx="50"
              cy="50"
              r={NODE_RADIUS}
              fill="none"
              stroke="rgba(255,204,0,0.06)"
              strokeWidth="0.15"
              strokeDasharray="1 2"
            />

            {/* Secondary cross-connections */}
            {secondaryPairs.map(([from, to]) => {
              const a = polar(NODE_MAP[from].angle, LINE_END_RADIUS);
              const b = polar(NODE_MAP[to].angle, LINE_END_RADIUS);
              return (
                <motion.line
                  key={`${from}-${to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="rgba(255,204,0,0.35)"
                  strokeWidth="0.2"
                  strokeDasharray="1 2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                />
              );
            })}

            {/* Primary lines from hub */}
            {NODES.map((node, i) => {
              const hubEdge = polar(node.angle, HUB_RADIUS);
              const lineEnd = polar(node.angle, LINE_END_RADIUS);
              const isActive = highlightedId === node.id;
              const isDimmed = highlightedId !== null && !isActive;

              return (
                <g key={node.id}>
                  <motion.line
                    x1={hubEdge.x}
                    y1={hubEdge.y}
                    x2={lineEnd.x}
                    y2={lineEnd.y}
                    stroke={
                      isActive
                        ? "rgba(255,204,0,0.75)"
                        : isDimmed
                          ? "rgba(255,204,0,0.1)"
                          : "rgba(255,204,0,0.25)"
                    }
                    strokeWidth={isActive ? "0.32" : "0.2"}
                    strokeLinecap="round"
                    filter={isActive ? "url(#engineGlow)" : undefined}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: "easeOut" }}
                  />

                  {isActive && (
                    <>
                      <line
                        x1={hubEdge.x}
                        y1={hubEdge.y}
                        x2={lineEnd.x}
                        y2={lineEnd.y}
                        stroke="rgba(255,204,0,0.8)"
                        strokeWidth="0.38"
                        strokeDasharray="1.2 2.5"
                        strokeLinecap="round"
                        style={{ animation: "circuitFlow 1s linear infinite" }}
                      />
                      <circle r="0.45" fill="#FFCC00">
                        <animateMotion
                          dur="1.4s"
                          repeatCount="indefinite"
                          path={`M ${hubEdge.x} ${hubEdge.y} L ${lineEnd.x} ${lineEnd.y}`}
                        />
                      </circle>
                    </>
                  )}

                  <circle
                    cx={lineEnd.x}
                    cy={lineEnd.y}
                    r="0.5"
                    fill={isActive ? "#FFCC00" : "rgba(255,204,0,0.3)"}
                  />
                </g>
              );
            })}
          </svg>

          {/* Hub */}
          <div className={styles.hubAnchor}>
            <motion.div
              className={`${styles.core} ${highlightedId ? styles.coreActive : ""}`}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.15, type: "spring", stiffness: 200 }}
            >
              <img src="/logo2.png" alt="Per Aspera Core" className={styles.coreLogo} />
              <span className={styles.coreLabel}>Per Aspera Core</span>
            </motion.div>
          </div>

          {/* Nodes */}
          {NODES.map((node, i) => {
            const pos = polar(node.angle, NODE_RADIUS);
            const offset = outwardOffset(node.angle, 100);
            const isActive = highlightedId === node.id;
            const isDimmed = highlightedId !== null && !isActive;

            return (
              <div
                key={node.id}
                className={styles.nodeAnchor}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <motion.button
                  className={`${styles.nodePill} ${isActive ? styles.nodePillActive : ""} ${isDimmed ? styles.nodePillDim : ""}`}
                  onClick={() => setActiveId(node.id)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.35 + i * 0.05, duration: 0.45 }}
                >
                  <span className={styles.nodeIcon}>
                    <span className="material-icons">{node.icon}</span>
                  </span>
                  <span className={styles.nodeLabel}>{node.title}</span>
                </motion.button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className={styles.expandedWrap}
                      style={{
                        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                      }}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <div className={styles.expanded}>
                        <div className={styles.expandedTitle}>{node.title}</div>
                        <p className={styles.expandedDesc}>{node.description}</p>
                        <div className={styles.expandedConnects}>Connects with</div>
                        <div className={styles.expandedLinks}>
                          {node.connectsWith.map((id) => (
                            <span key={id} className={styles.expandedTag}>
                              {NODE_MAP[id]?.title}
                            </span>
                          ))}
                        </div>
                        <p className={styles.expandedStory}>{node.story}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Mobile */}
        <div className={styles.mobileList}>
          {NODES.map((node) => (
            <div
              key={node.id}
              className={`${styles.mobileCard} ${highlightedId === node.id ? styles.mobileCardActive : ""}`}
              onClick={() => setActiveId(node.id)}
            >
              <div className={styles.mobileCardHeader}>
                <span className={styles.nodeIcon}>
                  <span className="material-icons">{node.icon}</span>
                </span>
                <span className={styles.mobileCardTitle}>{node.title}</span>
              </div>
              {highlightedId === node.id && (
                <p className={styles.mobileCardDesc}>
                  {node.description} Connects with:{" "}
                  {node.connectsWith.map((id) => NODE_MAP[id]?.title).join(", ")}.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
