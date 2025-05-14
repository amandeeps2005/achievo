
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "What is Achievo?",
    answer: "Achievo is an AI-powered personal goal achievement system. It helps you break down your ambitions into actionable steps, track your progress, build habits, and provides smart suggestions to keep you on course."
  },
  {
    question: "How does the AI goal decomposition work?",
    answer: "You describe your goal in plain text, and our AI analyzes it to suggest a category, a list of actionable steps with potential deadlines and resources, a general timeline, and necessary tools."
  },
  {
    question: "Is my data secure?",
    answer: "We take your data security seriously. User authentication is handled by Firebase. Goal, journal, and habit data is primarily stored in your browser's localStorage. Profile pictures are stored in Firebase Storage with security rules. Please review our Privacy Policy for more details."
  },
  {
    question: "Can I use Achievo for free?",
    answer: "Yes, Achievo offers a free tier with core functionalities. We may introduce premium features in the future."
  },
  {
    question: "How do smart suggestions work?",
    answer: "Based on your goal's title, category, and timeframe, our AI engine provides tailored advice, such as key topics to study for a learning goal, or diet and workout ideas for a fitness goal."
  },
  {
    question: "How is my data used for the AI features?",
    answer: "When you use AI-driven features, the relevant text you provide (e.g., goal descriptions) is sent to our AI models to generate responses. This data is used solely for providing the service and is not used to train third-party AI models. Refer to our Privacy Policy for more details."
  },
  {
    question: "Can I access Achievo on multiple devices?",
    answer: "Since primary data like goals, journal entries, and habits are stored in localStorage, they are specific to the browser and device you use. Account information (profile) is synced. We are exploring options for full data synchronization across devices in the future."
  },
  {
    question: "How do I delete my account or data?",
    answer: "You can delete individual goals, journal entries, or habits from within the app. To delete your entire account and associated Firebase data, please contact us through the 'Contact Us' page. Data stored in localStorage can be cleared by clearing your browser's site data for Achievo."
  }
];

export default function FaqPage() {
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
          <HelpCircle className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-6" />
          <CardTitle className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </CardTitle>
          <CardDescription className="text-lg md:text-xl text-muted-foreground">
            Find answers to common questions about Achievo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border border-border rounded-lg shadow-sm bg-card">
                <AccordionTrigger className="p-4 text-left text-lg font-medium text-foreground hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 text-base text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-10 text-center">
            <p className="text-muted-foreground">
              Can't find the answer you're looking for?
            </p>
            <Button asChild variant="link" className="text-lg text-accent">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
