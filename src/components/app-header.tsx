
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react'; // Added LayoutDashboard for home/dashboard link
import { usePathname, useRouter } from 'next/navigation';
import { Target } from 'lucide-react'; // App icon
import { useAuth } from '@/context/auth-context'; // Import useAuth

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth(); // Get user and logout function
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
          {/* The "New Goal" button was previously here and has been removed due to redundancy */}
          {user && ( // Display logout button only when user is logged in
            <Button
              variant="outline"
              size="sm"
              onClick={async () => { await logout(); router.push('/login'); }} // Call logout function and redirect
            >
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

