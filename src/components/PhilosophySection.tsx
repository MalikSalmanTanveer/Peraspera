"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Fraunces } from "next/font/google";
import styles from "./PhilosophySection.module.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
});

const BEATS = [
  {
    label: "01 — Origin",
    text: "Per Aspera was born from years of freelancing — one client, one challenge, one solution at a time. Across industries and business models, the work was never just about delivering output. It was about understanding how companies actually operate.",
  },
  {
    label: "02 — Pattern",
    text: "Hundreds of real business problems revealed the same truth: most organizations are drowning in tools but starving for coherence. Dashboards multiply. Apps pile up. Processes fracture. Growth stalls not from lack of software — but from lack of system.",
  },
  {
    label: "03 — Convergence",
    text: "Business strategy, AI, software engineering, automation, accounting, and design were never separate disciplines to us. They are layers of one intelligence — the connective tissue that turns scattered effort into scalable momentum.",
  },
];

const EVOLUTION_STAGES = [
  {
    id: "freelancer",
    step: "01",
    title: "Freelancer",
    text: "It started with one person, one laptop, and a willingness to learn anything a client needed.",
    x: 8,
    y: 78,
  },
  {
    id: "consultant",
    step: "02",
    title: "Consultant",
    text: "Experience across industries turned into judgment — knowing not just how to build, but what to build.",
    x: 24,
    y: 64,
  },
  {
    id: "creative",
    step: "03",
    title: "Creative Professional",
    text: "Design and craft became inseparable from the work — not decoration, but part of the thinking.",
    x: 40,
    y: 50,
  },
  {
    id: "partner",
    step: "04",
    title: "Technology Partner",
    text: "Clients stopped hiring a freelancer. They started partnering with someone invested in their growth.",
    x: 56,
    y: 36,
  },
  {
    id: "ai",
    step: "05",
    title: "AI Innovation Company",
    text: "Every project began asking the same question: how do we make this business think, not just run?",
    x: 72,
    y: 22,
  },
  {
    id: "ecosystem",
    step: "06",
    title: "Technology Ecosystem",
    text: "Per Aspera — a connected system where businesses manage, automate, and scale in one place.",
    x: 90,
    y: 10,
  },
];

const CONVERGENCE = [
  { id: "strategy", label: "Business Strategy", angle: -90 },
  { id: "ai", label: "AI", angle: -30 },
  { id: "software", label: "Software", angle: 30 },
  { id: "automation", label: "Automation", angle: 90 },
  { id: "accounting", label: "Accounting", angle: 150 },
  { id: "design", label: "Design", angle: -150 },
];

const CENTER = { x: 50, y: 50 };
const HUB_RADIUS = 10;
const NODE_RADIUS = 34;

function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER.x + radius * Math.cos(rad),
    y: CENTER.y + radius * Math.sin(rad),
  };
}

function evolutionPath() {
  return EVOLUTION_STAGES.map((s) => `${s.x} ${s.y}`).join(" L ");
}

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeStageId, setActiveStageId] = useState("freelancer");
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null);

  const highlightedStageId = hoveredStageId ?? activeStageId;
  const activeStage =
    EVOLUTION_STAGES.find((s) => s.id === highlightedStageId) ?? EVOLUTION_STAGES[0];

  const cycleStage = useCallback(() => {
    setActiveStageId((prev) => {
      const idx = EVOLUTION_STAGES.findIndex((s) => s.id === prev);
      return EVOLUTION_STAGES[(idx + 1) % EVOLUTION_STAGES.length].id;
    });
  }, []);

  useEffect(() => {
    if (!isInView || hoveredStageId !== null) return;
    const interval = setInterval(cycleStage, 4000);
    return () => clearInterval(interval);
  }, [isInView, hoveredStageId, cycleStage]);

  const pathD = `M ${evolutionPath()}`;

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`${styles.section} ${fraunces.variable}`}
    >
      <div className={styles.watermark} aria-hidden="true">
        Per Aspera
      </div>
      <div className={styles.glowOrb} />
      <div className={styles.gridLine} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.layout}>
          <motion.div
            className={styles.manifesto}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className={styles.eyebrow}>Why We Exist</p>
            <h2 className={styles.headline}>
              Through Hardships.
              <br />
              <span className={styles.headlineAccent}>Toward Innovation.</span>
            </h2>
            <p className={styles.latin}>
              <em>Per aspera ad astra</em> — through hardships, to the stars.
            </p>
            <p className={styles.manifestoLead}>
              We didn&apos;t start as an agency. We started as problem-solvers —
              embedded in real businesses, learning what breaks, what scales, and
              what actually matters.
            </p>
          </motion.div>

          <div className={styles.narrative}>
            {BEATS.map((beat, i) => (
              <motion.div
                key={beat.label}
                className={styles.beat}
                initial={{ opacity: 0, y: 22 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.12 + i * 0.1,
                  duration: 0.65,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <span className={styles.beatLabel}>{beat.label}</span>
                <p className={styles.beatText}>{beat.text}</p>
              </motion.div>
            ))}

            <motion.blockquote
              className={styles.pullQuote}
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.45, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className={styles.pullMark}>&ldquo;</span>
              Companies don&apos;t need more software.
              <br />
              <strong>They need better systems.</strong>
            </motion.blockquote>
          </div>
        </div>

        <motion.div
          className={styles.mapSection}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.mapHeader}>
            <p className={styles.mapEyebrow}>The Evolution Map</p>
            <h3 className={styles.mapTitle}>
              From freelancing to{" "}
              <span className={styles.headlineAccent}>one intelligent ecosystem.</span>
            </h3>
          </div>

          <div className={styles.mapGrid}>
            <div className={styles.evolutionMap}>
              <svg
                className={styles.evolutionSvg}
                viewBox="0 0 100 88"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <defs>
                  <filter id="evoGlow">
                    <feGaussianBlur stdDeviation="0.6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="rgba(255,204,0,0.2)"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />

                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="rgba(255,204,0,0.75)"
                  strokeWidth="0.55"
                  strokeLinecap="round"
                  filter="url(#evoGlow)"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.4, delay: 0.15, ease: "easeOut" }}
                  style={{
                    strokeDasharray: "2 3",
                    animation: isInView ? "circuitFlow 1.2s linear infinite" : undefined,
                  }}
                />

                {EVOLUTION_STAGES.map((stage, i) => {
                  const isActive = highlightedStageId === stage.id;
                  const isPast =
                    EVOLUTION_STAGES.findIndex((s) => s.id === highlightedStageId) >= i;

                  return (
                    <g key={stage.id}>
                      <motion.circle
                        cx={stage.x}
                        cy={stage.y}
                        r={isActive ? 1.4 : 1}
                        fill={isActive ? "#FFCC00" : isPast ? "rgba(255,204,0,0.55)" : "rgba(255,204,0,0.25)"}
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 280 }}
                      />
                      {isActive && (
                        <circle r="0.45" fill="#FFCC00">
                          <animateMotion
                            dur="1.6s"
                            repeatCount="indefinite"
                            path={`M ${stage.x} ${stage.y} L ${EVOLUTION_STAGES[Math.min(i + 1, EVOLUTION_STAGES.length - 1)].x} ${EVOLUTION_STAGES[Math.min(i + 1, EVOLUTION_STAGES.length - 1)].y}`}
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className={styles.evolutionNodes}>
                {EVOLUTION_STAGES.map((stage, i) => {
                  const isActive = highlightedStageId === stage.id;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      className={`${styles.evolutionNode} ${isActive ? styles.evolutionNodeActive : ""}`}
                      style={{ left: `${stage.x}%`, top: `${stage.y}%` }}
                      onMouseEnter={() => setHoveredStageId(stage.id)}
                      onMouseLeave={() => setHoveredStageId(null)}
                      onClick={() => setActiveStageId(stage.id)}
                      aria-pressed={isActive}
                    >
                      <span className={styles.evolutionStep}>{stage.step}</span>
                      <span className={styles.evolutionLabel}>{stage.title}</span>
                    </button>
                  );
                })}
              </div>

              <motion.div
                key={activeStage.id}
                className={styles.evolutionPanel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.evolutionPanelStep}>
                  Stage {activeStage.step} / 06
                </span>
                <h4 className={styles.evolutionPanelTitle}>{activeStage.title}</h4>
                <p className={styles.evolutionPanelText}>{activeStage.text}</p>
              </motion.div>
            </div>

            <div className={styles.convergenceMap}>
              <p className={styles.convergenceMapLabel}>Convergence Map</p>
              <div className={styles.convergenceDiagram}>
                <svg
                  className={styles.convergenceSvg}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                >
                  {CONVERGENCE.map((node, i) => {
                    const hub = polar(node.angle, HUB_RADIUS);
                    const outer = polar(node.angle, NODE_RADIUS);
                    const isLit =
                      highlightedStageId === "ecosystem" || activeStageId === "ecosystem";

                    return (
                      <g key={node.id}>
                        <motion.line
                          x1={hub.x}
                          y1={hub.y}
                          x2={outer.x}
                          y2={outer.y}
                          stroke={isLit ? "rgba(255,204,0,0.65)" : "rgba(255,204,0,0.22)"}
                          strokeWidth={isLit ? "0.35" : "0.25"}
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                          transition={{ delay: 0.5 + i * 0.07, duration: 0.7 }}
                        />
                        <motion.circle
                          cx={outer.x}
                          cy={outer.y}
                          r="0.9"
                          fill={isLit ? "#FFCC00" : "rgba(255,204,0,0.35)"}
                          initial={{ scale: 0 }}
                          animate={isInView ? { scale: 1 } : {}}
                          transition={{ delay: 0.6 + i * 0.06, type: "spring", stiffness: 300 }}
                        />
                      </g>
                    );
                  })}
                </svg>

                <div className={styles.convergenceHub}>
                  <img src="/logo2.png" alt="" className={styles.convergenceLogo} />
                  <span className={styles.convergenceHubTitle}>Intelligence Layer</span>
                </div>

                {CONVERGENCE.map((node) => {
                  const pos = polar(node.angle, NODE_RADIUS);
                  return (
                    <span
                      key={node.id}
                      className={styles.convergenceNodeLabel}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    >
                      {node.label}
                    </span>
                  );
                })}
              </div>
              <p className={styles.convergenceMapCaption}>
                Where strategy, AI, software, automation, accounting, and design
                converge into one intelligent ecosystem.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.convergence}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className={styles.convergenceLabel}>One intelligent ecosystem</p>
          <div className={styles.convergenceTrack}>
            {CONVERGENCE.map((item, i) => (
              <span key={item.id} className={styles.convergenceItem}>
                {item.label}
                {i < CONVERGENCE.length - 1 && (
                  <span className={styles.convergenceDot} aria-hidden="true" />
                )}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.mission}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.58, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className={styles.missionLabel}>Our Mission</span>
          <p className={styles.missionText}>
            Our mission is to become the intelligence layer that helps modern
            businesses automate, innovate, and grow with confidence.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
