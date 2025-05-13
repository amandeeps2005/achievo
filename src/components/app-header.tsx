
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Moon, Sun, LogIn, UserPlus, LogOut, ShieldCheck } from 'lucide-react'; 
import { usePathname, useRouter } from 'next/navigation';
import { Target } from 'lucide-react'; 
import { useAuth } from '@/context/auth-context'; 
import { useTheme } from '@/context/theme-context'; 
import LoadingSpinner from './loading-spinner';
import { useEffect, useState } from 'react';

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth(); 
  const { theme, toggleTheme } = useTheme(); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login'); 
  };

  const logoHref = user ? '/dashboard' : '/';

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={logoHref} className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <Target className="w-8 h-8" />
          <span>Achievo</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          {authLoading ? (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <LoadingSpinner size={16} /> Authenticating...
            </div>
          ) : user ? (
            <>
              {pathname !== '/dashboard' && (
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-1.5 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-sm">
                <LogOut className="mr-1.5 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              {pathname !== '/login' && (
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link href="/login">
                    <LogIn className="mr-1.5 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )}
              {pathname !== '/register' && (
                 <Button variant="default" size="sm" asChild className="text-sm bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/register">
                    <UserPlus className="mr-1.5 h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              )}
              { (pathname === '/login' || pathname === '/register') && (
                 <Button variant="ghost" size="sm" asChild className="text-sm">
                    <Link href="/">
                        <ShieldCheck className="mr-1.5 h-4 w-4" />
                        Why Achievo?
                    </Link>
                 </Button>
              )}
            </>
          )}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="h-9 w-9 sm:h-10 sm:w-10">
            {mounted ? (theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />) : <Sun className="h-5 w-5" /> }
          </Button>
        </nav>
      </div>
    </header>
  );
}

