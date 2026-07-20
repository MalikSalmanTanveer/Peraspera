import { PROCESS_STEPS } from '../data/content';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';

export function ProcessSteps() {
  return (
    <section className="bg-ink text-white py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile">
      <Container>
        <Reveal>
          <SectionHeader
            label="Our Process"
            title="From idea to launch with a simple creative workflow."
            description="We keep every project clear, organized, and focused on business outcomes."
            light
          />
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 3xl:grid-cols-5 border border-overlay-step-border rounded-7xl overflow-hidden">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.number}
                className={`group relative p-[34px_24px] min-h-[255px] bg-dark-elevated border-overlay-step-border transition-[background-color,box-shadow] duration-300 ease-out hover:bg-[#141414] hover:shadow-[inset_0_0_36px_rgba(254,163,39,0.09),0_0_22px_rgba(254,163,39,0.06)] ${i < PROCESS_STEPS.length - 1 ? '3xl:border-r sm:border-b 3xl:border-b-0' : ''} ${i % 2 === 0 ? 'sm:border-r 3xl:border-r' : 'sm:border-r-0'} border-b last:border-b-0 3xl:last:border-r-0`}
              >
                <b className="font-display text-sm-plus text-accent transition-[color,filter] duration-300 group-hover:brightness-110">
                  {step.number}
                </b>
                <h3 className="font-display text-2xl font-extrabold mt-[34px] mb-2.5 transition-colors duration-300 group-hover:text-white">
                  {step.title}
                </h3>
                <p className="text-sm-plus text-overlay-white-46 leading-body transition-colors duration-300 group-hover:text-overlay-white-55">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
