
'use client';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Users, FolderKanban, MessageSquare, LogOut, Swords, Lightbulb, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/dashboard/communities', icon: MessageSquare, label: 'Communities' },
  { href: '/dashboard/hackathons', icon: Swords, label: 'Events' },
  { href: '/dashboard/teammates', icon: Users, label: 'Teammates' },
  { href: '/dashboard/ideas', icon: Lightbulb, label: 'Ideas' },
  { href: '/dashboard/profile', icon: UserIcon, label: 'Profile' },
];

export function AppNav() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/login');
    }
  };

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border hidden md:flex">
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
            {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                <SidebarMenuButton
                    isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')}
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
      <SidebarFooter className="p-2 border-t border-sidebar-border mt-auto">
        <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                    <LogOut/>
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
