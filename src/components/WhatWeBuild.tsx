"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./WhatWeBuild.module.css";

interface EcosystemNode {
  id: number;
  title: string;
  description: string;
  icon: string;
  angle: number;
  radius: number;
}

const NODES: EcosystemNode[] = [
  {
    id: 1,
    title: "Automation",
    description: "Streamline workflows and eliminate manual tasks.",
    icon: "settings",
    angle: -90,
    radius: 38,
  },
  {
    id: 2,
    title: "AI Agents",
    description: "Intelligent agents that think, learn and automate for you.",
    icon: "psychology",
    angle: -42,
    radius: 40,
  },
  {
    id: 3,
    title: "SaaS",
    description: "Scalable SaaS products built for growth.",
    icon: "bolt",
    angle: -8,
    radius: 42,
  },
  {
    id: 4,
    title: "Accounting",
    description: "Smart accounting, bookkeeping and financial automation.",
    icon: "account_balance",
    angle: 38,
    radius: 40,
  },
  {
    id: 5,
    title: "Marketing",
    description: "Data-driven marketing that attracts and converts.",
    icon: "campaign",
    angle: 82,
    radius: 38,
  },
  {
    id: 6,
    title: "Analytics",
    description: "Real-time insights that help you make better decisions.",
    icon: "analytics",
    angle: 128,
    radius: 40,
  },
  {
    id: 7,
    title: "CRM",
    description: "Manage relationships and grow customer loyalty.",
    icon: "groups",
    angle: 168,
    radius: 42,
  },
  {
    id: 8,
    title: "Cloud",
    description: "Secure, scalable and reliable cloud infrastructure.",
    icon: "cloud",
    angle: -148,
    radius: 40,
  },
  {
    id: 9,
    title: "Software",
    description: "Custom software that solves real business problems.",
    icon: "code",
    angle: -118,
    radius: 38,
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

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: 50 + r * Math.cos(rad),
    y: 50 + r * Math.sin(rad),
  };
}

function circuitPath(cx: number, cy: number, tx: number, ty: number, angle: number) {
  const rad = (angle * Math.PI) / 180;
  const elbow1 = {
    x: cx + Math.cos(rad) * 12,
    y: cy + Math.sin(rad) * 12,
  };
  const elbow2 = {
    x: tx - Math.cos(rad) * 8,
    y: ty - Math.sin(rad) * 8,
  };
  return `M ${cx} ${cy} L ${elbow1.x} ${elbow1.y} L ${elbow2.x} ${elbow2.y} L ${tx} ${ty}`;
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
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: isActive ? 1.04 : 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      whileTap={{ scale: 0.97 }}
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
  const [activeId, setActiveId] = useState<number>(1);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const highlightedId = hoveredId ?? activeId;

  const cycleNext = useCallback(() => {
    setActiveId((prev) => {
      const idx = NODES.findIndex((n) => n.id === prev);
      return NODES[(idx + 1) % NODES.length].id;
    });
  }, []);

  useEffect(() => {
    if (!isInView || hoveredId !== null) return;
    const interval = setInterval(cycleNext, 4000);
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
          className={styles.headerRow}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
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
              A connected technology ecosystem where AI, software, creative, growth,
              and finance modules work in perfect sync to power your business.
            </p>
          </div>

          <button className={styles.exploreBtn} onClick={scrollToServices}>
            Explore Solutions
            <span className="material-icons" style={{ fontSize: "1rem" }}>
              arrow_forward
            </span>
          </button>
        </motion.div>

        {/* Desktop orbital diagram */}
        <div className={styles.diagramWrap}>
          <span className={styles.sideLabel}>Per Aspera Ecosystem</span>

          {/* Circuit SVG */}
          <svg className={styles.circuitSvg} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="circuitGlow">
                <feGaussianBlur stdDeviation="0.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,204,0,0.15)" />
                <stop offset="100%" stopColor="rgba(255,204,0,0)" />
              </radialGradient>
            </defs>

            <circle cx="50" cy="50" r="18" fill="url(#hubGrad)" />

            {NODES.map((node) => {
              const pos = polar(node.angle, node.radius);
              const path = circuitPath(50, 50, pos.x, pos.y, node.angle);
              const isHighlighted = highlightedId === node.id;

              return (
                <g key={node.id}>
                  <path
                    d={path}
                    fill="none"
                    stroke={isHighlighted ? "rgba(255,204,0,0.55)" : "rgba(255,204,0,0.12)"}
                    strokeWidth={isHighlighted ? "0.35" : "0.2"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={isHighlighted ? "url(#circuitGlow)" : undefined}
                    style={{ transition: "stroke 0.4s ease, stroke-width 0.4s ease" }}
                  />

                  {isHighlighted && (
                    <>
                      <path
                        d={path}
                        fill="none"
                        stroke="rgba(255,204,0,0.6)"
                        strokeWidth="0.5"
                        strokeDasharray="2 4"
                        style={{ animation: "circuitFlow 1.2s linear infinite" }}
                      />
                      <circle r="0.5" fill="#FFCC00">
                        <animateMotion
                          dur="1.8s"
                          repeatCount="indefinite"
                          path={path}
                        />
                      </circle>
                    </>
                  )}

                  {/* Junction dots */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="0.6"
                    fill={isHighlighted ? "#FFCC00" : "rgba(255,204,0,0.25)"}
                    style={{ transition: "fill 0.4s ease" }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Central hub */}
          <motion.div
            className={styles.hub}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
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
            <span className={styles.hubLabel}>Intelligence Core</span>
          </motion.div>

          {/* Orbital nodes */}
          {NODES.map((node, i) => {
            const pos = polar(node.angle, node.radius);
            const isActive = highlightedId === node.id;

            return (
              <motion.div
                key={node.id}
                className={styles.nodeAnchor}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <NodeCard
                  node={node}
                  isActive={isActive}
                  onEnter={() => setHoveredId(node.id)}
                  onLeave={() => setHoveredId(null)}
                  onClick={() => setActiveId(node.id)}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile grid fallback */}
        <div className={styles.mobileGrid}>
          {NODES.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05, duration: 0.4 }}
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
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              className={styles.pillar}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
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
