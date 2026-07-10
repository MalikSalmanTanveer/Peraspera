"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Fraunces } from "next/font/google";
import styles from "./EcosystemIndex.module.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
});

const MODULES = [
  { title: "Cloud", tag: "Infrastructure", desc: "Secure, scalable and reliable cloud infrastructure." },
  { title: "Accounting", tag: "Finance", desc: "Smart accounting, bookkeeping and financial automation." },
  { title: "Analytics", tag: "Insight", desc: "Real-time insights that help you make better decisions." },
  { title: "Automation", tag: "Operations", desc: "Streamline workflows and eliminate manual tasks." },
  { title: "Software", tag: "Engineering", desc: "Custom software that solves real business problems." },
  { title: "CRM", tag: "Relationships", desc: "Manage relationships and grow customer loyalty." },
  { title: "Marketing", tag: "Growth", desc: "Data-driven marketing that attracts and converts." },
  { title: "SaaS", tag: "Product", desc: "Scalable SaaS products built for growth." },
  { title: "AI Agents", tag: "Intelligence", desc: "Intelligent agents that think, learn and automate for you." },
];

const STRIP = [
  { label: "01", title: "Fully Connected", desc: "Every module works together in perfect sync to power your business." },
  { label: "02", title: "Built for Scale", desc: "From startups to enterprises, our ecosystem grows with your ambition." },
  { label: "03", title: "Future Ready", desc: "Modern technology, continuous innovation, and a vision for tomorrow." },
];

export default function EcosystemIndex() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const highlightIndex = hoveredIndex ?? activeIndex;

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    rowRefs.current.forEach((row, idx) => {
      if (!row) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && hoveredIndex === null) {
            setActiveIndex(idx);
          }
        },
        { threshold: 0.55 }
      );
      obs.observe(row);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [hoveredIndex]);

  const railTop = ((highlightIndex + 0.5) / MODULES.length) * 100;
  const progressWidth = ((highlightIndex + 1) / MODULES.length) * 100;

  return (
    <section
      ref={sectionRef}
      id="ecosystem"
      className={`${styles.section} ${fraunces.variable}`}
    >
      <motion.div
        className={styles.masthead}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05, duration: 0.6 }}
          >
            Our Ecosystem — Index 01–09
          </motion.span>
          <motion.h2
            className={styles.headline}
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Nine disciplines.
            <br />
            One system.
          </motion.h2>
        </div>
        <motion.p
          className={styles.introCopy}
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.18, duration: 0.7 }}
        >
          Every solution we build is designed to connect —{" "}
          <strong>a deliberate set of tools</strong> engineered to communicate,
          share context, and work as a single intelligent whole.
        </motion.p>
      </motion.div>

      <div className={styles.index}>
        <div
          className={styles.indexProgress}
          style={{ width: `${progressWidth}%` }}
        />

        <div className={styles.rail}>
          {MODULES.map((_, i) => (
            <div
              key={i}
              className={`${styles.railTick} ${highlightIndex === i ? styles.railTickActive : ""}`}
              style={{ top: `${((i + 0.5) / MODULES.length) * 100}%` }}
            />
          ))}
          <div className={styles.railActive} style={{ top: `${railTop}%` }} />
        </div>

        {MODULES.map((mod, i) => (
          <motion.div
            key={mod.title}
            ref={(el) => { rowRefs.current[i] = el; }}
            className={`${styles.row} ${highlightIndex === i ? styles.rowActive : ""}`}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className={styles.rowHover} />
            <span className={styles.rowGhost}>{mod.title}</span>
            <span className={styles.rowNum}>0{i + 1}</span>
            <div className={styles.rowMain}>
              <h3 className={styles.rowTitle}>{mod.title}</h3>
              <p className={styles.rowDesc}>{mod.desc}</p>
            </div>
            <span className={styles.rowTag}>{mod.tag}</span>
            <span className={styles.rowArrow}>→</span>
          </motion.div>
        ))}

        <motion.div
          className={styles.closing}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          <div>
            <span className={styles.closingLabel}>Where It Converges</span>
            <h3 className={styles.closingTitle}>The Intelligence Core.</h3>
          </div>
          <p className={styles.closingNote}>
            Every module above feeds one connected system — built to think, adapt,
            and scale with the business.
          </p>
        </motion.div>
      </div>

      <div className={styles.strip}>
        {STRIP.map((item, i) => (
          <motion.div
            key={item.label}
            className={styles.stripItem}
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.75 + i * 0.1, duration: 0.5 }}
            whileHover={{ y: -2 }}
          >
            <span className={styles.stripLabel}>{item.label}</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
