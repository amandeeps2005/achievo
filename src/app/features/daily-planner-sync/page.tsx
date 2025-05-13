
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Zap, Bell, BarChartHorizontalBig } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DailyPlannerSyncPage() {
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
        <CalendarDays className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Daily Planner & Habit Sync
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Seamlessly integrate your long-term goals into your daily routine. Achievo helps you build powerful habits and stay on top of your schedule.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12 md:mb-16">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Turn Goals into Daily Actions</h2>
          <p className="text-muted-foreground mb-6 text-base md:text-lg leading-relaxed">
            Achievo empowers you to make consistent progress by:
          </p>
          <ul className="space-y-3 text-base md:text-lg">
            <li className="flex items-start">
              <BarChartHorizontalBig className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Breaking Goals into Chunks:</strong> Your action steps can be assigned start/end dates and repeat intervals (daily/weekly) for effective habit building.
              </span>
            </li>
            <li className="flex items-start">
              <Zap className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Daily & Weekly Planning:</strong> (Coming Soon) View tasks due today or this week, helping you prioritize effectively.
              </span>
            </li>
            <li className="flex items-start">
              <Bell className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Reminders & Notifications:</strong> (Coming Soon) Set reminders for crucial tasks and deadlines so nothing slips through the cracks.
              </span>
            </li>
            <li className="flex items-start">
              <TrendingUp className="w-6 h-6 text-accent mr-3 mt-1 shrink-0" />
              <span>
                <strong>Streak Tracking:</strong> (Coming Soon) Visualize your consistency and build momentum by tracking your daily and weekly habit streaks.
              </span>
            </li>
          </ul>
           <Badge variant="outline" className="mt-4 text-sm py-1 px-3">Feature Enhancements Coming Soon</Badge>
        </div>
        <div className="mt-8 md:mt-0">
          <Image
            src="https://picsum.photos/seed/daily-sync/600/400"
            alt="Calendar and habits"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl"
            data-ai-hint="calendar habits"
          />
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-primary">Why Sync Your Goals and Habits?</CardTitle>
          <CardDescription className="text-base">The power of consistent, small actions.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6 text-base">
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Build Lasting Habits</h3>
            <p className="text-muted-foreground">Regularly performing goal-related tasks solidifies them as habits.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Consistent Progress</h3>
            <p className="text-muted-foreground">Small, daily actions compound over time, leading to significant achievements.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Stay Organized</h3>
            <p className="text-muted-foreground">Manage your goal tasks alongside your daily schedule for better time management.</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <h3 className="font-semibold text-foreground mb-2">Maintain Momentum</h3>
            <p className="text-muted-foreground">Streak tracking and regular reminders keep you motivated and engaged.</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-12 md:mt-16">
        <p className="text-xl text-muted-foreground mb-6">
          Ready to make goal achievement a part of your daily life?
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <Link href="/register">
            Build Habits with Achievo
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Added import for TrendingUp
import { TrendingUp } from "lucide-react";
