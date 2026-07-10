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
}

const CENTER = { x: 50, y: 50 };
const CARD_RADIUS = 38;
const LINE_RADIUS = 24;

const NODES: EcosystemNode[] = [
  { id: 1, title: "Automation", description: "Streamline workflows and eliminate manual tasks.", icon: "settings", angle: -90 },
  { id: 2, title: "AI Agents", description: "Intelligent agents that think, learn and automate for you.", icon: "psychology", angle: -50 },
  { id: 3, title: "SaaS", description: "Scalable SaaS products built for growth.", icon: "bolt", angle: -10 },
  { id: 4, title: "Accounting", description: "Smart accounting, bookkeeping and financial automation.", icon: "account_balance", angle: 30 },
  { id: 5, title: "Marketing", description: "Data-driven marketing that attracts and converts.", icon: "campaign", angle: 70 },
  { id: 6, title: "Analytics", description: "Real-time insights that help you make better decisions.", icon: "analytics", angle: 110 },
  { id: 7, title: "CRM", description: "Manage relationships and grow customer loyalty.", icon: "groups", angle: 150 },
  { id: 8, title: "Cloud", description: "Secure, scalable and reliable cloud infrastructure.", icon: "cloud", angle: 190 },
  { id: 9, title: "Software", description: "Custom software that solves real business problems.", icon: "code", angle: 230 },
];

const PILLARS = [
  { title: "Fully Connected", description: "Every module works together in perfect sync to power your business.", icon: "hub" },
  { title: "Built for Scale", description: "From startups to enterprises, our ecosystem grows with your ambition.", icon: "shield" },
  { title: "Future Ready", description: "Modern technology, continuous innovation and a vision for tomorrow.", icon: "rocket_launch" },
];

function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER.x + radius * Math.cos(rad),
    y: CENTER.y + radius * Math.sin(rad),
  };
}

function circuitPath(angleDeg: number) {
  const end = polar(angleDeg, LINE_RADIUS);
  const rad = (angleDeg * Math.PI) / 180;
  const elbow = {
    x: CENTER.x + LINE_RADIUS * 0.55 * Math.cos(rad),
    y: CENTER.y + LINE_RADIUS * 0.55 * Math.sin(rad),
  };

  if (Math.abs(Math.cos(rad)) > Math.abs(Math.sin(rad))) {
    return `M ${CENTER.x} ${CENTER.y} L ${elbow.x} ${CENTER.y} L ${elbow.x} ${elbow.y} L ${end.x} ${end.y}`;
  }
  return `M ${CENTER.x} ${CENTER.y} L ${CENTER.x} ${elbow.y} L ${elbow.x} ${elbow.y} L ${end.x} ${end.y}`;
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
      animate={{ scale: isActive ? 1.04 : 1 }}
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

        <div className={styles.diagramStage}>
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
                  <stop offset="0%" stopColor="rgba(255,204,0,0.14)" />
                  <stop offset="100%" stopColor="rgba(255,204,0,0)" />
                </radialGradient>
              </defs>

              <circle
                cx="50"
                cy="50"
                r={CARD_RADIUS}
                fill="none"
                stroke="rgba(255,204,0,0.08)"
                strokeWidth="0.2"
                strokeDasharray="1.5 2.5"
              />

              <circle cx="50" cy="50" r="16" fill="url(#hubGrad)" />

              {NODES.map((node) => {
                const path = circuitPath(node.angle);
                const junction = polar(node.angle, LINE_RADIUS);
                const cardPos = polar(node.angle, CARD_RADIUS);
                const isHighlighted = highlightedId === node.id;

                return (
                  <g key={node.id}>
                    <path
                      d={path}
                      fill="none"
                      stroke={isHighlighted ? "rgba(255,204,0,0.65)" : "rgba(255,204,0,0.22)"}
                      strokeWidth={isHighlighted ? "0.32" : "0.22"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={isHighlighted ? "url(#circuitGlow)" : undefined}
                      style={{ transition: "stroke 0.4s ease" }}
                    />

                    <line
                      x1={junction.x}
                      y1={junction.y}
                      x2={cardPos.x}
                      y2={cardPos.y}
                      stroke={isHighlighted ? "rgba(255,204,0,0.55)" : "rgba(255,204,0,0.18)"}
                      strokeWidth={isHighlighted ? "0.28" : "0.18"}
                      strokeLinecap="round"
                      style={{ transition: "stroke 0.4s ease" }}
                    />

                    {isHighlighted && (
                      <>
                        <path
                          d={path}
                          fill="none"
                          stroke="rgba(255,204,0,0.7)"
                          strokeWidth="0.38"
                          strokeDasharray="1.5 3"
                          style={{ animation: "circuitFlow 1.4s linear infinite" }}
                        />
                        <circle r="0.45" fill="#FFCC00">
                          <animateMotion dur="2s" repeatCount="indefinite" path={path} />
                        </circle>
                      </>
                    )}

                    <circle
                      cx={junction.x}
                      cy={junction.y}
                      r="0.55"
                      fill={isHighlighted ? "#FFCC00" : "rgba(255,204,0,0.35)"}
                    />
                  </g>
                );
              })}
            </svg>

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
            </motion.div>

            {NODES.map((node, i) => {
              const pos = polar(node.angle, CARD_RADIUS);
              return (
                <motion.div
                  key={node.id}
                  className={styles.nodeAnchor}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
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
              );
            })}
          </div>
        </div>

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
