
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/loading-spinner';

export const metadata = {
  title: 'New Goal - Achievo',
  description: 'Set up a new goal and let Achievo help you break it down.',
};

const GoalSetupForm = dynamic(() => import('@/components/goal-setup-form'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <LoadingSpinner size={48} />
      <p className="mt-4 text-muted-foreground">Loading goal setup...</p>
    </div>
  ),
});

export default function NewGoalPage() {
  return (
    <div className="py-8">
      <GoalSetupForm />
    </div>
  );
}
