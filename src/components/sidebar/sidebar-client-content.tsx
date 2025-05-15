
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Target, LayoutDashboard, CheckSquare, NotebookPen, Brain, User, LogOut, MessageSquareHeart } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export function SidebarNavigation() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || (href !== "/dashboard" && href !== "/" && pathname.startsWith(href));

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive('/dashboard')} tooltip="Dashboard" size="default">
          <Link href="/dashboard"><LayoutDashboard /> <span className="group-data-[collapsible=icon]:hidden">Dashboard</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive('/my-goals')} tooltip="My Goals" size="default">
          <Link href="/my-goals"><Target /> <span className="group-data-[collapsible=icon]:hidden">My Goals</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive('/my-habits')} tooltip="My Habits" size="default">
          <Link href="/my-habits"><CheckSquare /> <span className="group-data-[collapsible=icon]:hidden">My Habits</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive('/my-journal')} tooltip="My Journal" size="default">
          <Link href="/my-journal"><NotebookPen /> <span className="group-data-[collapsible=icon]:hidden">My Journal</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive('/smart-suggestions')} tooltip="Smart Suggestions" size="default">
          <Link href="/smart-suggestions"><Brain /> <span className="group-data-[collapsible=icon]:hidden">Suggestions</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function SidebarAccountMenu() {
  const pathname = usePathname();
  const { user } = useAuth(); 

  if (!user) return null;

  // Define isActive logic locally for this component
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive('/feedback')} tooltip="Feedback" size="default">
          <Link href="/feedback"><MessageSquareHeart /> <span className="group-data-[collapsible=icon]:hidden">Feedback</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {/* "Profile" and "Log out" items removed from here */}
    </SidebarMenu>
  );
}
