'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Settings, LogOut, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export function Header() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'avatar-1');

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.startsWith('/dashboard/teammates')) return 'Find Teammates';
    if (pathname.startsWith('/dashboard/ideas')) return 'AI Project Ideas';
    if (pathname.startsWith('/dashboard/events')) return 'Events';
    if (pathname.startsWith('/dashboard/forums')) return 'Forums';
    if (pathname.startsWith('/dashboard/project')) return 'Project Workspace';
    return 'UniVerse';
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger asChild>
          <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
        </SidebarTrigger>
      </div>

      <div className="flex-1">
        <h1 className="font-headline text-lg font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="Alex Johnson" />}
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
                <p>Alex Johnson</p>
                <p className="text-xs text-muted-foreground font-normal">alex@university.edu</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
