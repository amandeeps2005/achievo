// src/app/profile/page.tsx
"use client";

import { useAuth } from '@/context/auth-context';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/loading-spinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, ShieldCheck, CalendarClock, Briefcase, Edit3, Save, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const profileFormSchema = z.object({
  displayName: z.string().min(3, "Display name must be at least 3 characters.").max(50, "Display name can be at most 50 characters."),
});
type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user?.displayName || "",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      redirect('/');
    }
    if (user) {
      form.reset({ displayName: user.displayName || "" });
    }
  }, [user, authLoading, form]);

  if (authLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Loading Profile...</p>
      </div>
    );
  }

  const getInitials = (name?: string | null, email?: string | null): string | JSX.Element => {
    if (name && name.trim()) {
      const nameParts = name.trim().split(' ').filter(part => part.length > 0);
      if (nameParts.length > 1) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      }
      if (nameParts.length === 1 && nameParts[0].length > 0) {
        return nameParts[0].substring(0, Math.min(2, nameParts[0].length)).toUpperCase();
      }
    }
    if (email && email.trim()) {
      return email[0].toUpperCase();
    }
    return <User className="h-3/5 w-3/5 text-muted-foreground" />;
  };
  
  const memberSince = user.metadata.creationTime 
    ? formatDistanceToNow(new Date(user.metadata.creationTime), { addSuffix: true })
    : 'N/A';

  const userTitle = "N/A"; // Placeholder as title is not in user object

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to current user values if canceling
      form.reset({ displayName: user.displayName || "" });
    }
    setIsEditing(!isEditing);
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (!auth.currentUser) {
      toast({ title: "Error", description: "Not authenticated.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName,
      });
      toast({ title: "Success", description: "Profile updated successfully." });
      setIsEditing(false);
      // The onAuthStateChanged listener in AuthContext should pick up the change
      // and update the user object globally. If not, a manual refresh might be needed.
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update profile.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8 md:py-12">
      <Card className="max-w-2xl mx-auto shadow-xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="items-center text-center bg-gradient-to-br from-primary/10 via-card to-card p-8">
          <Avatar className="w-28 h-28 text-5xl mb-4 border-4 border-primary bg-primary/20 shadow-lg">
            {user.photoURL ? (
              <AvatarImage src={user.photoURL} alt={user.displayName || user.email || 'User Avatar'} />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
              {getInitials(user.displayName, user.email)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold text-primary">{user.displayName || "Achievo User"}</CardTitle>
          <CardDescription className="text-muted-foreground text-base">Your personal account details and journey with Achievo.</CardDescription>
           <Button onClick={handleEditToggle} variant={isEditing ? "secondary" : "outline"} size="sm" className="mt-4">
            {isEditing ? <XCircle className="mr-2 h-4 w-4" /> : <Edit3 className="mr-2 h-4 w-4" />}
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </Button>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="displayName" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Display Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl>
                          <Input id="displayName" {...field} className="pl-10" placeholder="Your display name" disabled={isSaving} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
                  <Mail className="w-7 h-7 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Email Address (cannot be changed here)</p>
                    <p className="text-md font-semibold text-foreground break-all">{user.email}</p>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? <LoadingSpinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </form>
            </Form>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.displayName && (
                  <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
                    <User className="w-7 h-7 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Full Name</p>
                      <p className="text-md font-semibold text-foreground break-words">{user.displayName}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
                  <Mail className="w-7 h-7 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Email Address</p>
                    <p className="text-md font-semibold text-foreground break-all">{user.email}</p>
                  </div>
                </div>
                
                {user.emailVerified !== undefined && (
                  <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
                    <ShieldCheck className={`w-7 h-7 shrink-0 ${user.emailVerified ? 'text-green-500' : 'text-yellow-500'}`} />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Email Verification</p>
                      <p className={`text-md font-semibold ${user.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                        {user.emailVerified ? "Verified" : "Not Verified"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
                  <Briefcase className="w-7 h-7 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Title</p>
                    <p className="text-md font-semibold text-foreground">{userTitle}</p>
                    {userTitle === "N/A" && <p className="text-xs text-muted-foreground">(Title information is not stored in user profile)</p>}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
                <CalendarClock className="w-7 h-7 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Member Since</p>
                  <p className="text-md font-semibold text-foreground">{memberSince}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
                <User className="w-7 h-7 text-primary shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">User ID</p>
                  <p className="text-xs font-mono text-foreground break-all">{user.uid}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="bg-muted/20 p-6 border-t border-border">
          <Button asChild variant="outline" className="w-full sm:w-auto mx-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

