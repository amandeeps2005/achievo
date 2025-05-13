"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, LayoutDashboard } from 'lucide-react'; // Added LayoutDashboard for home/dashboard link
import { usePathname } from 'next/navigation';
import { Target } from 'lucide-react'; // App icon

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Target className="w-8 h-8" />
          <span>Achievo</span>
        </Link>
        <nav className="flex items-center gap-2">
          {pathname !== '/' && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}
          {pathname !== '/new-goal' && (
            <Button variant="default" size="sm" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/new-goal">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Goal
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
