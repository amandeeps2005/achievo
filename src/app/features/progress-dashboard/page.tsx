
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BarChartBig, PieChart, Lightbulb, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProgressDashboardPage() {
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
        <BarChartBig className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Your Progress Dashboard
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Visualize your journey and stay motivated with Achievo's comprehensive Progress Dashboard. Track achievements, gain insights, and celebrate your wins.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12 md:mb-16">
        <div className="md:order-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">At-a-Glance Goal Tracking</h2>
          <p className="text-muted-foreground mb-6 text-base md:text-lg leading-relaxed">
            The Progress Dashboard provides a central hub to:
          </p>
          <ul className="space-y-3 text-base md:text-lg">
            <li className="flex items-start">
              <PieChart className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>View Progress Charts:</strong> See clear visualizations of your completion percentage for each goal.
              </span>
            </li>
            <li className="flex items-start">
              <Lightbulb className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Receive Motivation Boosters:</strong> Get timely motivational quotes and reflections to keep your spirits high.
              </span>
            </li>
            <li className="flex items-start">
              <Award className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Celebrate Wins & Milestones:</strong> Acknowledge your accomplishments, big and small, to reinforce positive momentum.
              </span>
            </li>
            <li className="flex items-start">
              <BarChartBig className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
               <span>
                <strong>Overall Summary:</strong> Understand your overall progress across all active goals.
              </span>
            </li>
          </ul>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <Image
            src="https://picsum.photos/seed/dashboard-charts/600/400"
            alt="Progress dashboard with charts"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl"
            data-ai-hint="charts analytics"
          />
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-primary">Why Use the Progress Dashboard?</CardTitle>
          <CardDescription className="text-base">Stay informed, motivated, and on the path to success.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6 text-base">
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Clear Performance Overview</h3>
            <p className="text-muted-foreground">Instantly understand how you're progressing towards your ambitions.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Sustained Motivation</h3>
            <p className="text-muted-foreground">Regular positive reinforcement and milestone celebrations keep you engaged.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Data-Driven Adjustments</h3>
            <p className="text-muted-foreground">Identify areas where you're excelling or need to refocus your efforts.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Sense of Accomplishment</h3>
            <p className="text-muted-foreground">Visually tracking your completed tasks and goals provides a strong sense of achievement.</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-12 md:mt-16">
        <p className="text-xl text-muted-foreground mb-6">
          Ready to see your progress come to life and stay inspired?
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <Link href="/register">
            Monitor Your Success with Achievo
          </Link>
        </Button>
      </div>
    </div>
  );
}
