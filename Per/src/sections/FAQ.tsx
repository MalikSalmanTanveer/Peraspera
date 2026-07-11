import { useState } from 'react';
import { FAQ_ITEMS } from '../data/content-extended';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-white py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile"
    >
      <Container>
        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-gap-faq">
          <Reveal>
            <div>
              <span className="section-label">FAQs</span>
              <h2 className="section-heading">Questions before starting with Peraspera?</h2>
              <p className="text-muted leading-body-lg mt-[18px]">
                Answers about Peraspera services, retainers, source files, and how we work.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-white border border-border rounded-6xl overflow-hidden">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openIndex === index;
                const buttonId = `faq-button-${index}`;
                const panelId = `faq-panel-${index}`;

                return (
                  <div key={item.question} className="border-b border-border last:border-b-0">
                    <button
                      id={buttonId}
                      type="button"
                      className="w-full px-7 py-6 bg-white border-0 text-left font-display text-lg font-extrabold cursor-pointer text-ink"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                    >
                      {item.question}
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                      className="px-7 pb-6"
                    >
                      <p className="text-base text-muted leading-body-lg">{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
