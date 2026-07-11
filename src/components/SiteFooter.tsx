"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./SiteFooter.module.css";

const LINK_COLUMNS = [
  {
    label: "Solutions",
    links: [
      { label: "AI & Automation", href: "#ecosystem" },
      { label: "Software Engineering", href: "#services" },
      { label: "Marketing & Growth", href: "#services" },
      { label: "Accounting & Finance", href: "#ecosystem" },
    ],
  },
  {
    label: "Products",
    links: [
      { label: "SaaS Platforms", href: "#per-aspera-core" },
      { label: "Internal Tools", href: "#services" },
      { label: "Client Portals", href: "#services" },
      { label: "Dashboards", href: "#services" },
    ],
  },
  {
    label: "Labs",
    links: [
      { label: "AI Experiments", href: "#ecosystem" },
      { label: "Prototypes", href: "#services" },
      { label: "R&D", href: "#services" },
      { label: "Innovation", href: "#per-aspera-core" },
    ],
  },
  {
    label: "Case Studies",
    links: [
      { label: "Featured Work", href: "#work" },
      { label: "Partners", href: "#partners" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Client Stories", href: "#work" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Insights", href: "#services" },
      { label: "Documentation", href: "#services" },
      { label: "Support", href: "#contact" },
      { label: "FAQ", href: "#contact" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "#per-aspera-core" },
      { label: "Careers", href: "#contact" },
      { label: "Contact", href: "#contact" },
      { label: "Press", href: "#contact" },
    ],
  },
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/MalikSalmanTanveer", icon: "code" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "work" },
  { label: "Instagram", href: "#", icon: "photo_camera" },
  { label: "Twitter", href: "#", icon: "tag" },
];

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.gridTexture} />

      <div className={styles.container}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <div className={styles.brandBlock}>
            <img src="/logo2.png" alt="Per Aspera" className={styles.logo} />
            <div className={styles.brandMeta}>
              <span className={styles.commandLabel}>Command Center</span>
              <p className={styles.brandStatement}>
                Per aspera ad astra — we build intelligent systems that endure,
                connect, and scale beyond the first launch.
              </p>
            </div>
          </div>

          <div className={styles.statusPanel}>
            <div className={styles.statusRow}>
              <span className={styles.statusDot} />
              Systems Online
            </div>
            <a className={styles.contactMail} href="mailto:hello@peraspera.com">
              hello@peraspera.com
            </a>
          </div>
        </div>

        {/* Link columns */}
        <nav className={styles.linkGrid} aria-label="Footer navigation">
          {LINK_COLUMNS.map((col) => (
            <div key={col.label}>
              <span className={styles.colLabel}>{col.label}</span>
              <ul className={styles.colLinks}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.colLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Newsletter + Socials */}
        <div className={styles.bottomRow}>
          <div className={styles.newsletterBlock}>
            <span className={styles.newsletterTitle}>Newsletter</span>
            <p className={styles.newsletterDesc}>
              Intelligence briefings on AI, automation, and building systems that last.
            </p>
            {subscribed ? (
              <p className={styles.newsletterSuccess}>
                ✓ Subscribed — welcome to the network.
              </p>
            ) : (
              <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className={styles.newsletterInput}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                />
                <button type="submit" className={styles.newsletterBtn}>
                  Subscribe
                </button>
              </form>
            )}
          </div>

          <div className={styles.socialBlock}>
            <span className={styles.socialTitle}>Connect</span>
            <div className={styles.socialGrid}>
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={styles.socialLink}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <span className="material-icons">{social.icon}</span>
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className={styles.legalBar}>
          <p>&copy; {new Date().getFullYear()} Per Aspera Agency. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="#" className={styles.legalLink}>Privacy</Link>
            <Link href="#" className={styles.legalLink}>Terms</Link>
            <Link href="#" className={styles.legalLink}>Cookies</Link>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className={styles.watermark}>
        <h2 className={styles.watermarkText}>
          PER ASPERA<span className={styles.watermarkAccent}>S</span>
        </h2>
      </div>
    </footer>
  );
}
