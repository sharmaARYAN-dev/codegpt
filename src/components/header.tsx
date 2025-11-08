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
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Settings, LogOut, Bell, Orbit, Menu, Sun, Moon, Check, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import React from 'react';
import { auth } from '@/lib/firebase';
import { useNotifications } from '@/hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';

export function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user?.id);
  
  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const query = event.currentTarget.value;
      if (query) {
        router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
      }
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
         <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
            <Orbit className="h-7 w-7 text-primary" />
        </Link>
        <SidebarTrigger className="flex">
            <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </div>

       <div className="hidden items-center gap-2 md:ml-4 md:hidden">
            <h1 className="font-headline text-xl font-semibold tracking-tight">UniVerse</h1>
        </div>
      
      <div className="flex flex-1 items-center justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
             <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              {unreadCount > 0 && <Button variant="link" size="sm" className="h-auto p-0" onClick={markAllAsRead}>Mark all as read</Button>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-center text-muted-foreground">No new notifications</p>
              ) : (
                notifications.map(notif => (
                  <DropdownMenuItem key={notif.id} className="items-start gap-3" onSelect={(e) => { e.preventDefault(); if (!notif.isRead) markAsRead(notif.id); router.push(notif.link); }}>
                    <div className="mt-1">
                      {notif.type === 'connection_accepted' ? <Check className="h-4 w-4 text-green-500" /> : <UserPlus className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                       <p className={`text-sm ${!notif.isRead && 'font-semibold'}`}>{notif.message}</p>
                       {notif.createdAt && <p className="text-xs text-muted-foreground">{formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true })}</p>}
                    </div>
                    {!notif.isRead && <div className="size-2 rounded-full bg-primary mt-2"></div>}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />}
                <AvatarFallback className='text-base'>{user?.displayName?.split(" ").map(n => n[0]).join("") ?? 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
                <p className='font-medium'>{user?.displayName}</p>
                <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
             <Link href="/dashboard/profile">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
