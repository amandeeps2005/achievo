
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Target, LayoutDashboard, CheckSquare, NotebookPen, BarChartBig, Brain, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export function SidebarNavigation() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive('/dashboard')} tooltip="Dashboard">
          <Link href="/dashboard"><LayoutDashboard /> <span className="group-data-[collapsible=icon]:hidden">Dashboard</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive('/my-goals')} tooltip="My Goals">
          <Link href="/my-goals"><Target /> <span className="group-data-[collapsible=icon]:hidden">My Goals</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive('/my-habits')} tooltip="My Habits">
          <Link href="/my-habits"><CheckSquare /> <span className="group-data-[collapsible=icon]:hidden">My Habits</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive('/my-journal')} tooltip="My Journal">
          <Link href="/my-journal"><NotebookPen /> <span className="group-data-[collapsible=icon]:hidden">My Journal</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive('/progress-overview')} tooltip="Progress Overview">
          <Link href="/progress-overview"><BarChartBig /> <span className="group-data-[collapsible=icon]:hidden">Progress</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive('/smart-suggestions')} tooltip="Smart Suggestions">
          <Link href="/smart-suggestions"><Brain /> <span className="group-data-[collapsible=icon]:hidden">Suggestions</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function SidebarAccountMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await logout();
    router.push('/login'); // Redirect to login after logout
  };

  if (!user) return null; // Don't show account menu if not logged in

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive('/profile')} tooltip="Profile">
          <Link href="/profile"><User /> <span className="group-data-[collapsible=icon]:hidden">Profile</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
          <LogOut /> <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
