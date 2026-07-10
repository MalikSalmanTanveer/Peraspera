"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, MotionValue, AnimatePresence } from "framer-motion";
import Matter from "matter-js";
import {
  SiCanvas,
  SiFigma,
  SiReact,
  SiNextdotjs,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiPython,
  SiLangchain,
  SiTensorflow,
  SiHuggingface,
  SiDavinciresolve,
  SiObsstudio,
  SiDocker,
  SiMysql,
  SiMongodb,
  SiSupabase,
  SiGo,
  SiSwift,
  SiExpress,
  SiJupyter,
  SiKaggle,
  SiGooglecolab,
  SiFlutter,
  SiKotlin,
  SiAngular,
  SiFirebase,
  SiVercel,
  SiFramer,
  SiWordpress,
} from "react-icons/si";
import {
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbBrandAdobePremiere,
  TbBrandAdobeAfterEffect,
  TbBrandAdobeIndesign,
  TbBrandSketch,
  TbBrandOpenai,
  TbBrandBlender,
  TbBrandPhp,
  TbBrandAws,
  TbBrandNodejs,
  TbBrandReactNative,
  TbBrandGolang,
  TbBrandVscode,
} from "react-icons/tb";
import type { IconType } from "react-icons";

const COLORS = {
  bg: "#0D0D0D",
  wire: "#F5F5F5",
  accent: "#FFCC00",
};

interface ToolDef {
  label: string;
  Icon: IconType;
  iconColor: string;
}

interface StageDef {
  title: string;
  text: string;
  tools: ToolDef[];
}

const STAGES: StageDef[] = [
  {
    title: "Graphic Design",
    text: "Visual identity, brand systems, layout structures, and creative direction that make businesses instantly recognizable.",
    tools: [
      { label: "Photoshop", Icon: TbBrandAdobePhotoshop, iconColor: "#31A8FF" },
      { label: "Illustrator", Icon: TbBrandAdobeIllustrator, iconColor: "#FF9A00" },
      { label: "InDesign", Icon: TbBrandAdobeIndesign, iconColor: "#FF3366" },
      { label: "Figma", Icon: SiFigma, iconColor: "#F24E1E" },
      { label: "Sketch", Icon: TbBrandSketch, iconColor: "#F7B500" },
      { label: "Canva", Icon: SiCanvas, iconColor: "#00C4CC" },
      { label: "Framer", Icon: SiFramer, iconColor: "#0055FF" },
    ],
  },
  {
    title: "Web Development",
    text: "Fast, responsive, and secure web applications built on modern frameworks with production-grade performance.",
    tools: [
      { label: "React", Icon: SiReact, iconColor: "#61DAFB" },
      { label: "Next.js", Icon: SiNextdotjs, iconColor: "#FFFFFF" },
      { label: "TypeScript", Icon: SiTypescript, iconColor: "#3178C6" },
      { label: "Node.js", Icon: TbBrandNodejs, iconColor: "#339933" },
      { label: "Express", Icon: SiExpress, iconColor: "#FFFFFF" },
      { label: "Tailwind", Icon: SiTailwindcss, iconColor: "#06B6D4" },
      { label: "Angular", Icon: SiAngular, iconColor: "#DD0031" },
      { label: "MongoDB", Icon: SiMongodb, iconColor: "#47A248" },
      { label: "Firebase", Icon: SiFirebase, iconColor: "#FFCA28" },
    ],
  },
  {
    title: "AI & Automation",
    text: "Intelligent cognitive systems, language models, and agent workflows that allow businesses to automate complex operations.",
    tools: [
      { label: "OpenAI", Icon: TbBrandOpenai, iconColor: "#FFFFFF" },
      { label: "Python", Icon: SiPython, iconColor: "#3776AB" },
      { label: "LangChain", Icon: SiLangchain, iconColor: "#1C3C3C" },
      { label: "TensorFlow", Icon: SiTensorflow, iconColor: "#FF6F00" },
      { label: "HuggingFace", Icon: SiHuggingface, iconColor: "#FFD21E" },
      { label: "Jupyter", Icon: SiJupyter, iconColor: "#F37626" },
      { label: "Kaggle", Icon: SiKaggle, iconColor: "#20BEFF" },
      { label: "Google Colab", Icon: SiGooglecolab, iconColor: "#F9AB00" },
    ],
  },
  {
    title: "Video Editing",
    text: "Cinematic narratives, dynamic motion graphics, and audio synthesis crafted into high-retention commercial content.",
    tools: [
      { label: "Premiere Pro", Icon: TbBrandAdobePremiere, iconColor: "#9999FF" },
      { label: "After Effects", Icon: TbBrandAdobeAfterEffect, iconColor: "#9999FF" },
      { label: "DaVinci", Icon: SiDavinciresolve, iconColor: "#1E88E5" },
      { label: "Blender", Icon: TbBrandBlender, iconColor: "#EA7600" },
      { label: "OBS Studio", Icon: SiObsstudio, iconColor: "#FFFFFF" },
    ],
  },
];

const BG_COLORS = ["#0D0D0D", "#0A101D", "#150D1E", "#0A1B16"];
const TEXT_COLORS = ["#F5F5F5", "#F5F5F5", "#F5F5F5", "#F5F5F5"];
const MUTED_COLORS = ["#94A3B8", "#9CB3C2", "#C2A4D9", "#86C4B0"];

// Large pool of tools for cursor-following hover icons
const MORPH_TOOLS: ToolDef[] = [
  { label: "Figma", Icon: SiFigma, iconColor: "#F24E1E" },
  { label: "React", Icon: SiReact, iconColor: "#61DAFB" },
  { label: "Next.js", Icon: SiNextdotjs, iconColor: "#FFFFFF" },
  { label: "TypeScript", Icon: SiTypescript, iconColor: "#3178C6" },
  { label: "Python", Icon: SiPython, iconColor: "#3776AB" },
  { label: "OpenAI", Icon: TbBrandOpenai, iconColor: "#FFFFFF" },
  { label: "PHP", Icon: TbBrandPhp, iconColor: "#777BB4" },
  { label: "Docker", Icon: SiDocker, iconColor: "#2496ED" },
  { label: "AWS", Icon: TbBrandAws, iconColor: "#FF9900" },
  { label: "JavaScript", Icon: SiJavascript, iconColor: "#F7DF1E" },
  { label: "Photoshop", Icon: TbBrandAdobePhotoshop, iconColor: "#31A8FF" },
  { label: "Illustrator", Icon: TbBrandAdobeIllustrator, iconColor: "#FF9A00" },
  { label: "MySQL", Icon: SiMysql, iconColor: "#00758F" },
  { label: "MongoDB", Icon: SiMongodb, iconColor: "#47A248" },
  { label: "Supabase", Icon: SiSupabase, iconColor: "#3ECF8E" },
  { label: "Go", Icon: SiGo, iconColor: "#00ADD8" },
  { label: "Swift", Icon: SiSwift, iconColor: "#F05138" },
  { label: "Node.js", Icon: TbBrandNodejs, iconColor: "#339933" },
  { label: "Express", Icon: SiExpress, iconColor: "#FFFFFF" },
  { label: "React Native", Icon: TbBrandReactNative, iconColor: "#61DAFB" },
  { label: "Flutter", Icon: SiFlutter, iconColor: "#02569B" },
  { label: "Kotlin", Icon: SiKotlin, iconColor: "#7F52FF" },
  { label: "Angular", Icon: SiAngular, iconColor: "#DD0031" },
  { label: "Firebase", Icon: SiFirebase, iconColor: "#FFCA28" },
  { label: "Vercel", Icon: SiVercel, iconColor: "#FFFFFF" },
  { label: "VS Code", Icon: TbBrandVscode, iconColor: "#007ACC" },
  { label: "TensorFlow", Icon: SiTensorflow, iconColor: "#FF6F00" },
  { label: "Jupyter", Icon: SiJupyter, iconColor: "#F37626" },
  { label: "Kaggle", Icon: SiKaggle, iconColor: "#20BEFF" },
  { label: "WordPress", Icon: SiWordpress, iconColor: "#21759B" },
  { label: "Blender", Icon: TbBrandBlender, iconColor: "#EA7600" },
  { label: "Premiere", Icon: TbBrandAdobePremiere, iconColor: "#9999FF" },
  { label: "Tailwind", Icon: SiTailwindcss, iconColor: "#06B6D4" },
  { label: "Framer", Icon: SiFramer, iconColor: "#0055FF" },
  { label: "Google Colab", Icon: SiGooglecolab, iconColor: "#F9AB00" },
];

interface HoverIconState {
  tool: ToolDef;
  x: number;
  y: number;
}

/* ─── Main Section ─── */

export default function ServicesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [hoverIcon, setHoverIcon] = useState<HoverIconState | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastToolIndexRef = useRef(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const background = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [BG_COLORS[0], BG_COLORS[0], BG_COLORS[1], BG_COLORS[2], BG_COLORS[3]]
  );

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Pick a random tool that isn't the same as the last one
  const pickRandomTool = () => {
    let idx = Math.floor(Math.random() * MORPH_TOOLS.length);
    while (idx === lastToolIndexRef.current && MORPH_TOOLS.length > 1) {
      idx = Math.floor(Math.random() * MORPH_TOOLS.length);
    }
    lastToolIndexRef.current = idx;
    return MORPH_TOOLS[idx];
  };

  const handleWordMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }

    const header = headerRef.current;
    if (!header) return;

    const rect = header.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setHoverIcon((prev) => {
      if (prev) {
        return { ...prev, x, y };
      } else {
        return { tool: pickRandomTool(), x, y };
      }
    });

    fadeTimeoutRef.current = setTimeout(() => {
      setHoverIcon(null);
    }, 1000);
  };

  const handleWordMouseEnter = () => {
    // Pick a new random tool each time the cursor enters a new word
    setHoverIcon(null);
  };

  const handleWordMouseLeave = () => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
    setHoverIcon(null);
  };

  return (
    <div id="services" style={{ background: "#0D0D0D" }}>
      {/* ── Section Header ── */}
      <div
        ref={headerRef}
        style={{
          width: "100%",
          padding: "180px 24px 100px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
          boxSizing: "border-box",
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Cursor-Following Big White Icon */}
        <AnimatePresence>
          {hoverIcon && (
            <motion.div
              key={hoverIcon.tool.label}
              animate={{
                x: hoverIcon.x - 50,
                y: hoverIcon.y - 110,
              }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 280,
                mass: 0.4,
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 15,
              }}
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.92 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  filter: "drop-shadow(0px 8px 32px rgba(255, 204, 0, 0.35))",
                }}
              >
                {(() => {
                  const Icon = hoverIcon.tool.Icon;
                  return <Icon size={100} color="#FFFFFF" />;
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#6B6B6B",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Capabilities
        </p>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 6.8vw, 5.2rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: "0 0 48px",
            maxWidth: "1100px",
            textTransform: "uppercase",
            textAlign: "center",
            userSelect: "none",
          }}
        >
          {/* Line 1 */}
          <span style={{ color: COLORS.accent }}>
            WE{" "}
            <HoverWord onMove={handleWordMouseMove} onEnter={handleWordMouseEnter} onLeave={handleWordMouseLeave}>BUILD</HoverWord>{" "}
            <HoverWord onMove={handleWordMouseMove} onEnter={handleWordMouseEnter} onLeave={handleWordMouseLeave}>COHESIVE</HoverWord>{" "}
            <HoverWord onMove={handleWordMouseMove} onEnter={handleWordMouseEnter} onLeave={handleWordMouseLeave}>DIGITAL</HoverWord>{" "}
            <HoverWord onMove={handleWordMouseMove} onEnter={handleWordMouseEnter} onLeave={handleWordMouseLeave}>SYSTEMS</HoverWord>
          </span>
          <br />
          {/* Line 2 */}
          <span>
            <span style={{ color: COLORS.accent }}>AND </span>
            <HoverWord onMove={handleWordMouseMove} onEnter={handleWordMouseEnter} onLeave={handleWordMouseLeave} color={COLORS.accent}>BRAND</HoverWord>{" "}
            <HoverWord onMove={handleWordMouseMove} onEnter={handleWordMouseEnter} onLeave={handleWordMouseLeave} color={COLORS.accent}>EXPERIENCES</HoverWord>{" "}
            <span style={{ color: "#FAF4EE", animation: "blink 1s step-end infinite", marginRight: "8px" }}>_</span>
            <span style={{ color: "#FAF4EE" }}>THAT </span>
            <HoverWord onMove={handleWordMouseMove} onEnter={handleWordMouseEnter} onLeave={handleWordMouseLeave} color="#FAF4EE">HELP</HoverWord>{" "}
            <span style={{ color: "#FAF4EE" }}>YOUR</span>
          </span>
          <br />
          {/* Line 3 */}
          <span style={{ color: "#FAF4EE" }}>
            <HoverWord onMove={handleWordMouseMove} onEnter={handleWordMouseEnter} onLeave={handleWordMouseLeave} color="#FAF4EE">BUSINESS</HoverWord>{" "}
            <HoverWord onMove={handleWordMouseMove} onEnter={handleWordMouseEnter} onLeave={handleWordMouseLeave} color="#FAF4EE">GROW</HoverWord>{" "}
            <HoverWord onMove={handleWordMouseMove} onEnter={handleWordMouseEnter} onLeave={handleWordMouseLeave} color="#FAF4EE">FAST</HoverWord>
          </span>
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: COLORS.accent,
            fontFamily: "var(--font-mono)",
            fontSize: "0.875rem",
            letterSpacing: "0.05em",
          }}
        >
          <span>Scroll down to explore services</span>
          <span className="material-icons" style={{ animation: "bounceVertical 1.5s infinite" }}>
            arrow_downward
          </span>
        </div>
      </div>

      {/* ── Sticky stages ── */}
      <section
        ref={containerRef}
        style={{ position: "relative", height: `${STAGES.length * 130}vh` }}
      >
        <motion.div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            background,
            overflow: "hidden",
          }}
        >
          {/* Progress bar */}
          <div
            style={{
              position: "absolute",
              right: 40,
              top: "50%",
              transform: "translateY(-50%)",
              width: 2,
              height: 200,
              zIndex: 5,
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "rgba(107,107,107,0.25)" }} />
            <motion.div style={{ width: "100%", height: progressHeight, background: COLORS.accent }} />
          </div>

          {STAGES.map((stage, i) => (
            <ServiceStage
              key={stage.title}
              stage={stage}
              index={i}
              total={STAGES.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </motion.div>
      </section>
    </div>
  );
}

/* ─── HoverWord helper ─── */

function HoverWord({
  children,
  color,
  onMove,
  onEnter,
  onLeave,
}: {
  children: string;
  color?: string;
  onMove: (e: React.MouseEvent<HTMLSpanElement>) => void;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <span
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: "inline-block",
        cursor: "pointer",
        color: color || "inherit",
        transition: "transform 0.15s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </span>
  );
}

/* ─── Per-Stage Card ─── */

interface ServiceStageProps {
  stage: StageDef;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

function ServiceStage({ stage, index, total, scrollYProgress }: ServiceStageProps) {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  const fadeIn = start + segment * 0.2;
  const fadeOut = end - segment * 0.2;

  const opacity = useTransform(scrollYProgress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [start, fadeIn, fadeOut, end], [30, 0, 0, -30]);
  const stageScale = useTransform(scrollYProgress, [start, fadeIn, fadeOut, end], [0.97, 1, 1, 0.97]);

  const [isActive, setIsActive] = useState(index === 0);

  useEffect(() => {
    setIsActive(scrollYProgress.get() >= start && scrollYProgress.get() <= end);
    return scrollYProgress.on("change", (v) => {
      setIsActive(v >= start && v <= end);
    });
  }, [scrollYProgress, start, end]);

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        y,
        scale: stageScale,
        pointerEvents: isActive ? "auto" : "none",
        display: isActive ? "flex" : "none",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 80px 40px 80px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.85rem",
          fontWeight: 500,
          color: COLORS.accent,
          letterSpacing: "0.05em",
          marginBottom: 12,
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: TEXT_COLORS[index],
          margin: "0 0 16px",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        {stage.title}
      </h2>

      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
          lineHeight: 1.6,
          color: MUTED_COLORS[index],
          textAlign: "center",
          maxWidth: 520,
          margin: "0 0 40px",
          zIndex: 2,
        }}
      >
        {stage.text}
      </p>

      <StageBubbles tools={stage.tools} active={isActive} />
    </motion.div>
  );
}

/* ─── Physics Bubble Field ─── */

const WALL_MARGIN = 100;

function StageBubbles({ tools, active }: { tools: ToolDef[]; active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  const [ready, setReady] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const bodiesRef = useRef<{ body: Matter.Body; radius: number; tool: ToolDef }[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 300;

    const { Engine, World, Bodies, Runner, Events, Body, Vector } = Matter;

    const engine = Engine.create();
    engine.gravity.y = 0;
    engine.enableSleeping = false; // Prevent sleeping
    engineRef.current = engine;

    const wallOpts = { isStatic: true, restitution: 1.0, friction: 0, frictionStatic: 0 };
    const walls = [
      Bodies.rectangle(width / 2, -25, width, 50, wallOpts),
      Bodies.rectangle(width / 2, height + 25, width, 50, wallOpts),
      Bodies.rectangle(WALL_MARGIN - 25, height / 2, 50, height, wallOpts),
      Bodies.rectangle(width - WALL_MARGIN + 25, height / 2, 50, height, wallOpts),
    ];

    // Scale bubble size based on tool count so they all fit comfortably
    const baseRadius = tools.length > 6 ? 36 : 48;
    const radiusVariance = tools.length > 6 ? 8 : 12;

    const initialBodies = tools.map((tool) => {
      const radius = baseRadius + Math.random() * radiusVariance;

      const minX = WALL_MARGIN + radius + 10;
      const maxX = width - WALL_MARGIN - radius - 10;
      const x = Math.random() * (maxX - minX) + minX;
      const y = Math.random() * (height - radius * 2) + radius;

      const body = Bodies.circle(x, y, radius, {
        restitution: 1.0,
        friction: 0,
        frictionStatic: 0,
        frictionAir: 0,
        inertia: Infinity,
      });

      const speed = 1.2 + Math.random() * 0.8;
      const angle = Math.random() * Math.PI * 2;
      Body.setVelocity(body, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      });

      return { body, radius, tool };
    });

    bodiesRef.current = initialBodies;
    World.add(engine.world, [...walls, ...initialBodies.map((b) => b.body)]);

    Events.on(engine, "beforeUpdate", () => {
      const mouse = mousePosRef.current;

      bodiesRef.current.forEach(({ body }) => {
        // ── Cursor Repulsion ──
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = body.position.x - mouse.x;
          const dy = body.position.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const strength = (1 - dist / 180) * 0.05 * 0.06;
            Body.applyForce(body, body.position, {
              x: (dx / (dist || 1)) * strength,
              y: (dy / (dist || 1)) * strength,
            });
          }
        }

        // ── Perpetual Brownian Motion Force ──
        // A tiny random force on every frame keeps bubbles wiggling and prevents locking
        const driftAngle = Math.random() * Math.PI * 2;
        const driftStrength = 0.00015 * body.mass;
        Body.applyForce(body, body.position, {
          x: Math.cos(driftAngle) * driftStrength,
          y: Math.sin(driftAngle) * driftStrength,
        });

        // ── Velocity Speed Booster / Cap ──
        const spd = Vector.magnitude(body.velocity);
        if (spd < 1.3) {
          if (spd === 0) {
            // Kick in a random direction if completely stopped
            const a = Math.random() * Math.PI * 2;
            Body.setVelocity(body, { x: Math.cos(a) * 1.5, y: Math.sin(a) * 1.5 });
          } else {
            // Smoothly boost speed to 1.5 in the current direction of motion
            Body.setVelocity(body, {
              x: (body.velocity.x / spd) * 1.5,
              y: (body.velocity.y / spd) * 1.5,
            });
          }
        } else if (spd > 3.2) {
          // Cap maximum speed
          Body.setVelocity(body, {
            x: (body.velocity.x / spd) * 2.5,
            y: (body.velocity.y / spd) * 2.5,
          });
        }

        // ── Wall Correction Nudges ──
        const insetLeft = WALL_MARGIN + 12;
        const insetRight = width - WALL_MARGIN - 12;
        if (body.position.x < insetLeft) {
          Body.applyForce(body, body.position, { x: 0.002, y: 0 });
        } else if (body.position.x > insetRight) {
          Body.applyForce(body, body.position, { x: -0.002, y: 0 });
        }
        if (body.position.y < 12) {
          Body.applyForce(body, body.position, { x: 0, y: 0.002 });
        } else if (body.position.y > height - 12) {
          Body.applyForce(body, body.position, { x: 0, y: -0.002 });
        }
      });
    });

    const runner = Runner.create();
    Runner.run(runner, engine);
    runnerRef.current = runner;

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || 300;
      Body.setPosition(walls[0], { x: w / 2, y: -25 });
      Body.setPosition(walls[1], { x: w / 2, y: h + 25 });
      Body.setPosition(walls[2], { x: WALL_MARGIN - 25, y: h / 2 });
      Body.setPosition(walls[3], { x: w - WALL_MARGIN + 25, y: h / 2 });
    };
    window.addEventListener("resize", handleResize);

    let frameId: number;
    const sync = () => {
      bodiesRef.current.forEach(({ body, radius }, i) => {
        const el = bubbleRefs.current[i];
        if (el) {
          el.style.transform = `translate(${body.position.x - radius}px, ${body.position.y - radius}px)`;
          el.style.width = `${radius * 2}px`;
          el.style.height = `${radius * 2}px`;
        }
      });
      frameId = requestAnimationFrame(sync);
    };
    sync();
    setReady(true);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [tools]);

  useEffect(() => {
    if (runnerRef.current) runnerRef.current.enabled = active;
  }, [active]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mousePosRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onMouseLeave = () => { mousePosRef.current = { x: -1000, y: -1000 }; setHoveredIndex(null); };
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (e.touches.length) mousePosRef.current = { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
  };
  const onTouchEnd = () => { mousePosRef.current = { x: -1000, y: -1000 }; };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ position: "relative", width: "100%", height: 300, pointerEvents: active ? "auto" : "none", cursor: "default" }}
    >
      {tools.map((tool, i) => {
        const Icon = tool.Icon;
        const hovered = hoveredIndex === i;
        const border = hovered ? tool.iconColor : `${tool.iconColor}3a`;
        const shadow = hovered ? `0 0 24px ${tool.iconColor}50` : "none";

        return (
          <div
            key={`${tool.label}-${i}`}
            ref={(el) => { bubbleRefs.current[i] = el; }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              borderRadius: "50%",
              border: `1.5px solid ${border}`,
              background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
              display: ready ? "flex" : "none",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              userSelect: "none",
              backdropFilter: "blur(2px)",
              boxShadow: shadow,
              transition: "box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
            }}
          >
            <Icon size={24} color={tool.iconColor} />
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "10px",
                fontWeight: 600,
                color: "#F5F5F5",
                opacity: hovered ? 0.85 : 0,
                maxHeight: hovered ? "20px" : "0px",
                transform: hovered ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.25s ease, transform 0.25s ease, max-height 0.25s ease",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {tool.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
