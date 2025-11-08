
'use client';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
  Sidebar,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Lightbulb, Calendar, MessageSquare, LogOut, Settings, BotMessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { projects } from '@/lib/data';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/teammates', icon: Users, label: 'Find Teammates' },
  { href: '/dashboard/ideas', icon: BotMessageSquare, label: 'AI Project Ideas' },
  { href: '/dashboard/events', icon: Calendar, label: 'Events' },
  { href: '/dashboard/forums', icon: MessageSquare, label: 'Forums' },
];

export function AppNav() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'avatar-1');

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
            <div className="p-2 bg-primary/20 rounded-lg">
                <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div className='group-data-[collapsible=icon]:hidden'>
                <h2 className="font-headline text-lg font-semibold tracking-tight">UniVerse</h2>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
            {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                >
                    <item.icon />
                    <span>{item.label}</span>
                </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            ))}
        </SidebarMenu>
        <div className='mt-4 group-data-[collapsible=icon]:hidden'>
            <h3 className="px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">My Projects</h3>
            <SidebarMenu className='mt-2'>
                {projects.slice(0, 2).map(project => (
                     <SidebarMenuItem key={project.id}>
                        <Link href="/dashboard/project" legacyBehavior passHref>
                            <SidebarMenuButton size="sm" tooltip={project.name} isActive={pathname.startsWith(`/dashboard/project/${project.id}`)}>
                                <span className='w-2 h-2 rounded-full bg-primary mr-2'></span>
                                <span className='truncate'>{project.name}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </div>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className='size-8'>
            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="Alex Johnson" />}
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">Alex Johnson</span>
            <span className="text-xs text-muted-foreground">alex@university.edu</span>
          </div>
        </div>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                    <Settings/>
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout">
                    <LogOut/>
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
