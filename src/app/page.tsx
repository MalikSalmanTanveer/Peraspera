import Link from "next/link";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import HeroBackground from "@/components/HeroBackground";
import TypewriterHeading from "@/components/TypewriterHeading";
import WordMarquee from "@/components/WordMarquee";
import ServicesSection from "@/components/ServicesSection";
import FeaturedWorks from "@/components/FeaturedWorks";
import TrustedPartners from "@/components/TrustedPartners";
import TestimonialsSection from "@/components/TestimonialsSection";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      {/* 1. Preloader Counter & Sliding Texts */}
      <Preloader />

      {/* 2. Custom Dual Cursor (Dot & Lerped Outline) */}
      <CustomCursor />

      {/* 3. Capsule Sticky Navbar */}
      <nav className={`${styles.navContainer} glass`}>
        <Link href="#" className={styles.navLogo}>
          <img src="/logo2.png" alt="Per Aspera Logo" className={styles.logoImage} />
        </Link>
        
        <div className={styles.navLinks}>
          <Link href="#work" className={styles.navLink}>Work</Link>
          <Link href="#partners" className={styles.navLink}>Partners</Link>
          <Link href="#testimonials" className={styles.navLink}>Reviews</Link>
          <Link href="#services" className={styles.navLink}>Services</Link>
          <Link href="#about" className={styles.navLink}>About</Link>
        </div>

        <Link href="#contact" className={styles.navCTA}>
          Let's Talk
        </Link>
      </nav>

      {/* 4. Hero Section with 3D Particles & Cube Background */}
      <section className={styles.hero}>
        <HeroBackground nodeCount={24} rotationSpeed={1.2} />

        <div className={`${styles.heroContent} container`}>
          {/* Availability Badge */}
          <div className={`${styles.badge} glass`}>
            <span className={styles.badgePulse}>
              <span className={styles.badgePing}></span>
              <span className={styles.badgeDot}></span>
            </span>
            <span className={styles.badgeText}>Available for new projects</span>
          </div>

          {/* Hero Heading */}
          <h1 className={styles.heroTitle}>
            WE CREATE <br />
            <TypewriterHeading 
              words={[
                "Feelings.", 
                "Experiences.", 
                "Design.", 
                "Clarity.", 
                "Connection.", 
                "Simplicity.", 
                "Depth."
              ]} 
            />
          </h1>

          {/* Subtitle */}
          <p className={styles.heroSubtitle}>
            We are a digital product agency that crafts immersive digital experiences for ambitious brands.
          </p>

          {/* Explore Circular Button */}
          <Link href="#work" className={styles.exploreBtn}>
            <div className={styles.exploreBtnWipe} />
            <div className={styles.exploreInner}>
              <span className={`material-icons ${styles.exploreIcon}`}>arrow_downward</span>
              <span className={styles.exploreText}>Explore</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4.5 Kinetic Word Marquee */}
      <WordMarquee />

      {/* 5. Services — Scroll-driven stages with physics bubbles */}
      <ServicesSection />

      {/* 5.5 Featured Works — Overlapping interactive cases with zoom lightbox */}
      <FeaturedWorks />

      {/* 6. Trusted Partners (Brand Logo Marquees) */}
      <TrustedPartners />

      {/* 6.5 Testimonials — Interactive card shuffle with review.png background */}
      <TestimonialsSection />

      {/* 7. Footer Section */}
      <footer id="contact" className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div>
              <h3 className={styles.footerCTA}>Ready to start?</h3>
              <a className={styles.footerMail} href="mailto:hello@peraspera.com">
                hello@peraspera.com
              </a>
            </div>
            
            <div className={styles.footerLinks}>
              <Link href="#" className={styles.footerLink}>Instagram</Link>
              <Link href="#" className={styles.footerLink}>Twitter</Link>
              <Link href="#" className={styles.footerLink}>LinkedIn</Link>
              <Link href="#" className={styles.footerLink}>Dribbble</Link>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} Per Aspera Agency.</p>
            <div className={styles.footerBottomLinks}>
              <Link href="#" className={styles.footerSubLink}>Privacy</Link>
              <Link href="#" className={styles.footerSubLink}>Terms</Link>
            </div>
          </div>
        </div>

        {/* Huge Heading Ticker overlay at the bottom */}
        <div className={styles.footerHugeText}>
          <h1 className={styles.hugeHeading}>
            PER ASPERA<span className={styles.orangeLetter}>S</span>
          </h1>
        </div>
      </footer>
    </>
  );
}
