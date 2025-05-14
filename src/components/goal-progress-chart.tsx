
"use client";

import type { Goal } from '@/types';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { BarChartBig } from 'lucide-react';

interface GoalProgressChartProps {
  goals: Goal[];
}

const chartColors = {
  completed: "hsl(var(--chart-1))", // Primary color for completed part
  remaining: "hsl(var(--muted))",    // Muted color for remaining part
};

const chartConfig = {
  progress: {
    label: "Progress",
    color: chartColors.completed,
  },
  remaining: {
    label: "Remaining",
    color: chartColors.remaining,
  },
} satisfies ChartConfig;


interface IndividualGoalPieChartProps {
  goal: Goal;
}

function IndividualGoalPieChart({ goal }: IndividualGoalPieChartProps) {
  const data = [
    { name: 'Completed', value: goal.progress, fill: chartColors.completed },
    { name: 'Remaining', value: 100 - goal.progress, fill: chartColors.remaining },
  ];

  const goalTitle = (goal.title || goal.originalGoal).substring(0, 35) + ((goal.title || goal.originalGoal).length > 35 ? '...' : '');

  return (
    <div className="flex flex-col items-center">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-40 w-40 sm:h-48 sm:w-48"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }} accessibilityLayer>
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="hsl(var(--foreground))" floodOpacity="0.1"/>
              </filter>
            </defs>
            <Tooltip
              cursor={{ fill: "hsl(var(--muted)/0.3)"}}
              content={<ChartTooltipContent hideLabel indicator="dot" nameKey="name" />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={Math.min(window.innerWidth < 640 ? 70 : 80, 80)} // Adjusted for sm breakpoint
              innerRadius={Math.min(window.innerWidth < 640 ? 45 : 55, 55)} // This makes it a donut
              strokeWidth={2}
              stroke="hsl(var(--background))"
              style={{ filter: 'url(#shadow)' }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            {/* Text in the middle of the donut */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-2xl sm:text-3xl font-bold"
            >
              {`${goal.progress}%`}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <p className="text-center text-xs sm:text-sm font-medium text-muted-foreground mt-2 h-8 sm:h-10 overflow-hidden" title={goal.title || goal.originalGoal}>
        {goalTitle}
      </p>
    </div>
  );
}


export default function GoalProgressChart({ goals }: GoalProgressChartProps) {
  // Show max 12 goals to prevent clutter and ensure decent sizing
  const chartData = goals.slice(0, 12);

  return (
    <Card className="shadow-lg rounded-xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center">
          <BarChartBig className="w-6 h-6 mr-3" />
          Goals Progress Overview
        </CardTitle>
        <CardDescription>Visual summary of your progress for up to 12 active goals.</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        {chartData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-6 items-start justify-center">
            {chartData.map(goal => (
              <IndividualGoalPieChart key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground min-h-[250px] flex flex-col justify-center items-center bg-muted/30 rounded-md">
            <BarChartBig className="w-16 h-16 mb-4 text-primary opacity-30" />
            <p className="text-lg font-medium">No Goal Progress Yet</p>
            <p className="text-sm max-w-xs mx-auto">
              Start by adding a new goal and completing its steps. Your progress will be visualized here!
            </p>
          </div>
        )}
      </CardContent>
       {chartData.length > 0 && (
        <CardContent className="text-xs text-muted-foreground pt-2 pb-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-sm mr-1.5" style={{ backgroundColor: chartColors.completed }} />
              Completed
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-sm mr-1.5" style={{ backgroundColor: chartColors.remaining }} />
              Remaining
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
