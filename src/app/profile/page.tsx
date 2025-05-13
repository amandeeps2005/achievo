// src/app/profile/page.tsx
"use client";

import { useAuth } from '@/context/auth-context';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/loading-spinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, ShieldCheck, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';


export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      redirect('/');
    }
  }, [user, authLoading]);

  if (authLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Loading Profile...</p>
      </div>
    );
  }

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length > 1 && parts[0] && parts[parts.length -1]) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      if (parts[0]) {
        return parts[0].substring(0, 2).toUpperCase();
      }
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return <User className="h-3/5 w-3/5" />;
  };
  
  const memberSince = user.metadata.creationTime 
    ? formatDistanceToNow(new Date(user.metadata.creationTime), { addSuffix: true })
    : 'N/A';


  return (
    <div className="container mx-auto py-8 md:py-12">
      <Card className="max-w-2xl mx-auto shadow-xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="items-center text-center bg-gradient-to-br from-primary/10 via-card to-card p-8">
          <Avatar className="w-28 h-28 text-5xl mb-4 border-4 border-primary bg-primary/20 shadow-lg">
            {user.photoURL ? (
              <AvatarImage src={user.photoURL} alt={user.displayName || user.email || 'User Avatar'} />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
              {getInitials(user.displayName, user.email)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold text-primary">{user.displayName || "Achievo User"}</CardTitle>
          <CardDescription className="text-muted-foreground text-base">Your personal account details and journey with Achievo.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
              <Mail className="w-7 h-7 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Email Address</p>
                <p className="text-md font-semibold text-foreground break-all">{user.email}</p>
              </div>
            </div>
            
            {user.emailVerified !== undefined && (
              <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
                <ShieldCheck className={`w-7 h-7 shrink-0 ${user.emailVerified ? 'text-green-500' : 'text-yellow-500'}`} />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Email Verification</p>
                  <p className={`text-md font-semibold ${user.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user.emailVerified ? "Verified" : "Not Verified"}
                  </p>
                </div>
              </div>
            )}
          </div>

           <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
            <CalendarClock className="w-7 h-7 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Member Since</p>
              <p className="text-md font-semibold text-foreground">{memberSince}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
            <User className="w-7 h-7 text-primary shrink-0 mt-1" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">User ID</p>
              <p className="text-xs font-mono text-foreground break-all">{user.uid}</p>
            </div>
          </div>
          
        </CardContent>
        <CardFooter className="bg-muted/20 p-6 border-t border-border">
          <Button asChild variant="outline" className="w-full sm:w-auto mx-auto border-primary text-primary hover:bg-primary/10">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

