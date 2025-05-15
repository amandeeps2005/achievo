
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel as RadixSelectLabel } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ShadcnCardDescription } from '@/components/ui/card';
import { ArrowLeft, MessageSquareHeart, Send } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/loading-spinner';

const feedbackTypes = ["General Comment", "Bug Report", "Feature Request", "Praise", "Other"];

const feedbackFormSchema = z.object({
  feedbackType: z.string().min(1, "Please select a feedback type."),
  subject: z.string().min(5, "Subject must be at least 5 characters.").max(100, "Subject too long (max 100 chars)."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(2000, "Description too long (max 2000 chars)."),
  email: z.string().email("Invalid email address.").optional().or(z.literal("")),
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

export default function FeedbackPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      feedbackType: "",
      subject: "",
      description: "",
      email: user?.email || "",
    },
  });

  // Update email field if user logs in/out while on the page
  useState(() => {
    if (user) {
      form.setValue('email', user.email || "");
    } else {
      form.setValue('email', "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  });


  const onSubmit: SubmitHandler<FeedbackFormData> = async (data) => {
    setIsSubmitting(true);
    // Placeholder: In a real app, you'd send this data to a backend/service
    console.log("Feedback submitted:", data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Feedback Submitted!",
      description: "Thank you for your valuable feedback. We'll review it shortly. (This is a demo, no data was actually sent).",
    });
    form.reset({
        feedbackType: "",
        subject: "",
        description: "",
        email: user?.email || "",
    });
    setIsSubmitting(false);
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href={user ? "/dashboard" : "/"}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to {user ? "Dashboard" : "Home"}
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <MessageSquareHeart className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-6" />
          <CardTitle className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Share Your Feedback
          </CardTitle>
          <ShadcnCardDescription className="text-lg md:text-xl text-muted-foreground">
            We value your input! Help us improve Achievo by sharing your thoughts, suggestions, or any issues you've encountered.
          </ShadcnCardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="feedbackType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Feedback</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a feedback type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <RadixSelectLabel>Feedback Type</RadixSelectLabel>
                          {feedbackTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Suggestion for Habit Tracker" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Feedback</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Please describe your feedback in detail..." {...field} rows={6} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} disabled={isSubmitting || !!user?.email} />
                    </FormControl>
                    <ShadcnCardDescription className="text-xs">We may contact you for more details if needed. Pre-filled if you are logged in.</ShadcnCardDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner className="mr-2" /> : <Send className="mr-2 h-5 w-5" />}
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
