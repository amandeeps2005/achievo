
"use client";

import type { Goal } from '@/types';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChartBig } from 'lucide-react';

interface GoalProgressChartProps {
  goals: Goal[];
}

const chartConfig = {
  progress: {
    label: "Progress (%)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function GoalProgressChart({ goals }: GoalProgressChartProps) {
  const chartData = goals.map(goal => ({
    name: (goal.title || goal.originalGoal).substring(0, 25) + ((goal.title || goal.originalGoal).length > 25 ? '...' : ''),
    progress: goal.progress,
  })).slice(0, 10); // Show max 10 goals to prevent clutter

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center">
          <BarChartBig className="w-6 h-6 mr-3" />
          Goals Overview
        </CardTitle>
        <CardDescription>Visual summary of your progress across up to 10 active goals.</CardDescription>
      </CardHeader>
      <CardContent>
        {goals.length > 0 && chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 5, right: 20, bottom: 70, left: 0 }}
                aria-label="Goal progress chart"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={80}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={5}
                  width={40}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip
                  cursor={{fill: "hsl(var(--muted)/0.3)"}}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar 
                  dataKey="progress" 
                  fill="var(--color-progress)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={Math.max(15, Math.min(35, 300 / (chartData.length || 1)))} // Dynamic bar width with min/max
                  aria-label={(payload: any) => `Goal ${payload.name} at ${payload.progress}% progress`}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="text-center py-10 text-muted-foreground h-[350px] flex flex-col justify-center items-center bg-muted/30 rounded-md">
            <BarChartBig className="w-16 h-16 mb-4 text-primary opacity-30" />
            <p className="text-lg font-medium">No Goal Progress Yet</p>
            <p className="text-sm max-w-xs mx-auto">
              Start by adding a new goal and completing its steps. Your progress will be visualized here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
