"use client";

import Register from '@/components/auth/register';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/loading-spinner';

const RegisterPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth is not loading and a user exists, redirect to dashboard
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  // Show loading spinner while auth state is being determined or if user exists (and redirect is imminent)
  if (authLoading || (!authLoading && user)) {
    return (
      <div className="flex min-h-[calc(100vh-var(--header-height,4rem))] items-center justify-center bg-background p-4">
        <LoadingSpinner size={48} />
        <p className="ml-3 text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }
  
  // If not loading and no user, it means the user should see the register form
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height,4rem))] items-center justify-center bg-background p-4">
      <Register />
    </div>
  );
};

export default RegisterPage;
