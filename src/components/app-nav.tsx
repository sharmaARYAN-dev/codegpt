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
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/dashboard/communities', icon: MessageSquare, label: 'Community' },
  { href: '/dashboard/events', icon: Calendar, label: 'Events' },
  { href: '/dashboard/teammates', icon: Users, label: 'Connections' },
  { href: '/dashboard/ideas', icon: Lightbulb, label: 'Ideas' },
  { href: '/dashboard/progress', icon: TrendingUp, label: 'Progress'},
  { href: '/dashboard/profile', icon: UserIcon, label: 'Profile' },
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
