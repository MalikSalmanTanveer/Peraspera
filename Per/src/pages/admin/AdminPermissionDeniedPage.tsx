import { Link } from 'react-router-dom';
import { defaultHomeForRole } from '../../lib/adminRoles';
import { useAdminAuth } from './AdminAuthContext';

export function AdminPermissionDeniedPage() {
  const { profile } = useAdminAuth();
  const home = profile ? defaultHomeForRole(profile.role) : '/admin/login';

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-2xl font-bold text-ink">
        You do not have access to this page.
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-alt">
        Ask a Super Admin if you need a different role.
      </p>
      <Link
        to={home}
        className="mt-6 inline-flex rounded-xl bg-accent px-4 py-3 text-sm font-bold text-ink transition hover:brightness-95"
      >
        Go to your dashboard
      </Link>
    </div>
  );
}
