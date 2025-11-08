import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { AppNav } from '@/components/app-nav';
import { Header } from '@/components/header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar variant="sidebar" collapsible="icon">
          <AppNav />
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
