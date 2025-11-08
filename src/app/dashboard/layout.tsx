import type { Metadata } from 'next';
import { AppShell } from '@/components/app-shell';
import { User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'UniVerse Dashboard',
  description: 'Connect, Collaborate, Create.',
};

function ProfilePage() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <User className="mx-auto h-12 w-12 text-muted-foreground" />
                <h1 className="mt-4 text-2xl font-semibold">Profile Page</h1>
                <p className="mt-2 text-muted-foreground">This page is under construction.</p>
            </div>
        </div>
    )
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProfilePage = false;
  return <AppShell>{isProfilePage ? <ProfilePage/> : children}</AppShell>;
}
