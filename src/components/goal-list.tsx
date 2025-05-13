"use client";

import type { Goal } from '@/types';
import GoalCard from './goal-card';
import Image from 'next/image';

interface GoalListProps {
  goals: Goal[];
}

export default function GoalList({ goals }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <Image 
          src="https://picsum.photos/seed/add-goal/300/200" 
          alt="Illustration encouraging to add a new goal" 
          width={300}
          height={200}
          data-ai-hint="add goal" 
          className="mx-auto mb-6 rounded-lg shadow-md" 
        />
        <h2 className="text-2xl font-semibold text-foreground mb-2">No Goals Yet!</h2>
        <p className="text-muted-foreground">
          Ready to achieve something great? Click "Add New Goal" to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map(goal => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}

