
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Brain, CheckSquare, ListChecks, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SmartGoalDecompositionPage() {
  return (
    <div className="py-8 md:py-12">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>

      <header className="text-center mb-12 md:mb-16">
        <Brain className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Smart Goal Decomposition with Achievo
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Turn your grandest ambitions into a clear, actionable plan. Achievo's AI-powered engine intelligently breaks down complex goals, so you know exactly what to do next.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12 md:mb-16">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">How It Works</h2>
          <p className="text-muted-foreground mb-6 text-base md:text-lg leading-relaxed">
            Simply describe your goal to Achievo—whether it's launching a startup, learning a new skill, or running a marathon. Our advanced AI analyzes your input and:
          </p>
          <ul className="space-y-3 text-base md:text-lg">
            <li className="flex items-start">
              <CheckSquare className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Categorizes Your Goal:</strong> Automatically identifies the type of goal (e.g., Career, Fitness, Learning) to provide tailored insights.
              </span>
            </li>
            <li className="flex items-start">
              <ListChecks className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Generates Actionable Steps:</strong> Creates a series of specific, manageable tasks required to achieve your objective.
              </span>
            </li>
            <li className="flex items-start">
              <Brain className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Suggests Timelines & Deadlines:</strong> Proposes a realistic schedule with deadlines for each step to keep you on track.
              </span>
            </li>
            <li className="flex items-start">
              <Users className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Identifies Necessary Resources:</strong> Lists relevant tools, learning materials, or other resources to support your progress.
              </span>
            </li>
          </ul>
        </div>
        <div className="mt-8 md:mt-0">
          <Image
            src="https://picsum.photos/seed/goal-planning/600/400"
            alt="AI planning a goal"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl"
            data-ai-hint="goal planning"
          />
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-primary">Benefits of Smart Decomposition</CardTitle>
          <CardDescription className="text-base">Why let Achievo break down your goals?</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6 text-base">
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Clarity and Focus</h3>
            <p className="text-muted-foreground">Eliminate overwhelm by seeing a clear path forward. Focus on one step at a time.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Increased Efficiency</h3>
            <p className="text-muted-foreground">Save time and effort with an AI-generated plan tailored to your specific ambition.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Actionable Insights</h3>
            <p className="text-muted-foreground">Receive practical suggestions for resources and tools you'll need along the way.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Reduced Procrastination</h3>
            <p className="text-muted-foreground">Smaller, well-defined tasks are less daunting and easier to start.</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-12 md:mt-16">
        <p className="text-xl text-muted-foreground mb-6">
          Ready to transform your big ideas into achievable plans?
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <Link href="/register">
            Get Started with Achievo
          </Link>
        </Button>
      </div>
    </div>
  );
}
