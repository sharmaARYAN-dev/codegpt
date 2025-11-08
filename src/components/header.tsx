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
import { Settings, LogOut, Bell, Search, Orbit, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Input } from './ui/input';

export function Header() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'avatar-1');


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
         <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
            <Orbit className="h-7 w-7 text-primary" />
        </Link>
        <SidebarTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
        </SidebarTrigger>
      </div>

       <div className="hidden md:flex items-center gap-2">
            <Orbit className="w-7 h-7 text-primary" />
            <h1 className="font-headline text-xl font-semibold tracking-tight">Universe</h1>
        </div>

        <div className='flex-1 flex justify-center px-4 lg:px-16'>
             <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 bg-muted border-0" />
            </div>
        </div>


      <div className="flex items-center gap-2">
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
