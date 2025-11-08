import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppNav } from '@/components/app-nav';
import { Header } from '@/components/header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar variant="sidebar" collapsible="icon">
          <AppNav />
        </Sidebar>
        <div className="flex-1">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
