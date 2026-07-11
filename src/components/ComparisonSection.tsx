"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./ComparisonSection.module.css";

const TYPICAL = [
  "Builds a website.",
  "Leaves.",
];

const PER_ASPERA = [
  "Designs your digital infrastructure.",
  "Integrates AI.",
  "Automates operations.",
  "Provides long-term support.",
  "Builds reusable systems.",
  "Creates future-ready products.",
];

export default function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} id="comparison" className={styles.section}>
      <div className={styles.bgGlow} />

      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className={styles.eyebrow}>The Difference</p>
          <h2 className={styles.title}>
            Not another agency.{" "}
            <span className={styles.titleAccent}>A technology partner.</span>
          </h2>
          <p className={styles.subtitle}>
            Most agencies deliver a project and move on. We build systems that
            grow with your business — and stay with you.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {/* Typical Agency */}
          <motion.div
            className={`${styles.card} ${styles.cardTypical}`}
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 0.75, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className={styles.cardLabel}>Typical Agency</span>
            <h3 className={styles.cardTitle}>Deliver &amp; disappear.</h3>
            <ul className={styles.typicalList}>
              {TYPICAL.map((item, i) => (
                <motion.li
                  key={item}
                  className={styles.typicalItem}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.45 }}
                >
                  <span className={styles.typicalIcon}>
                    <span className="material-icons">close</span>
                  </span>
                  {item}
                </motion.li>
              ))}
            </ul>
            <p className={styles.typicalFootnote}>One-off project · No continuity</p>
          </motion.div>

          {/* VS divider */}
          <motion.div
            className={styles.divider}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <div className={styles.dividerLine} />
            <span className={styles.dividerBadge}>VS</span>
            <div className={styles.dividerLine} />
          </motion.div>

          {/* Per Aspera */}
          <motion.div
            className={`${styles.card} ${styles.cardPerAspera}`}
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className={styles.cardLabel}>Per Aspera — What We Do</span>
            <h3 className={styles.cardTitle}>Build, integrate &amp; scale.</h3>
            <ul className={styles.benefitList}>
              {PER_ASPERA.map((item, i) => (
                <motion.li
                  key={item}
                  className={styles.benefitItem}
                  initial={{ opacity: 0, x: 16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.45 }}
                >
                  <span className={styles.benefitIcon}>
                    <span className="material-icons">check</span>
                  </span>
                  {item}
                </motion.li>
              ))}
            </ul>
            <p className={styles.cardFootnote}>Long-term partnership · Future-ready systems</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
