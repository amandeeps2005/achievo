
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Map, CheckCircle, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ActionRoadmapPage() {
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
        <Map className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Your Personalized Action Roadmap
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Achievo transforms your decomposed goal into a dynamic, visual journey. Track your progress, manage tasks effectively, and stay motivated every step of the way.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12 md:mb-16">
        <div className="md:order-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Navigate Your Path to Success</h2>
          <p className="text-muted-foreground mb-6 text-base md:text-lg leading-relaxed">
            Once your goal plan is set, Achievo provides an interactive roadmap with:
          </p>
          <ul className="space-y-3 text-base md:text-lg">
            <li className="flex items-start">
              <TrendingUp className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Visual Step Tracker:</strong> See all your action steps laid out clearly, often as interactive cards or with clear progress indicators.
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Checklist Per Step:</strong> Easily mark tasks as complete, updating your overall goal progress instantly.
              </span>
            </li>
            <li className="flex items-start">
              <Award className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Milestone Rewards & Feedback:</strong> Receive encouragement and celebrate your achievements as you complete key stages of your goal.
              </span>
            </li>
          </ul>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <Image
            src="https://picsum.photos/seed/roadmap-journey/600/400"
            alt="Visual action roadmap"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl"
            data-ai-hint="journey map"
          />
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-primary">Key Benefits of the Action Roadmap</CardTitle>
          <CardDescription className="text-base">Stay organized and motivated with a clear view of your journey.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6 text-base">
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Enhanced Visibility</h3>
            <p className="text-muted-foreground">Know exactly where you are and what's next, reducing uncertainty.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Increased Accountability</h3>
            <p className="text-muted-foreground">Checklists and progress tracking keep you accountable to your plan.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Boosted Motivation</h3>
            <p className="text-muted-foreground">Seeing progress and celebrating milestones fuels your drive to continue.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Organized Workflow</h3>
            <p className="text-muted-foreground">All your steps, deadlines, and resources are neatly organized in one place.</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-12 md:mt-16">
        <p className="text-xl text-muted-foreground mb-6">
          Ready to visualize your path to success and track your achievements?
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <Link href="/register">
            Start Your Journey with Achievo
          </Link>
        </Button>
      </div>
    </div>
  );
}
