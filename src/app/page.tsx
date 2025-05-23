
"use client";

import { useAuth } from '@/context/auth-context';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
    description: "Build powerful habits with daily tracking and visualize your consistency. Set reminders for crucial goal steps to stay on track.",
    dataAiHint: "calendar schedule",
    href: "/features/daily-planner-sync"
  },
  {
    icon: BarChartBig,
    title: "Progress Dashboard",
    description: "Monitor your success with an intuitive dashboard. View insightful charts of your progress across all goals.",
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

  if (authLoading) {
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
      <section className="py-20 md:py-32 bg-gradient-to-br from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)]">
        <div className="container mx-auto px-6 text-center">
          <Target className="w-24 h-24 text-primary mx-auto mb-8 animate-bounce" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Achieve Your Dreams with <span className="text-accent">Achievo</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            The smart, AI-powered platform to break down, track, and conquer your goals. Turn ambition into reality.
          </p>
          {user ? (
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 rounded-lg shadow-lg hover:shadow-primary/30 transform hover:scale-105 transition-all">
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-lg shadow-lg hover:shadow-accent/30 transform hover:scale-105 transition-all">
              <Link href="/register">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Unlock Your Potential with Achievo</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Achievo provides you with the tools and intelligence to systematically work towards your goals.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="bg-card shadow-xl hover:shadow-[0_0_25px_hsl(var(--primary)/0.2),0_0_10px_hsl(var(--accent)/0.1)] border border-primary/30 hover:border-primary/40 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col rounded-xl overflow-hidden"
              >
                <CardHeader className="items-center text-center bg-gradient-to-br from-primary/20 to-primary/5 p-6">
                  <div className="p-4 bg-primary/20 rounded-full mb-4 inline-block border-2 border-primary/30 shadow-inner">
                    <feature.icon className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-semibold text-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground flex-grow p-6">
                  <p>{feature.description}</p>
                </CardContent>
                <CardFooter className="p-6 bg-card/50 border-t border-primary/10">
                  <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-gradient-to-r hover:from-primary/80 hover:to-primary/60 hover:text-primary-foreground transition-all duration-300 rounded-lg">
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
      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16">Simple Steps to Success</h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              { num: 1, title: "Define Your Goal", desc: "Tell Achievo what you want to achieve in your own words." },
              { num: 2, title: "Get Your Plan", desc: "Our AI breaks it down into actionable steps, timeline, and resources." },
              { num: 3, title: "Track & Achieve", desc: "Follow your roadmap, mark progress, and celebrate success!" }
            ].map(step => (
              <div key={step.num} className="flex flex-col items-center p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl shadow-xl border border-border hover:border-primary/30 transition-all transform hover:scale-105">
                <div className="bg-gradient-to-r from-[hsl(28,100%,50%)] to-[hsl(28,100%,40%)] text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold mb-6 shadow-lg">{step.num}</div>
                <h3 className="text-2xl font-semibold text-primary mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      {!user && (
        <section className="py-20 md:py-28 bg-primary text-white">
          <div className="container mx-auto px-6 text-center">
            <Zap className="w-16 h-16 mx-auto mb-6" /> {/* Will inherit text-white */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Achieving?</h2>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto opacity-90">
              Join thousands of users who are transforming their ambitions into accomplishments with Achievo.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-lg shadow-xl hover:shadow-accent/40 transform hover:scale-105 transition-transform">
              <Link href="/register">
                Sign Up Now - It's Free!
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

