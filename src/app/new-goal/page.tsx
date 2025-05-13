import GoalSetupForm from '@/components/goal-setup-form';

export const metadata = {
  title: 'New Goal - Achievo',
  description: 'Set up a new goal and let Achievo help you break it down.',
};

export default function NewGoalPage() {
  return (
    <div className="py-8">
      <GoalSetupForm />
    </div>
  );
}
