import { TRUST_PILLS } from '../data/site';
import { Container } from '../components/Container';

export function TrustStrip() {
  return (
    <section className="bg-white border-b border-border py-trust-y px-nav-x max-md:px-nav-x-mobile">
      <Container>
        <p className="text-center text-muted leading-body max-w-[860px] mx-auto mb-6">
          Peraspera supports startups, agencies, eCommerce brands, SaaS teams, healthcare brands,
          restaurants, real estate businesses, education companies, and growing service providers.
        </p>
        <div className="flex gap-gap-xs justify-center flex-wrap">
          {TRUST_PILLS.map((pill) => (
            <span
              key={pill}
              className="font-display font-extrabold text-sm-plus border border-border rounded-pill px-[18px] py-[11px] bg-pill-bg"
            >
              {pill}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
