
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Wand2, BookOpen, Clock, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SmartSuggestionsEnginePage() {
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
        <Wand2 className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Achievo's Smart Suggestions Engine
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Unlock personalized, AI-driven advice to accelerate your goal achievement. Achievo's Smart Suggestions Engine provides tailored insights based on your unique objectives.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12 md:mb-16">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Intelligent Guidance for Your Goals</h2>
          <p className="text-muted-foreground mb-6 text-base md:text-lg leading-relaxed">
            Based on your goal's category, designated timeframe, and commitment level, our AI generates relevant suggestions, such as:
          </p>
          <ul className="space-y-3 text-base md:text-lg">
            <li className="flex items-start">
              <BookOpen className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Key Topics to Cover:</strong> For learning or skill-based goals (e.g., "Learn Python"), identifies essential concepts or modules.
              </span>
            </li>
            <li className="flex items-start">
              <Clock className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Time Allocation Estimates:</strong> Suggests realistic daily or weekly time commitments.
              </span>
            </li>
            <li className="flex items-start">
              <Lightbulb className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Sample Project Ideas:</strong> Offers practical projects or activities to apply new knowledge or skills.
              </span>
            </li>
            <li className="flex items-start">
              <Wand2 className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Specific Tips:</strong> For goals like "Lose 5kg," it might provide diet tips, workout schedule ideas, or suggest tracking methods like weekly weigh-ins.
              </span>
            </li>
          </ul>
        </div>
        <div className="mt-8 md:mt-0">
          <Image
            src="https://picsum.photos/seed/smart-ideas/600/400"
            alt="AI generating smart suggestions"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl"
            data-ai-hint="ai ideas"
          />
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-primary">Benefits of AI-Powered Suggestions</CardTitle>
          <CardDescription className="text-base">Leverage artificial intelligence to enhance your goal strategy.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6 text-base">
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Personalized Advice</h3>
            <p className="text-muted-foreground">Receive suggestions that are relevant to your specific goal and context.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Actionable Recommendations</h3>
            <p className="text-muted-foreground">Get concrete ideas you can implement immediately to make progress.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Overcome Blocks</h3>
            <p className="text-muted-foreground">Discover new approaches or resources when you're unsure how to proceed.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Optimized Learning & Execution</h3>
            <p className="text-muted-foreground">Focus on the most impactful areas and activities for your specific goal.</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-12 md:mt-16">
        <p className="text-xl text-muted-foreground mb-6">
          Ready to receive intelligent guidance to supercharge your goals?
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <Link href="/register">
            Get Smart Suggestions with Achievo
          </Link>
        </Button>
      </div>
    </div>
  );
}
