
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ContactUsPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for form submission logic
    toast({
      title: "Message Sent (Placeholder)",
      description: "Thank you for contacting us! We will get back to you shortly. (This is a demo, no email was actually sent).",
    });
    // Optionally, reset the form
    (event.target as HTMLFormElement).reset();
  };

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
          <Mail className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-6" />
          <CardTitle className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Contact Us
          </CardTitle>
          <CardDescription className="text-lg md:text-xl text-muted-foreground">
            We'd love to hear from you! Whether you have a question, feedback, or need support, feel free to reach out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <Input id="name" type="text" placeholder="Your Name" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="subject" className="text-foreground">Subject</Label>
              <Input id="subject" type="text" placeholder="How can we help?" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="message" className="text-foreground">Message</Label>
              <Textarea id="message" placeholder="Your message here..." rows={5} required className="mt-1" />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <MessageSquare className="mr-2 h-5 w-5" /> Send Message
            </Button>
          </form>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Alternatively, you can reach us at:</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
              <div className="flex items-center text-primary">
                <Mail className="mr-2 h-5 w-5" />
                <a href="mailto:support@achievo.app" className="hover:underline">support@achievo.app (Placeholder)</a>
              </div>
              <div className="flex items-center text-primary">
                <Phone className="mr-2 h-5 w-5" />
                <span>+1 (555) 123-4567 (Placeholder)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
