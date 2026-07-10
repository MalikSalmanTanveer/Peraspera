"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

interface ReviewItem {
  id: number;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
}

const REVIEWS: ReviewItem[] = [
  {
    id: 1,
    name: "Hudson Vinicius",
    role: "Program Partnership",
    company: "@Activision",
    text: "They match the pace of our slate demands—polished interaction design, pragmatic scope, and craft in the details players and partners notice. Communication stayed sharp the whole way.",
    rating: 5,
  },
  {
    id: 2,
    name: "Kaio Silva",
    role: "Solutions Partnership",
    company: "@Nvidia",
    text: "Our intelligent features needed production rigor, not a one-off demo. Peraspera helped shape the flows, wire the stack, and ship assistants we could trust with real workloads.",
    rating: 5,
  },
  {
    id: 3,
    name: "Luana Freiere",
    role: "Product Collaboration",
    company: "@Samsung",
    text: "We needed to move fast without losing visual craft. They functioned like an extension of our core team, running daily rituals, and refining flows on the fly. Incredible execution.",
    rating: 5,
  },
  {
    id: 4,
    name: "Aliza Craig",
    role: "Marketing Director",
    company: "@Vercel",
    text: "The custom web development team brought our rebranding to life. The page speeds are blistering, the animations are buttery, and our conversion rate went up by 30% immediately.",
    rating: 5,
  },
  {
    id: 5,
    name: "Marcus Thorne",
    role: "Product Lead",
    company: "@Framer",
    text: "They delivered an exceptional layout structure and rapid prototyping system. The level of design fidelity combined with solid, high-performance React code is rare to find.",
    rating: 5,
  },
  {
    id: 6,
    name: "Sophie Laurent",
    role: "Co-Founder",
    company: "@Lollipops",
    text: "From initial branding concepts to a full-fledged e-commerce launch, the visual direction was flawless. They made our business stand out in a crowded market with simplicity and depth.",
    rating: 5,
  },
  {
    id: 7,
    name: "Vikram Mehta",
    role: "CTO",
    company: "@StellarRealEstate",
    text: "They translated our complex property search filters into an intuitive, elegant dashboard. Excellent communication, prompt delivery, and highly recommended for premium systems.",
    rating: 5,
  },
  {
    id: 8,
    name: "Elena Rostova",
    role: "Creative Director",
    company: "@SlapMedia",
    text: "Cinema-grade transitions, retaining viewers on commercial content. The video post-production was delivered ahead of schedule with flawless motion graphics and sound synthesis.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(REVIEWS);
  const [exitingId, setExitingId] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<number>(1); // 1 = right, -1 = left

  // Motion values for drag tracking on the active card
  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-200, 200], [-12, 12]);
  const dragScale = useTransform(dragX, [-200, 200], [0.95, 1.05]);

  const handleSwipe = (direction: number) => {
    if (exitingId !== null) return; // Prevent double trigger during animation

    const firstItem = reviewsList[0];
    setExitingId(firstItem.id);
    setSwipeDirection(direction);

    // After animation completes, cycle the array
    setTimeout(() => {
      setReviewsList((prev) => {
        const [, ...rest] = prev;
        return [...rest, firstItem];
      });
      dragX.set(0); // Reset drag position for the new top card
      setExitingId(null);
    }, 400);
  };

  const handleNext = () => {
    handleSwipe(1); // Swipe to the right on click
  };

  const activeReviews = reviewsList.slice(0, 3);

  return (
    <section
      id="testimonials"
      style={{
        width: "100%",
        padding: "160px 0 140px",
        backgroundImage: "linear-gradient(rgba(10, 10, 10, 0.85), rgba(10, 10, 10, 0.85)), url('/review.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container">
        {/* Main Glassmorphic Wrapper */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "60px",
            background: "rgba(255, 204, 0, 0.04)",
            border: "1px solid rgba(255, 204, 0, 0.15)",
            borderRadius: "24px",
            padding: "60px 48px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(255, 204, 0, 0.02)",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* Left Column: Heading & Controls */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            {/* Big quote mark */}
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "7rem",
                fontWeight: 900,
                color: "#FFCC00",
                lineHeight: 0.1,
                marginBottom: "20px",
                display: "block",
              }}
            >
              “
            </span>

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
              Testimonials
            </p>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 700,
                color: "#F5F5F5",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                margin: "0 0 24px",
              }}
            >
              What our clients say about us.
            </h2>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.05rem",
                lineHeight: 1.6,
                color: "#94A3B8",
                margin: "0 0 40px",
                maxWidth: "400px",
              }}
            >
              We function as a collaborative product partner, helping digital leaders wire the stack, wire the brand, and ship experiences that convert.
            </p>

            {/* Interactive Controller button */}
            <div style={{ display: "flex", gap: "16px" }}>
              <button
                onClick={handleNext}
                style={{
                  background: "#FFCC00",
                  border: "none",
                  borderRadius: "50%",
                  width: "56px",
                  height: "56px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(255, 204, 0, 0.35)",
                  transition: "background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FFD700";
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(255, 204, 0, 0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFCC00";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 204, 0, 0.35)";
                }}
              >
                <span className="material-icons" style={{ fontSize: "1.6rem" }}>
                  arrow_forward
                </span>
              </button>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  color: "#6B6B6B",
                  display: "flex",
                  alignItems: "center",
                  letterSpacing: "0.05em",
                }}
              >
                Swipe card or click button to cycle reviews
              </span>
            </div>
          </div>

          {/* Right Column: Stacked Shuffle Deck */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "460px",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "360px" }}>
              {activeReviews.map((review, index) => {
                const isFirst = index === 0;
                const isExiting = isFirst && exitingId === review.id;

                // Testimonial cards are styled in high-contrast off-white (#FAF4EE)
                // mimicking the template cards in the reference image.
                return (
                  <motion.div
                    key={review.id}
                    drag={isFirst ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.9}
                    onDragEnd={(e, info) => {
                      if (Math.abs(info.offset.x) > 130) {
                        const swipeDir = info.offset.x > 0 ? 1 : -1;
                        handleSwipe(swipeDir);
                      }
                    }}
                    style={{
                      position: "absolute",
                      width: "100%",
                      maxWidth: "460px",
                      background: "#FAF4EE",
                      borderRadius: "20px",
                      padding: "36px",
                      boxShadow: isFirst
                        ? "0 30px 60px rgba(0, 0, 0, 0.45)"
                        : "0 15px 30px rgba(0, 0, 0, 0.2)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxSizing: "border-box",
                      transformOrigin: "bottom center",
                      top: 0,
                      left: 0,
                      cursor: isFirst ? "grab" : "default",
                      x: isFirst ? dragX : 0,
                      rotate: isFirst ? dragRotate : index === 0 ? 0 : index === 1 ? -3 : 2,
                    }}
                    animate={
                      isExiting
                        ? {
                            x: swipeDirection * 350,
                            rotate: swipeDirection * 15,
                            opacity: 0,
                            scale: 0.9,
                          }
                        : {
                            // Stack offsets
                            y: index * 14,
                            scale: 1 - index * 0.04,
                            zIndex: 10 - index,
                            opacity: 1,
                          }
                    }
                    whileTap={isFirst ? { cursor: "grabbing", scale: 1.02 } : {}}
                    whileHover={isFirst ? { scale: 1.01 } : {}}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  >
                    {/* Stars Block */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[...Array(review.rating)].map((_, starIdx) => (
                          <span
                            key={starIdx}
                            style={{ color: "#FFCC00", fontSize: "1.1rem" }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "#FFCC00",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}
                      >
                        Verified Client
                      </span>
                    </div>

                    {/* Testimonial Quote */}
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(0.9rem, 2vw, 1.02rem)",
                        lineHeight: 1.55,
                        color: "#1A1A1A", // high contrast on white card
                        fontWeight: 500,
                        margin: "24px 0 28px",
                        userSelect: "none",
                      }}
                    >
                      "{review.text}"
                    </p>

                    {/* Client Info block */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {/* Avatar initial bubble */}
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: "#FFCC00",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#FFFFFF",
                          fontFamily: "var(--font-display)",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          userSelect: "none",
                        }}
                      >
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            color: "#1A1A1A",
                            margin: "0 0 2px",
                            userSelect: "none",
                          }}
                        >
                          {review.name}
                        </h4>
                        <p
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.72rem",
                            color: "#6B6B6B",
                            margin: 0,
                            letterSpacing: "0.02em",
                            userSelect: "none",
                          }}
                        >
                          {review.role} <span style={{ color: "#FFCC00" }}>{review.company}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
