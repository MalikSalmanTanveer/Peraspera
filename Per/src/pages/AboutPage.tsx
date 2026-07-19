import { Link } from 'react-router-dom';
import { AboutConnectedModel } from '../components/about/AboutConnectedModel';
import { AboutObservatory } from '../components/about/AboutObservatory';
import { AboutForward } from '../components/about/AboutForward';
import { ContactForm } from '../sections/ContactForm';

export function AboutPage() {
  return (
    <div className="bg-ink text-white">
      <AboutForward />
      <AboutConnectedModel />
      <AboutObservatory />
      <ContactForm />

      <div className="border-t border-border bg-contact-bg px-nav-x py-8 text-center max-md:px-nav-x-mobile">
        <Link
          to="/"
          className="text-sm font-bold text-contact-text transition-colors hover:text-ink"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
