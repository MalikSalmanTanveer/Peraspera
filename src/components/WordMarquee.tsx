"use client";

import styles from "@/app/page.module.css";

const WORDS = [
  'Feelings', 'Experiences', 'Design', 'Craft', 'Clarity',
  'Connection', 'Intuition', 'Momentum', 'Precision', 'Presence',
  'Trust', 'Discovery', 'Simplicity', 'Depth', 'Resonance',
  'Perspective', 'Intention', 'Story', 'Flow', 'Wonder',
];

export default function WordMarquee() {
  // Render the word list twice back-to-back so the loop is seamless —
  // when the first copy scrolls fully offscreen, the second is already
  // in its exact starting position.
  const renderWords = (keyPrefix: string) =>
    WORDS.map((word, i) => {
      const isAccent = i % 4 === 0;
      return (
        <span
          key={`${keyPrefix}-${i}`}
          className={`${styles.marqueeWord} ${isAccent ? styles.marqueeWordAccent : styles.marqueeWordNormal}`}
        >
          {word}
          <span className={styles.marqueeDot} />
        </span>
      );
    });

  return (
    <section className={styles.marqueeSection}>
      <div className={styles.marqueeFade}>
        <div className={styles.marqueeTrack}>
          {renderWords('a')}
          {renderWords('b')}
        </div>
      </div>
    </section>
  );
}
