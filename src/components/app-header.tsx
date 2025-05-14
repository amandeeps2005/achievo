
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogIn, UserPlus, LogOut, ShieldCheck, User } from 'lucide-react'; 
import { usePathname, useRouter } from 'next/navigation';
import { Target } from 'lucide-react'; 
import { useAuth } from '@/context/auth-context'; 
// useTheme and Moon/Sun icons are removed
import LoadingSpinner from './loading-spinner';
import { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth(); 
  // const { theme, toggleTheme } = useTheme(); // Removed
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login'); 
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return <User className="h-5 w-5" />;
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm" 
                  onClick={() => router.push('/dashboard')}
                >
                  <LayoutDashboard className="mr-1.5 h-4 w-4" />
                  Dashboard
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      {user.photoURL ? (
                        <AvatarImage src={user.photoURL} alt={user.displayName || user.email || 'User Avatar'} />
                      ) : null}
                      <AvatarFallback>
                        {getInitials(user.displayName, user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
          {/* Theme toggle button is removed */}
        </nav>
      </div>
    </header>
  );
}
