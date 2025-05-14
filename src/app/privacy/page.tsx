
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
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
          <ShieldCheck className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-6" />
          <CardTitle className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Privacy Policy
          </CardTitle>
          <CardDescription className="text-lg md:text-xl text-muted-foreground">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-foreground prose dark:prose-invert max-w-none">
          <p><strong>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>

          <p>Achievo ("us", "we", or "our") operates the Achievo application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>

          <h2>1. Information Collection and Use</h2>
          <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
          <h3>Types of Data Collected</h3>
          <h4>Personal Data</h4>
          <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
          <ul>
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Profile picture (if provided)</li>
            <li>Goal descriptions and related data you input</li>
            <li>Usage Data</li>
          </ul>
          <h4>Usage Data</h4>
          <p>We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
          <h4>Data provided to AI Models</h4>
          <p>When you use features that interact with our AI models (e.g., goal decomposition, smart suggestions), the text you provide (like goal descriptions) is sent to these models to generate responses. We do not use this data to train third-party AI models beyond the immediate processing required to provide the service. The specific AI provider (e.g., Google via Genkit) may have its own data handling policies for the data processed by their models, which we recommend you review.</p>

          <h2>2. Use of Data</h2>
          <p>Achievo uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>

          <h2>3. Data Storage and Security</h2>
          <p>Your goal data, journal entries, and habit tracking information are stored locally in your browser's localStorage. User authentication information (email, encrypted password, display name, photo URL) is managed by Firebase Authentication. Profile pictures are stored in Firebase Storage. We strive to use commercially acceptable means to protect your Personal Data, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.</p>
          
          <h2>4. Service Providers</h2>
          <p>We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), provide the Service on our behalf, perform Service-related services or assist us in analysing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose. We use Firebase for authentication and storage, and Google (via Genkit) for AI functionalities.</p>

          <h2>5. Your Data Rights</h2>
          <p>You have the right to access, update or delete the information we have on you. Since much of your goal-specific data is stored in localStorage, you can clear this data by clearing your browser's site data for Achievo. Account information managed by Firebase can be managed through your profile or by contacting us for account deletion.</p>

          <h2>6. Children's Privacy</h2>
          <p>Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>

          <h2>7. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@achievo.app (Placeholder).</p>
          {/* Placeholder content - replace with your actual privacy policy */}
        </CardContent>
      </Card>
    </div>
  );
}
