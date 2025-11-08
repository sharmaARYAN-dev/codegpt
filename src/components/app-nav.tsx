'use client';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Users, FolderKanban, MessageSquare, LogOut, Calendar, Lightbulb, User as UserIcon, Orbit, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/communities', label: 'Community', icon: MessageSquare },
  { href: '/dashboard/events', label: 'Events', icon: Calendar },
  { href: '/dashboard/teammates', label: 'Connections', icon: Users },
  { href: '/dashboard/ideas', label: 'Ideas', icon: Lightbulb },
  { href: '/dashboard/progress', label: 'Progress', icon: TrendingUp },
  { href: '/dashboard/profile', label: 'Profile', icon: UserIcon },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const isNavItemActive = (itemHref: string) => {
    if (itemHref === '/dashboard') {
      return pathname === itemHref;
    }
    return pathname.startsWith(itemHref);
  }

  return (
    <>
      <SidebarHeader className="hidden md:flex">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Orbit className="h-7 w-7 text-primary" />
          <span className="text-xl group-data-[collapsible=icon]:hidden">UniVerse</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={isNavItemActive(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
