"use client";

import type { Goal } from '@/types';
import StepCard from './step-card';
import { ListChecks } from 'lucide-react';

interface ActionRoadmapProps {
  goal: Goal;
}

export default function ActionRoadmap({ goal }: ActionRoadmapProps) {
  if (!goal || !goal.steps || goal.steps.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <ListChecks className="w-12 h-12 mx-auto mb-4 text-primary opacity-50" />
        No steps defined for this goal yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goal.steps.map((step, index) => (
        <StepCard key={step.id} step={step} goalId={goal.id} stepNumber={index + 1} />
      ))}
    </div>
  );
}
