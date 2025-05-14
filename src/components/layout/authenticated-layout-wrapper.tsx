
"use client";

import React from 'react';
import { useAuth } from '@/context/auth-context';
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import { Toaster } from '@/components/ui/toaster';
import ChatbotWidget from '@/components/chatbot/chatbot-widget';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SidebarNavigation, SidebarAccountMenu } from '@/components/sidebar/sidebar-client-content';
import LoadingSpinner from '../loading-spinner';

interface AuthenticatedLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayoutWrapper({ children }: AuthenticatedLayoutWrapperProps) {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Loading Achievo...</p>
      </div>
    );
  }

  if (user) {
    // Layout for authenticated users
    return (
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            {/* Minimal sidebar header; main branding is in AppHeader */}
            <div className="h-7 text-xl font-bold text-primary">Menu</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNavigation />
          </SidebarContent>
          <SidebarFooter>
            <SidebarAccountMenu />
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-grow bg-background">
          <AppHeader />
          <main className="container mx-auto px-4 py-8 flex-grow">
            {children}
          </main>
          <Toaster />
          <AppFooter />
          <ChatbotWidget />
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Layout for unauthenticated users (no sidebar infrastructure)
  return (
    <div className="flex flex-col flex-grow bg-background min-h-screen">
      <AppHeader /> {/* AppHeader will internally hide sidebar trigger */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      <Toaster />
      <AppFooter />
      <ChatbotWidget />
    </div>
  );
}
