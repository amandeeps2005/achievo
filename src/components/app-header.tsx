
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Moon, Sun } from 'lucide-react'; 
import { usePathname, useRouter } from 'next/navigation';
import { Target } from 'lucide-react'; // App icon
import { useAuth } from '@/context/auth-context'; 
import { useTheme } from '@/context/theme-context'; 

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth(); 
  const { theme, toggleTheme } = useTheme(); 

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
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          {user && ( 
            <Button
              variant="outline"
              size="sm"
              onClick={async () => { await logout(); router.push('/login'); }} 
            >
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

