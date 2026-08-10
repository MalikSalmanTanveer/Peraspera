import { type ReactNode, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  ChevronDown,
  FileText,
  Heart,
  LayoutGrid,
  LogOut,
  Mail,
  PenLine,
  Users,
} from 'lucide-react';
import { LiveBadge } from '../../components/admin/LiveBadge';
import { subscribeCareerApplicationSignals } from '../../lib/careerRealtime';
import {
  ADMIN_ROLE_LABELS,
  canAccessBlog,
  canAccessHiring,
  canAccessUsers,
  type AdminRole,
} from '../../lib/adminRoles';
import { useAdminAuth } from './AdminAuthContext';

type NavItem = {
  to: string;
  label: string;
  Icon: typeof FileText;
  badge?: 'applications';
};

type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

function groupsForRole(role: AdminRole): NavGroup[] {
  const groups: NavGroup[] = [];

  if (canAccessUsers(role)) {
    groups.push({
      id: 'platform',
      label: 'Platform',
      items: [{ to: '/admin/users', label: 'Users', Icon: Users }],
    });
  }

  if (canAccessHiring(role)) {
    groups.push({
      id: 'hiring',
      label: 'Hiring',
      items: [
        { to: '/admin/hiring/overview', label: 'Overview', Icon: LayoutGrid },
        {
          to: '/admin/hiring/applications',
          label: 'Applications',
          Icon: FileText,
          badge: 'applications',
        },
        { to: '/admin/hiring/jobs', label: 'Jobs', Icon: Briefcase },
        { to: '/admin/hiring/culture', label: 'Culture', Icon: Heart },
        { to: '/admin/hiring/departments', label: 'Departments', Icon: Building2 },
        { to: '/admin/hiring/templates', label: 'Templates', Icon: Mail },
      ],
    });
  }

  if (canAccessBlog(role)) {
    groups.push({
      id: 'blog',
      label: 'Blog',
      items: [{ to: '/admin/blog', label: 'Posts', Icon: PenLine }],
    });
  }

  return groups;
}

function initials(username: string): string {
  const parts = username.trim().split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return 'AD';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { profile, signOut } = useAdminAuth();
  const [live, setLive] = useState(false);
  const [alert, setAlert] = useState(false);
  const [appBadge, setAppBadge] = useState(0);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    platform: true,
    hiring: true,
    blog: true,
  });

  const role = profile?.role ?? 'hiring_manager';
  const groups = groupsForRole(role);
  const showLive = canAccessHiring(role);

  useEffect(() => {
    if (!showLive) return;

    setLive(true);
    const audioCtxRef: { current: AudioContext | null } = { current: null };

    const playPing = () => {
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.value = 0.04;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } catch {
        /* ignore */
      }
    };

    const unsubscribe = subscribeCareerApplicationSignals(() => {
      setAlert(true);
      setAppBadge((n) => n + 1);
      playPing();
      window.setTimeout(() => setAlert(false), 2500);
    });

    return () => {
      setLive(false);
      unsubscribe();
      void audioCtxRef.current?.close();
    };
  }, [showLive]);

  const onLogout = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <aside className="flex w-full flex-col border-b border-[#e8e8e8] bg-white md:w-[220px] md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-display text-sm font-extrabold text-ink">
            P
          </span>
          <span className="font-display text-[15px] font-extrabold tracking-tight text-ink">
            Peraspera
          </span>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:gap-1 md:overflow-visible md:px-3">
          {groups.map((group) => {
            const open = openGroups[group.id] ?? true;
            return (
              <div key={group.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroups((prev) => ({ ...prev, [group.id]: !open }))
                  }
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#8a8a8a] transition-colors hover:bg-[#f7f7f7] hover:text-ink"
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      open ? 'rotate-0' : '-rotate-90'
                    }`}
                    aria-hidden
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    {group.items.map(({ to, label, Icon, badge }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => {
                          if (badge === 'applications') setAppBadge(0);
                        }}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                            isActive
                              ? 'bg-accent/15 font-semibold text-ink'
                              : 'text-[#6b6b6b] hover:bg-[#f7f7f7] hover:text-ink'
                          }`
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} aria-hidden />
                        <span className="flex-1">{label}</span>
                        {badge === 'applications' && appBadge > 0 ? (
                          <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-ink">
                            {appBadge}
                          </span>
                        ) : null}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto hidden border-t border-[#e8e8e8] p-4 md:block">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-[11px] font-bold text-accent">
              {initials(profile?.username ?? 'AD')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {profile?.username ?? 'Admin'}
              </p>
              <p className="truncate text-xs text-[#8a8a8a]">
                {profile ? ADMIN_ROLE_LABELS[profile.role] : 'Administrator'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void onLogout()}
              className="rounded-lg p-2 text-[#8a8a8a] transition-colors hover:bg-[#f7f7f7] hover:text-ink"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#e8e8e8] bg-white px-4 py-3 md:px-8">
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => void onLogout()}
              className="text-sm font-semibold text-muted-alt"
            >
              Sign out
            </button>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {showLive ? <LiveBadge live={live} alert={alert} /> : null}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
