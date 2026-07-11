"use client";

import React, { useRef } from "react";
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

const CONVERGENCE = [
  "Business Strategy",
  "AI",
  "Software",
  "Automation",
  "Accounting",
  "Design",
];

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

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
          className={styles.convergence}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className={styles.convergenceLabel}>One intelligent ecosystem</p>
          <div className={styles.convergenceTrack}>
            {CONVERGENCE.map((item, i) => (
              <span key={item} className={styles.convergenceItem}>
                {item}
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
