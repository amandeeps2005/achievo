
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AboutUsPage() {
  return (
    <div className="py-8 md:py-12">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <Info className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-6" />
          <CardTitle className="text-4xl md:text-5xl font-bold text-primary mb-4">
            About Achievo
          </CardTitle>
          <CardDescription className="text-lg md:text-xl text-muted-foreground">
            Learn more about our mission to help you conquer your goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-lg text-foreground">
          <p>
            Welcome to Achievo, your personal AI-powered goal achievement system! We believe that everyone has the potential to achieve great things, but sometimes, turning big ambitions into actionable plans can be daunting. That's where Achievo comes in.
          </p>
          <p>
            Our mission is to empower individuals like you by providing smart tools and intelligent assistance to break down complex goals, track progress effectively, build lasting habits, and stay motivated throughout your journey.
          </p>
          <h2 className="text-2xl font-semibold text-primary pt-4">Our Vision</h2>
          <p>
            We envision a world where everyone has the clarity and support they need to pursue their dreams. Achievo aims to be more than just a productivity tool; we want to be your trusted partner in personal growth and success. By leveraging the power of artificial intelligence, we provide personalized insights and actionable roadmaps tailored to your unique aspirations.
          </p>
          <h2 className="text-2xl font-semibold text-primary pt-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Smart Goal Decomposition to create clear, actionable steps.</li>
            <li>Personalized Action Roadmaps to visualize and track your journey.</li>
            <li>Daily Planner & Habit Sync to integrate goals into your routine.</li>
            <li>Comprehensive Progress Dashboards to monitor your achievements.</li>
            <li>An intelligent Suggestions Engine for tailored advice and tips.</li>
          </ul>
          <p className="pt-4">
            Thank you for choosing Achievo. We're excited to be a part of your journey to success!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
