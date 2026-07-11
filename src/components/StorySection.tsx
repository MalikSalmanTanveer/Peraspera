"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const STAGES = [
  {
    title: "Freelancer",
    text: "It started with one person, one laptop, and a willingness to learn anything a client needed.",
  },
  {
    title: "Consultant",
    text: "Experience across industries turned into judgment — knowing not just how to build, but what to build.",
  },
  {
    title: "Creative Professional",
    text: "Design and craft became inseparable from the work itself — not decoration, but part of the thinking.",
  },
  {
    title: "Technology Partner",
    text: "Clients stopped hiring a freelancer. They started partnering with someone invested in their growth.",
  },
  {
    title: "AI Innovation Company",
    text: "Every project began asking the same question: how do we make this business think, not just run?",
  },
  {
    title: "Technology Ecosystem",
    text: "Per Aspera — a connected system where businesses manage, automate, and scale in one place.",
  },
];

const BG_COLORS = ["#0D0D0D", "#2A1B0F", "#5C3A1A", "#A8622A", "#E89A4D", "#FFF4E8"];
const TEXT_COLORS = ["#F5F5F5", "#F5F5F5", "#F5F5F5", "#1A1A1A", "#1A1A1A", "#1A1A1A"];
const MUTED_COLORS = ["#6B6B6B", "#6B6B6B", "#8A7A6A", "#3A2A1A", "#3A2A1A", "#3A2A1A"];

interface StageBlockProps {
  stage: { title: string; text: string };
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

function StageBlock({ stage, index, total, scrollYProgress }: StageBlockProps) {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  const fadeIn = start + segment * 0.15;
  const fadeOut = end - segment * 0.15;

  const opacity = useTransform(scrollYProgress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [start, fadeIn, fadeOut, end], [24, 0, 0, -24]);
  const textColor = TEXT_COLORS[index];
  const mutedColor = MUTED_COLORS[index];

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 24,
        right: 24,
        top: "50%",
        translateY: "-50%",
        opacity,
        y,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "#F59531",
          marginBottom: 16,
          letterSpacing: "0.05em",
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: textColor,
          margin: "0 0 20px",
        }}
      >
        {stage.title}
      </h2>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
          lineHeight: 1.6,
          color: mutedColor,
          maxWidth: 480,
          margin: 0,
        }}
      >
        {stage.text}
      </p>
    </motion.div>
  );
}

export default function StorySection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const background = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], BG_COLORS);
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="about"
      ref={containerRef}
      style={{ position: "relative", height: `${STAGES.length * 100}vh` }}
    >
      <motion.div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          background,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Progress line */}
        <div
          style={{
            position: "absolute",
            right: 48,
            top: "50%",
            transform: "translateY(-50%)",
            width: 2,
            height: 220,
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "rgba(107,107,107,0.25)" }} />
          <motion.div style={{ width: "100%", height: progressHeight, background: "#F59531" }} />
        </div>

        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            width: "100%",
          }}
        >
          {STAGES.map((stage, i) => (
            <StageBlock
              key={stage.title}
              stage={stage}
              index={i}
              total={STAGES.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
