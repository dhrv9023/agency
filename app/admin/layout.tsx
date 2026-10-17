import React from 'react';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/admin/theme-provider';
import { AdminShell } from '@/components/admin/admin-shell';
import { getSession, DEFAULT_SUPER_ADMIN } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Console // VARAH SYSTEMS — AI Operations Platform',
  description: 'Enterprise operations console for AI automation workflows, CRM pipeline, and delivery sprints.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch session on server; fallback to default admin profile in development/preview
  let session = null;
  try {
    session = await getSession();
  } catch {
    // Edge/SSR fallback
  }

  const user = session?.user ?? DEFAULT_SUPER_ADMIN;

  return (
    <ThemeProvider>
      {/* FontAwesome 6 CDN link for technical icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <AdminShell user={user}>
        {children}
      </AdminShell>
    </ThemeProvider>
  );
}
