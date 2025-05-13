
"use client";

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Brain, Map, CalendarDays, BarChartBig, Wand2, ArrowRight, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: "Smart Goal Decomposition",
    description: "Our AI interprets your ambition, categorizes it, and generates actionable steps with a timeline and resources.",
    dataAiHint: "ai brain",
    href: "/features/smart-goal-decomposition"
  },
  {
    icon: Map,
    title: "Personalized Action Roadmap",
    description: "Visually track your journey with interactive cards and progress bars. Each step includes a checklist.",
    dataAiHint: "map journey",
    href: "/features/action-roadmap"
  },
  {
    icon: CalendarDays,
    title: "Daily Planner + Habit Sync",
    description: "Integrate your roadmap into a daily planner. Get reminders and track streaks to build habits.",
    dataAiHint: "calendar schedule",
    href: "/features/daily-planner-sync"
  },
  {
    icon: BarChartBig,
    title: "Progress Dashboard",
    description: "Monitor your success with an intuitive dashboard. View progress charts and get motivation boosters.",
    dataAiHint: "charts analytics",
    href: "/features/progress-dashboard"
  },
  {
    icon: Wand2,
    title: "Smart Suggestions Engine",
    description: "Get AI tips for topics, time allocation, and project ideas tailored to your goal and commitment.",
    dataAiHint: "magic suggestion",
    href: "/features/smart-suggestions-engine"
  },
];

export default function LandingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  if (authLoading || (!authLoading && user)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Loading Achievo...</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <Target className="w-24 h-24 text-primary mx-auto mb-8 animate-bounce" />
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6">
            Achieve Your Dreams with <span className="text-accent">Achievo</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            The smart, AI-powered platform to break down, track, and conquer your goals. Turn ambition into reality.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            <Link href="/register">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Unlock Your Potential with Achievo</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Achievo provides you with the tools and intelligence to systematically work towards your goals.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-background shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col">
                <CardHeader className="items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                    <feature.icon className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-semibold text-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground flex-grow">
                  <p>{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild size="sm" variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    <Link href={feature.href}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16">Simple Steps to Success</h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-card rounded-xl shadow-lg">
              <div className="bg-accent text-accent-foreground rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold mb-6">1</div>
              <h3 className="text-2xl font-semibold text-primary mb-3">Define Your Goal</h3>
              <p className="text-muted-foreground">Tell Achievo what you want to achieve in your own words.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card rounded-xl shadow-lg">
              <div className="bg-accent text-accent-foreground rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold mb-6">2</div>
              <h3 className="text-2xl font-semibold text-primary mb-3">Get Your Plan</h3>
              <p className="text-muted-foreground">Our AI breaks it down into actionable steps, timeline, and resources.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card rounded-xl shadow-lg">
               <div className="bg-accent text-accent-foreground rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold mb-6">3</div>
              <h3 className="text-2xl font-semibold text-primary mb-3">Track & Achieve</h3>
              <p className="text-muted-foreground">Follow your roadmap, mark progress, and celebrate success!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <Zap className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Achieving?</h2>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto opacity-90">
            Join thousands of users who are transforming their ambitions into accomplishments with Achievo.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/80 text-accent-foreground text-lg px-10 py-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            <Link href="/register">
              Sign Up Now - It's Free!
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-card border-t border-border">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Achievo. All rights reserved.</p>
          <p className="text-sm mt-1">Your Personal Goal Achievement System.</p>
        </div>
      </footer>
    </div>
  );
}

