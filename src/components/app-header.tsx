
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, LogOut, User, Target } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
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
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getInitials = (name?: string | null, email?: string | null): string | JSX.Element => {
    if (name && name.trim()) {
      const nameParts = name.trim().split(' ').filter(part => part.length > 0);
      if (nameParts.length > 1) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      }
      if (nameParts.length === 1 && nameParts[0].length > 0) {
        return nameParts[0].substring(0, Math.min(2, nameParts[0].length)).toUpperCase();
      }
    }
    if (email && email.trim()) {
      return email[0].toUpperCase();
    }
    return <User className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger /> 
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity">
            <Target className="w-7 h-7" />
            Achievo
          </Link>
        </div>
        <nav className="flex items-center gap-2 sm:gap-3">
          {authLoading && mounted ? (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <LoadingSpinner size={16} /> Authenticating...
            </div>
          ) : user ? (
            <>
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
          ) : mounted ? (
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
            </>
          ) : null }
        </nav>
      </div>
    </header>
  );
}
