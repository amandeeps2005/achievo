
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function TermsOfServicePage() {
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
          <FileText className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-6" />
          <CardTitle className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Terms of Service
          </CardTitle>
          <CardDescription className="text-lg md:text-xl text-muted-foreground">
            Please read these terms carefully before using Achievo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-foreground prose dark:prose-invert max-w-none">
          <p><strong>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>

          <p>Welcome to Achievo! These Terms of Service ("Terms", "Terms of Service") govern your use of our web application (the "Service") operated by Achievo ("us", "we", or "our").</p>
          <p>Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who wish to access or use the Service.</p>
          <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you do not have permission to access the Service.</p>

          <h2>1. Accounts</h2>
          <p>When you create an account with us, you guarantee that you are above the age of 13, and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.</p>
          <p>You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.</p>

          <h2>2. Intellectual Property</h2>
          <p>The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Achievo and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Achievo.</p>
          <p>You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for Content you or any third-party posts on or through the Service.</p>

          <h2>3. Use of AI Features</h2>
          <p>The Service utilizes artificial intelligence (AI) to provide features such as goal decomposition and smart suggestions. While we strive to provide accurate and helpful information, AI-generated content may sometimes be inaccurate, incomplete, or reflect biases from the data it was trained on. You acknowledge that any reliance on AI-generated content is at your own risk. Achievo is not liable for any decisions made or actions taken based on such content. Data you provide to AI features will be processed as described in our Privacy Policy.</p>

          <h2>4. Prohibited Uses</h2>
          <p>You agree not to use the service:</p>
          <ul>
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
            <li>To impersonate or attempt to impersonate Achievo, an Achievo employee, another user, or any other person or entity.</li>
            <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm or offend Achievo or users of the Service or expose them to liability.</li>
          </ul>
          
          <h2>5. Termination</h2>
          <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
          <p>If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.</p>
          
          <h2>6. Disclaimer of Warranties; Limitation of Liability</h2>
          <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Achievo makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content or materials included therein. You expressly agree that your use of these services, their content, and any services or items obtained from us is at your sole risk.</p>
          <p>Neither Achievo nor any person associated with Achievo makes any warranty or representation with respect to the completeness, security, reliability, quality, accuracy, or availability of the services. Without limiting the foregoing, neither Achievo nor anyone associated with Achievo represents or warrants that the services, their content, or any services or items obtained through the services will be accurate, reliable, error-free, or uninterrupted, that defects will be corrected, that the services or the server that makes it available are free of viruses or other harmful components or that the services or any services or items obtained through the services will otherwise meet your needs or expectations.</p>

          <h2>7. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction - e.g., State of California, USA], without regard to its conflict of law provisions.</p>

          <h2>8. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
          <p>By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.</p>

          <h2>9. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at support@achievo.app (Placeholder).</p>
          {/* Placeholder content - replace with your actual terms */}
        </CardContent>
      </Card>
    </div>
  );
}
