"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./PerAsperaCore.module.css";

interface CoreService {
  id: number;
  title: string;
  description: string;
  icon: string;
  angle: number;
}

const CENTER = { x: 50, y: 50 };
const HUB_RADIUS = 11;
const CARD_RADIUS = 40;
const CARD_HALF = 8.5;
const LINE_END = CARD_RADIUS - CARD_HALF;

const SERVICES: CoreService[] = [
  { id: 1, title: "AI", description: "Intelligent solutions that learn, adapt, and evolve.", icon: "smart_toy", angle: -90 },
  { id: 2, title: "Finance", description: "Smart financial systems for sustainable growth.", icon: "bar_chart", angle: -30 },
  { id: 3, title: "Branding", description: "Creating identities that inspire and leave a mark.", icon: "brush", angle: 30 },
  { id: 4, title: "Automation", description: "Streamlining workflows and eliminating complexity.", icon: "settings", angle: 90 },
  { id: 5, title: "Software", description: "Custom software built for performance and scale.", icon: "code", angle: 150 },
  { id: 6, title: "Marketing", description: "Data-driven strategies that attract, engage, and convert.", icon: "campaign", angle: -150 },
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${8 + (i * 5.2) % 84}%`,
  bottom: `${(i * 7.3) % 60}%`,
  delay: `${(i * 0.7) % 6}s`,
  duration: `${5 + (i % 4)}s`,
}));

function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER.x + radius * Math.cos(rad),
    y: CENTER.y + radius * Math.sin(rad),
  };
}

function curvedPath(angleDeg: number) {
  const hubEdge = polar(angleDeg, HUB_RADIUS);
  const cardEdge = polar(angleDeg, LINE_END);
  const rad = (angleDeg * Math.PI) / 180;
  const midX = (hubEdge.x + cardEdge.x) / 2;
  const midY = (hubEdge.y + cardEdge.y) / 2;
  const bulge = 4;
  const cx = midX - bulge * Math.sin(rad);
  const cy = midY + bulge * Math.cos(rad);
  return `M ${hubEdge.x} ${hubEdge.y} Q ${cx} ${cy} ${cardEdge.x} ${cardEdge.y}`;
}

function ServiceCard({
  service,
  isActive,
  onEnter,
  onLeave,
  onClick,
}: {
  service: CoreService;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  return (
    <button
      className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className={styles.cardIconWrap}>
        <span className="material-icons">{service.icon}</span>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTitle}>{service.title}</div>
        <div className={styles.cardDesc}>{service.description}</div>
      </div>
    </button>
  );
}

export default function PerAsperaCore() {
  const [activeId, setActiveId] = useState(1);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const highlightedId = hoveredId ?? activeId;

  const cycleNext = useCallback(() => {
    setActiveId((prev) => {
      const idx = SERVICES.findIndex((s) => s.id === prev);
      return SERVICES[(idx + 1) % SERVICES.length].id;
    });
  }, []);

  useEffect(() => {
    if (!isInView || hoveredId !== null) return;
    const interval = setInterval(cycleNext, 3800);
    return () => clearInterval(interval);
  }, [isInView, hoveredId, cycleNext]);

  return (
    <section ref={sectionRef} id="per-aspera-core" className={styles.section}>
      <div className={styles.circuitBg} />
      <div className={styles.glowOrb} />

      <div className={styles.particles}>
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className={styles.particle}
            style={{ left: p.left, bottom: p.bottom, animationDelay: p.delay, animationDuration: p.duration }}
          />
        ))}
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className={styles.eyebrow}>Per Aspera Core</p>
          <h2 className={styles.title}>
            One Core. <span className={styles.titleAccent}>Infinite Impact.</span>
          </h2>
          <p className={styles.subtitle}>
            Our integrated ecosystem connects every service to deliver smarter,
            faster, and more effective solutions.
          </p>
        </motion.div>

        <div className={styles.diagramWrap}>
          <svg className={styles.circuitSvg} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="coreLineGlow">
                <feGaussianBlur stdDeviation="0.55" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {SERVICES.map((service, i) => {
              const path = curvedPath(service.angle);
              const hubNode = polar(service.angle, HUB_RADIUS);
              const isActive = highlightedId === service.id;

              return (
                <g key={service.id}>
                  <motion.path
                    d={path}
                    fill="none"
                    stroke={isActive ? "rgba(255,204,0,0.8)" : "rgba(255,204,0,0.25)"}
                    strokeWidth={isActive ? "0.38" : "0.26"}
                    strokeLinecap="round"
                    filter={isActive ? "url(#coreLineGlow)" : undefined}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.9, ease: "easeOut" }}
                    style={{ transition: "stroke 0.4s ease" }}
                  />

                  {isActive && (
                    <>
                      <motion.path
                        d={path}
                        fill="none"
                        stroke="rgba(255,204,0,0.9)"
                        strokeWidth="0.45"
                        strokeDasharray="1.5 3"
                        strokeLinecap="round"
                        style={{ animation: "circuitFlow 1s linear infinite" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                      <circle r="0.55" fill="#FFCC00">
                        <animateMotion dur="1.4s" repeatCount="indefinite" path={path} />
                      </circle>
                    </>
                  )}

                  <motion.circle
                    cx={hubNode.x}
                    cy={hubNode.y}
                    r="0.7"
                    fill={isActive ? "#FFCC00" : "rgba(255,204,0,0.5)"}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.08, type: "spring", stiffness: 300 }}
                    style={{ transition: "fill 0.35s ease" }}
                  />
                </g>
              );
            })}
          </svg>

          <div className={styles.hubAnchor}>
            <motion.div
              className={styles.coreRing}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <img src="/logo2.png" alt="Per Aspera" className={styles.coreLogo} />
            </motion.div>
          </div>

          {SERVICES.map((service, i) => {
            const pos = polar(service.angle, CARD_RADIUS);
            return (
              <div
                key={service.id}
                className={styles.nodeAnchor}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <ServiceCard
                    service={service}
                    isActive={highlightedId === service.id}
                    onEnter={() => setHoveredId(service.id)}
                    onLeave={() => setHoveredId(null)}
                    onClick={() => setActiveId(service.id)}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>

        <div className={styles.mobileGrid}>
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <ServiceCard
                service={service}
                isActive={highlightedId === service.id}
                onEnter={() => setHoveredId(service.id)}
                onLeave={() => setHoveredId(null)}
                onClick={() => setActiveId(service.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
