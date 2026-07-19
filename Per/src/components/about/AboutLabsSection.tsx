import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LABS_CONCEPTS, STATUS_STYLES, type LabsConcept } from '../../data/about-manifesto';
import { Button } from '../Button';

function LabsModal({ concept, onClose }: { concept: LabsConcept; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-nav-x backdrop-blur-sm max-md:px-nav-x-mobile"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="labs-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg rounded-3xl border border-white/12 bg-[#111] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[concept.status]}`}
            >
              {concept.status}
            </span>
            <h3 id="labs-modal-title" className="mt-4 font-display text-2xl font-extrabold text-white">
              {concept.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-3 py-1 text-sm text-overlay-white-55 transition-colors hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p className="mt-5 text-md leading-body-lg text-overlay-white-55">{concept.detail}</p>
        <div className="mt-8">
          <Link
            to="/labs"
            className="text-sm font-bold text-accent transition-colors hover:text-white"
          >
            Explore Per Aspera Labs →
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AboutLabsSection() {
  const [selected, setSelected] = useState<LabsConcept | null>(null);

  return (
    <section className="relative bg-black px-nav-x py-section-y max-md:px-nav-x-mobile max-md:py-section-y-mobile">
      <div className="mx-auto max-w-[1000px] text-center">
        <p className="text-2xs font-black uppercase tracking-[0.24em] text-accent">Per Aspera Labs</p>
        <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold text-white">
          Building Tomorrow.
        </h2>
        <p className="mx-auto mt-4 max-w-[480px] text-md-plus text-overlay-white-55">
          Ideas become prototypes.
          <br />
          Prototypes become products.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-[1000px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LABS_CONCEPTS.map((concept) => (
          <button
            key={concept.id}
            type="button"
            onClick={() => setSelected(concept)}
            className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left backdrop-blur-md transition-all duration-300 hover:border-accent/35 hover:bg-white/[0.07] hover:shadow-[0_0_32px_rgba(254,163,39,0.12)]"
          >
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-transform group-hover:scale-105 ${STATUS_STYLES[concept.status]}`}
            >
              {concept.status}
            </span>
            <h3 className="mt-5 font-display text-xl font-extrabold text-white">{concept.title}</h3>
            <p className="mt-3 text-sm leading-body text-overlay-white-55">{concept.summary}</p>
          </button>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button variant="yellow" href="/labs">
          Visit Labs ↗
        </Button>
      </div>

      <AnimatePresence>
        {selected ? <LabsModal concept={selected} onClose={() => setSelected(null)} /> : null}
      </AnimatePresence>
    </section>
  );
}
