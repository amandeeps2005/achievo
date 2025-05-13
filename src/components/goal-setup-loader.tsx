
"use client";

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/loading-spinner';

const GoalSetupForm = dynamic(() => import('@/components/goal-setup-form'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <LoadingSpinner size={48} />
      <p className="mt-4 text-muted-foreground">Loading goal setup...</p>
    </div>
  ),
});

export default function GoalSetupLoader() {
  return <GoalSetupForm />;
}

