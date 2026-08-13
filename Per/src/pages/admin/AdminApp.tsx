import { type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  canAccessBlog,
  canAccessBulkMail,
  canAccessHiring,
  canAccessUsers,
  defaultHomeForRole,
} from '../../lib/adminRoles';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
import { AdminLayout } from './AdminLayout';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminForgotPasswordPage } from './AdminForgotPasswordPage';
import { AdminSetPasswordPage } from './AdminSetPasswordPage';
import { AdminDepartmentsPage } from './AdminDepartmentsPage';
import { AdminJobsPage } from './AdminJobsPage';
import { AdminApplicationsPage } from './AdminApplicationsPage';
import { AdminCulturePage } from './AdminCulturePage';
import { AdminDashboardPage } from './AdminDashboardPage';
import { AdminTemplatesPage } from './AdminTemplatesPage';
import { AdminPermissionDeniedPage } from './AdminPermissionDeniedPage';
import { AdminUsersPage } from './AdminUsersPage';
import { AdminInviteUserPage } from './AdminInviteUserPage';
import { AdminBlogListPage } from './AdminBlogListPage';
import { AdminBlogEditorPage } from './AdminBlogEditorPage';
import { AdminMfaWaitPage } from './AdminMfaWaitPage';
import { AdminBulkMailPage } from './AdminBulkMailPage';
import { AdminBulkMailJobPage } from './AdminBulkMailJobPage';

function RequireAdmin({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated, phase } = useAdminAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] text-sm text-muted-alt">
        Loading…
      </div>
    );
  }
  if (phase === 'needs_mfa') {
    return <Navigate to="/admin/mfa" replace />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function RequirePasswordSession({ children }: { children: ReactNode }) {
  const { loading, hasPasswordSession } = useAdminAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] text-sm text-muted-alt">
        Loading…
      </div>
    );
  }
  if (!hasPasswordSession) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function RequireHiring({ children }: { children: ReactNode }) {
  const { profile } = useAdminAuth();
  if (!profile || !canAccessHiring(profile.role)) {
    return <AdminPermissionDeniedPage />;
  }
  return children;
}

function RequireUsers({ children }: { children: ReactNode }) {
  const { profile } = useAdminAuth();
  if (!profile || !canAccessUsers(profile.role)) {
    return <AdminPermissionDeniedPage />;
  }
  return children;
}

function RequireBlog({ children }: { children: ReactNode }) {
  const { profile } = useAdminAuth();
  if (!profile || !canAccessBlog(profile.role)) {
    return <AdminPermissionDeniedPage />;
  }
  return children;
}

function RequireBulkMail({ children }: { children: ReactNode }) {
  const { profile } = useAdminAuth();
  if (!profile || !canAccessBulkMail(profile.role)) {
    return <AdminPermissionDeniedPage />;
  }
  return children;
}

function AdminIndexRedirect() {
  const { profile } = useAdminAuth();
  if (!profile) return <Navigate to="/admin/login" replace />;
  return <Navigate to={defaultHomeForRole(profile.role)} replace />;
}

function HiringRoutes() {
  return (
    <RequireHiring>
      <Routes>
        <Route index element={<Navigate to="applications" replace />} />
        <Route path="overview" element={<AdminDashboardPage />} />
        <Route path="applications" element={<AdminApplicationsPage />} />
        <Route path="jobs" element={<AdminJobsPage />} />
        <Route path="culture" element={<AdminCulturePage />} />
        <Route path="departments" element={<AdminDepartmentsPage />} />
        <Route path="templates" element={<AdminTemplatesPage />} />
        <Route path="*" element={<Navigate to="applications" replace />} />
      </Routes>
    </RequireHiring>
  );
}

function BlogRoutes() {
  return (
    <RequireBlog>
      <Routes>
        <Route index element={<AdminBlogListPage />} />
        <Route path="new" element={<AdminBlogEditorPage />} />
        <Route path=":id" element={<AdminBlogEditorPage />} />
        <Route path="*" element={<Navigate to="/admin/blog" replace />} />
      </Routes>
    </RequireBlog>
  );
}

function UsersRoutes() {
  return (
    <RequireUsers>
      <Routes>
        <Route index element={<AdminUsersPage />} />
        <Route path="invite" element={<AdminInviteUserPage />} />
        <Route path="*" element={<Navigate to="/admin/users" replace />} />
      </Routes>
    </RequireUsers>
  );
}

function BulkMailRoutes() {
  return (
    <RequireBulkMail>
      <Routes>
        <Route index element={<AdminBulkMailPage />} />
        <Route path=":jobId" element={<AdminBulkMailJobPage />} />
        <Route path="*" element={<Navigate to="/admin/bulk-mail" replace />} />
      </Routes>
    </RequireBulkMail>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route path="forgot-password" element={<AdminForgotPasswordPage />} />
      <Route path="set-password" element={<AdminSetPasswordPage />} />
      <Route path="reset-password" element={<AdminSetPasswordPage />} />
      <Route
        path="mfa"
        element={
          <RequirePasswordSession>
            <AdminMfaWaitPage />
          </RequirePasswordSession>
        }
      />
      <Route
        path="*"
        element={
          <RequireAdmin>
            <AdminLayout>
              <Routes>
                <Route index element={<AdminIndexRedirect />} />
                <Route path="hiring/*" element={<HiringRoutes />} />
                <Route path="blog/*" element={<BlogRoutes />} />
                <Route path="users/*" element={<UsersRoutes />} />
                <Route path="bulk-mail/*" element={<BulkMailRoutes />} />
                <Route path="overview" element={<Navigate to="/admin/hiring/overview" replace />} />
                <Route
                  path="applications"
                  element={<Navigate to="/admin/hiring/applications" replace />}
                />
                <Route path="jobs" element={<Navigate to="/admin/hiring/jobs" replace />} />
                <Route path="culture" element={<Navigate to="/admin/hiring/culture" replace />} />
                <Route
                  path="departments"
                  element={<Navigate to="/admin/hiring/departments" replace />}
                />
                <Route
                  path="templates"
                  element={<Navigate to="/admin/hiring/templates" replace />}
                />
                <Route path="*" element={<AdminIndexRedirect />} />
              </Routes>
            </AdminLayout>
          </RequireAdmin>
        }
      />
    </Routes>
  );
}

export function AdminApp() {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-paper font-body text-ink antialiased">
        <AdminRoutes />
      </div>
    </AdminAuthProvider>
  );
}
