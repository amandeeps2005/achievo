
// src/components/app-footer.tsx
"use client";

import Link from 'next/link';

export default function AppFooter() {
  return (
    <footer className="py-10 bg-card border-t border-border">
      <div className="container mx-auto px-6 text-center text-muted-foreground">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
          <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
          <Link href="/feedback" className="hover:text-primary transition-colors">Feedback</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Achievo. All rights reserved.</p>
        <p className="text-sm mt-1">Your Personal Goal Achievement System.</p>
      </div>
    </footer>
  );
}
