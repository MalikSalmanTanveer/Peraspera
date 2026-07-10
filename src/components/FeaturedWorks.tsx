"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WorkProject {
  id: number;
  title: string;
  category: string;
  collaboration: string;
  image: string;
  review: string;
}

const PROJECTS: WorkProject[] = [
  {
    id: 1,
    title: "You Tried It.Co",
    category: "Digital Program",
    collaboration: "Strategic collaboration @YouTriedIt",
    image: "/works/1.png",
    review: "They match the pace of our demands—polished interaction design, pragmatic scope, and craft in the details players and partners notice. Communication stayed sharp.",
  },
  {
    id: 2,
    title: "Opal Properties Dubai",
    category: "Platform Partnership",
    collaboration: "Product & growth partnership @OpalDubai",
    image: "/works/2.png",
    review: "Our features needed production rigor, not a one-off demo. Per Aspera helped shape the flows, wire the stack, and ship assistants we could trust with real workloads.",
  },
  {
    id: 3,
    title: "Manchester Est Clothing",
    category: "Engineering Focus",
    collaboration: "Technology program @McrClothing",
    image: "/works/3.png",
    review: "We needed to move fast without losing visual craft. They functioned like an extension of our core team, running daily rituals, and refining flows on the fly.",
  },
  {
    id: 4,
    title: "Erasmus+ Initiative",
    category: "Product Collaboration",
    collaboration: "Program partnership @Erasmus",
    image: "/works/4.png",
    review: "They delivered an exceptional product lifecycle that exceeded our constraints. The team understands simple layout structures, rapid prototyping, and clean code.",
  },
];

export default function FeaturedWorks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeProject, setActiveProject] = useState<WorkProject | null>(null);

  // Staggered base angles for the stacked overlapping deck
  const baseRotations = [-6, -2, 2, 6];

  return (
    <section
      id="work"
      style={{
        width: "100%",
        padding: "140px 0 160px",
        backgroundImage: "linear-gradient(rgba(8, 8, 8, 0.88), rgba(8, 8, 8, 0.88)), url('/works-bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorative Blur Grid */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "60%",
          background: "radial-gradient(ellipse at center, rgba(255, 204, 0, 0.03), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header Block */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#FFCC00",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Portfolio
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 700,
              color: "#F5F5F5",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Featured Projects & Collaborations
          </h2>
        </div>

        {/* Stacked Interactive Card Deck */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "580px",
            position: "relative",
          }}
        >
          {PROJECTS.map((project, idx) => {
            const isHovered = hoveredIndex === idx;
            const anyHovered = hoveredIndex !== null;

            // Calculate x displacement and rotation based on hovered state
            let xOffset = 0;
            let rotation = baseRotations[idx];
            let scale = 1;
            let yOffset = 0;
            let zIndex = idx + 1;

            if (anyHovered) {
              if (isHovered) {
                // Hovered card lifts up, scales, and straightens
                yOffset = -40;
                scale = 1.05;
                rotation = 0;
                zIndex = 20;
              } else {
                // Non-hovered cards disperse left and right
                const dir = idx < hoveredIndex ? -1 : 1;
                xOffset = dir * 140; // Push aside horizontally
                rotation = baseRotations[idx] + dir * 6; // Fan out angle
                scale = 0.93;
                opacity: 0.5;
              }
            } else {
              // Default state: overlapping horizontally
              xOffset = (idx - 1.5) * 160; // Overlapping layout offset
            }

            return (
              <motion.div
                key={project.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setActiveProject(project)}
                animate={{
                  x: xOffset,
                  y: yOffset,
                  rotate: rotation,
                  scale,
                  zIndex,
                }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 24,
                  mass: 0.8,
                }}
                style={{
                  position: "absolute",
                  width: "360px",
                  background: "#161618",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: isHovered
                    ? "0 30px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 204, 0, 0.25)"
                    : "0 15px 35px rgba(0, 0, 0, 0.6)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                  transformOrigin: "bottom center",
                  opacity: anyHovered && !isHovered ? 0.6 : 1,
                  transition: "opacity 0.4s ease, border-color 0.3s ease",
                }}
              >
                {/* Card Top: Stars & Status */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        style={{ color: "#FFCC00", fontSize: "1rem" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      padding: "4px 10px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        color: "#94A3B8",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Case Study
                    </span>
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#FFCC00",
                      }}
                    />
                  </div>
                </div>

                {/* Card Image Container */}
                <div
                  style={{
                    width: "100%",
                    height: "170px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    margin: "18px 0",
                    background: "#080808",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                </div>

                {/* Card Testimonial/Review */}
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    color: "#E2E8F0",
                    margin: "0 0 20px",
                    fontStyle: "italic",
                    flexGrow: 1,
                  }}
                >
                  "{project.review}"
                </p>

                {/* Card Divider */}
                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    background: "rgba(255,255,255,0.06)",
                    margin: "0 0 16px",
                  }}
                />

                {/* Card Bottom Meta */}
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      margin: "0 0 4px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {project.category}
                  </h4>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: "#FFCC00",
                      margin: 0,
                    }}
                  >
                    {project.collaboration}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Lightbox Image Zoom Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(8, 8, 8, 0.95)",
              backdropFilter: "blur(15px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              cursor: "zoom-out",
              padding: "40px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
              }}
            >
              <img
                src={activeProject.image}
                alt={activeProject.title}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "85vh",
                  objectFit: "contain",
                  display: "block",
                }}
              />

              {/* Close Button overlay */}
              <button
                onClick={() => setActiveProject(null)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  transition: "background 0.3s ease, transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,107,53,0.8)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0,0,0,0.5)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
