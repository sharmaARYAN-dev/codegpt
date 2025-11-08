import type { Metadata } from 'next';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'UniVerse Dashboard',
  description: 'Connect, Collaborate, Create.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
