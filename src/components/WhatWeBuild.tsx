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
const CARD_RADIUS = 43;
const CARD_HALF_PCT = 9;
const LINE_END_RADIUS = CARD_RADIUS - CARD_HALF_PCT;

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
    <button
      className={`${styles.node} ${isActive ? styles.nodeActive : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className={styles.nodeIcon}>
        <span className="material-icons">{node.icon}</span>
      </div>
      <div className={styles.nodeContent}>
        <div className={styles.nodeTitle}>{node.title}</div>
        <div className={styles.nodeDesc}>{node.description}</div>
      </div>
    </button>
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
                  <feGaussianBlur stdDeviation="0.45" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,204,0,0.16)" />
                  <stop offset="100%" stopColor="rgba(255,204,0,0)" />
                </radialGradient>
              </defs>

              <circle
                cx="50"
                cy="50"
                r={CARD_RADIUS}
                fill="none"
                stroke="rgba(255,204,0,0.07)"
                strokeWidth="0.18"
                strokeDasharray="1.2 2.2"
              />

              <circle cx="50" cy="50" r="14" fill="url(#hubGrad)" />

              {NODES.map((node) => {
                const lineEnd = polar(node.angle, LINE_END_RADIUS);
                const isHighlighted = highlightedId === node.id;

                return (
                  <g key={node.id}>
                    <line
                      x1={CENTER.x}
                      y1={CENTER.y}
                      x2={lineEnd.x}
                      y2={lineEnd.y}
                      stroke={isHighlighted ? "rgba(255,204,0,0.75)" : "rgba(255,204,0,0.28)"}
                      strokeWidth={isHighlighted ? "0.34" : "0.24"}
                      strokeLinecap="round"
                      filter={isHighlighted ? "url(#circuitGlow)" : undefined}
                      style={{ transition: "stroke 0.35s ease, stroke-width 0.35s ease" }}
                    />

                    {isHighlighted && (
                      <>
                        <line
                          x1={CENTER.x}
                          y1={CENTER.y}
                          x2={lineEnd.x}
                          y2={lineEnd.y}
                          stroke="rgba(255,204,0,0.8)"
                          strokeWidth="0.42"
                          strokeDasharray="1.2 2.5"
                          strokeLinecap="round"
                          style={{ animation: "circuitFlow 1.2s linear infinite" }}
                        />
                        <circle r="0.5" fill="#FFCC00">
                          <animateMotion
                            dur="1.6s"
                            repeatCount="indefinite"
                            path={`M ${CENTER.x} ${CENTER.y} L ${lineEnd.x} ${lineEnd.y}`}
                          />
                        </circle>
                      </>
                    )}

                    <circle
                      cx={lineEnd.x}
                      cy={lineEnd.y}
                      r="0.6"
                      fill={isHighlighted ? "#FFCC00" : "rgba(255,204,0,0.4)"}
                      style={{ transition: "fill 0.35s ease" }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hub — outer anchor keeps true center, inner handles animation */}
            <div className={styles.hubAnchor}>
              <motion.div
                className={styles.hub}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className={styles.pedestal}>
                  <div className={`${styles.pedestalRing} ${styles.pedestalRing1}`} />
                  <div className={`${styles.pedestalRing} ${styles.pedestalRing2}`} />
                  <div className={`${styles.pedestalRing} ${styles.pedestalRing3}`} />
                  <div className={styles.pedestalGrid} />
                  <div className={styles.pedestalGlow} />
                  <img src="/logo2.png" alt="Per Aspera" className={styles.hubLogo} />
                </div>
              </motion.div>
            </div>

            {NODES.map((node, i) => {
              const pos = polar(node.angle, CARD_RADIUS);
              return (
                <motion.div
                  key={node.id}
                  className={styles.nodeAnchor}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
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
