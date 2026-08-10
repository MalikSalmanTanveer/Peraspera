import { Link } from 'react-router-dom';

/**
 * Studio app is paused while the shared Supabase Auth Site URL
 * is used for the Per admin platform (invites / set-password).
 * Marketing site keeps the Creative Studio homepage section only.
 */
export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d0d0d] px-6 text-center text-white">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#fea327]">Peraspera Studio</p>
      <h1 className="mt-4 max-w-lg font-semibold text-2xl tracking-tight">Studio app is paused</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
        Team and client portal login is temporarily off so admin invites go to the main site admin
        instead of this app. The marketing homepage still shows the creative studio section.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="http://localhost:5173/admin/login"
          className="rounded-xl bg-[#fea327] px-5 py-3 text-sm font-bold text-[#0d0d0d]"
        >
          Open admin login
        </a>
        <a
          href="http://localhost:5173/"
          className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white"
        >
          Marketing site
        </a>
      </div>
      <p className="mt-6 text-xs text-white/40">
        Auth links that still open here are using the old Site URL — update Supabase Redirect URLs.
      </p>
      <Link to="/" className="sr-only">
        Home
      </Link>
    </div>
  );
}
