
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, UserPlus, Chrome, GithubIcon, User, Briefcase } from "lucide-react"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const titleOptions = [
  { value: "student", label: "Student" },
  { value: "employee", label: "Employee" },
  { value: "businessman", label: "Business Owner" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "homemaker", label: "Homemaker" },
  { value: "freelancer", label: "Freelancer" },
  { value: "researcher", label: "Researcher" },
  { value: "other", label: "Other (Please specify)" },
];

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
        setError("First Name and Last Name are required.");
        return;
    }
    if (!title) {
        setError("Please select or specify your title.");
        return;
    }
    if (title === "other" && !customTitle.trim()) {
        setError("Please specify your title if 'Other' is selected.");
        return;
    }


    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        // Note: 'title' (and customTitle) are not standard Firebase Auth profile fields.
        // To store them persistently associated with the user, you'd typically use
        // a database like Firestore, keyed by userCredential.user.uid.
        // For this example, we're only setting displayName.
      }
      
      router.push('/dashboard'); 
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('The email address is already in use by another account.');
      } else if (err.code === 'auth/weak-password') {
        setError('The password is too weak. Please choose a stronger password.');
      }
      else {
        setError(err.message || 'An unexpected error occurred during registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (providerType: 'google' | 'github') => {
    setError(null);
    setLoading(true);
    const provider = providerType === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard'); 
    } catch (err: any) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email address but different sign-in credentials. Try signing in with the original method.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing. Please try again.');
      } else {
        setError(err.message || `Failed to sign in with ${providerType}.`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const isFormValid = 
    email.trim().length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    password.length >= 6 &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    title.length > 0 &&
    (title !== "other" || (title === "other" && customTitle.trim().length > 0));


  return (
    <Card className="w-full max-w-lg shadow-xl my-8"> {/* Increased max-w for more fields */}
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Create an Account</CardTitle>
        <CardDescription>Join Achievo and start achieving your goals today!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Registration Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Select onValueChange={setTitle} value={title} disabled={loading}>
              <SelectTrigger id="title" className="w-full">
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select your title" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {titleOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {title === "other" && (
            <div className="space-y-2">
              <Label htmlFor="customTitle">Specify Title</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="customTitle"
                  type="text"
                  placeholder="e.g., Software Developer"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  required
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="•••••••• (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Register
              </>
            )}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or sign up with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => handleSocialSignIn('google')} disabled={loading}>
            <Chrome className="mr-2 h-4 w-4" /> Google
          </Button>
          <Button variant="outline" onClick={() => handleSocialSignIn('github')} disabled={loading}>
            <GithubIcon className="mr-2 h-4 w-4" /> GitHub
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" passHref legacyBehavior>
            <a className="font-semibold text-primary hover:underline">Sign In</a>
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterPage;

