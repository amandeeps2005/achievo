
// src/app/profile/page.tsx
"use client";

import { useAuth } from '@/context/auth-context';
import { redirect } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import LoadingSpinner from '@/components/loading-spinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, ShieldCheck, CalendarClock, Briefcase, Edit3, Save, XCircle, Send, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth, storage } from '@/lib/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const titleOptions = [
  { value: "N/A", label: "N/A (Not Specified)" },
  { value: "student", label: "Student" },
  { value: "employee", label: "Employee" },
  { value: "businessman", label: "Business Owner" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "homemaker", label: "Homemaker" },
  { value: "freelancer", label: "Freelancer" },
  { value: "researcher", label: "Researcher" },
  { value: "other", label: "Other" },
];

const profileFormSchema = z.object({
  displayName: z.string().min(3, "Display name must be at least 3 characters.").max(50, "Display name can be at most 50 characters."),
  title: z.string().optional(),
});
type ProfileFormData = z.infer<typeof profileFormSchema>;

const MAX_IMAGE_WIDTH = 512;
const MAX_IMAGE_HEIGHT = 512;
const IMAGE_QUALITY = 0.8; // JPEG quality (0.0 to 1.0)
const IMAGE_TYPE = 'image/jpeg';


export default function ProfilePage() {
  const { user, loading: authLoading, setUser: setAuthUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [profileTitle, setProfileTitle] = useState<string>("N/A");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
      title: "N/A",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      redirect('/');
    }
    if (user) {
      const storedTitle = localStorage.getItem(`user_${user.uid}_title`);
      const currentTitle = storedTitle || "N/A";
      setProfileTitle(currentTitle);
      form.reset({ 
        displayName: user.displayName || "",
        title: currentTitle,
      });
      // Set initial preview URL from user's photoURL if editing is not active
      // or if no new file has been selected for preview.
      if (!previewUrl && user.photoURL) {
        setPreviewUrl(user.photoURL);
      }
    }
  }, [user, authLoading, form, previewUrl]); // Added previewUrl to dependency array

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Revoke previous object URL if it exists and is a blob URL
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          if (width > height) {
            if (width > MAX_IMAGE_WIDTH) {
              height = Math.round((height * MAX_IMAGE_WIDTH) / width);
              width = MAX_IMAGE_WIDTH;
            }
          } else {
            if (height > MAX_IMAGE_HEIGHT) {
              width = Math.round((width * MAX_IMAGE_HEIGHT) / height);
              height = MAX_IMAGE_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            toast({ title: "Error", description: "Could not process image. Canvas context not available.", variant: "destructive" });
            setSelectedFile(file); // Fallback to original file
            setPreviewUrl(URL.createObjectURL(file));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, {
                  type: IMAGE_TYPE,
                  lastModified: Date.now(),
                });
                setSelectedFile(resizedFile);
                setPreviewUrl(URL.createObjectURL(resizedFile));
              } else {
                toast({ title: "Error", description: "Failed to resize image.", variant: "destructive" });
                setSelectedFile(file); // Fallback to original file
                setPreviewUrl(URL.createObjectURL(file));
              }
            },
            IMAGE_TYPE,
            IMAGE_QUALITY
          );
        };
        img.onerror = () => {
          toast({ title: "Error", description: "Failed to load image for resizing.", variant: "destructive" });
          setSelectedFile(file); // Fallback to original file
          setPreviewUrl(URL.createObjectURL(file));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        toast({ title: "Error", description: "Failed to read file.", variant: "destructive" });
        setSelectedFile(file); // Fallback to original file
        setPreviewUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
    // Reset the file input value so the same file can be selected again if needed
    if (event.target) {
        event.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };


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

  const handleEditToggle = () => {
    if (isEditing) { // When cancelling edit
      form.reset({ 
        displayName: user.displayName || "",
        title: profileTitle, // Use state for profile title
       });
       setSelectedFile(null);
       // Revoke blob URL if it exists, then reset preview to actual user photoURL or null
       if (previewUrl && previewUrl.startsWith('blob:')) {
         URL.revokeObjectURL(previewUrl);
       }
       setPreviewUrl(user.photoURL || null); 
    } else { // When entering edit mode
       form.reset({ 
        displayName: user.displayName || "",
        title: profileTitle, // Use state for profile title
       });
       // Set previewUrl to user's current photoURL if no new file is selected yet
       setPreviewUrl(user.photoURL || null);
    }
    setIsEditing(!isEditing);
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (!auth.currentUser) {
      toast({ title: "Error", description: "Not authenticated.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    let photoURL = user.photoURL; 

    try {
      if (selectedFile) {
        // Ensure a unique name or handle potential overwrites if necessary, though UID folder helps.
        // For simplicity, using selectedFile.name. Could be `${auth.currentUser.uid}_profile.${selectedFile.name.split('.').pop()}`
        const imageRef = storageRef(storage, `profilePictures/${auth.currentUser.uid}/${selectedFile.name}`);
        await uploadBytes(imageRef, selectedFile);
        photoURL = await getDownloadURL(imageRef);
        toast({ title: "Image Uploaded", description: "Profile picture updated successfully." });
      }

      await updateProfile(auth.currentUser, {
        displayName: data.displayName,
        photoURL: photoURL, 
      });
      
      const newTitle = data.title || "N/A";
      setProfileTitle(newTitle); // Update local state for title
      localStorage.setItem(`user_${auth.currentUser.uid}_title`, newTitle);
      
      // Attempt to update auth context user for immediate UI reflection
      if (setAuthUser && auth.currentUser) { 
          // Create a new user object for the context with all known properties
          const updatedUserFromAuth = auth.currentUser; // Get the latest from Firebase Auth
          const updatedUserForContext: User = {
            ...updatedUserFromAuth,
            displayName: data.displayName, // from form
            photoURL: photoURL, // from upload or existing
            // Ensure all other User properties are spread if needed,
            // but Firebase User type is complex. Rely on onAuthStateChanged for full sync.
          };
          setAuthUser(updatedUserForContext); 
      }

      toast({ title: "Success", description: "Profile updated successfully." });
      setIsEditing(false);
      setSelectedFile(null); 
      // previewUrl is already set to the new photoURL (or remains old if no new image) by the auth update.
      // If we set `selectedFile` to null, we might want to also explicitly set `previewUrl` to the `photoURL`
      // from the update operation to ensure consistency.
      if (photoURL) {
        setPreviewUrl(photoURL);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update profile.", variant: "destructive" });
    } finally {
      setIsSaving(false); 
    }
  };

  const handleResendVerificationEmail = async () => {
    if (!auth.currentUser) {
      toast({ title: "Error", description: "Not authenticated.", variant: "destructive" });
      return;
    }
    setIsResendingVerification(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast({
        title: "Verification Email Sent",
        description: "A new verification email has been sent to your address. Please check your inbox (and spam folder).",
      });
    } catch (error: any) {
      let description = "Failed to send verification email. Please try again later.";
      if (error.code === 'auth/too-many-requests') {
        description = "Too many requests. Please wait a while before trying to resend the verification email.";
      }
      toast({
        title: "Error",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsResendingVerification(false);
    }
  };


  return (
    <div className="container mx-auto py-8 md:py-12">
      <Card className="max-w-2xl mx-auto shadow-xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="items-center text-center bg-gradient-to-br from-primary/10 via-card to-card p-8">
          <div className="relative">
            <Avatar className="w-28 h-28 text-5xl mb-4 border-4 border-primary bg-primary/20 shadow-lg">
              {previewUrl ? (
                <AvatarImage src={previewUrl} alt={user.displayName || user.email || 'User Avatar'} />
              ) : (user.photoURL &&  // Check user.photoURL explicitly here as previewUrl might be null if no blob was created yet
                <AvatarImage src={user.photoURL} alt={user.displayName || user.email || 'User Avatar'} />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                {getInitials(user.displayName, user.email)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute bottom-4 right-0 rounded-full h-8 w-8 bg-background hover:bg-muted border-primary/50"
                onClick={triggerFileInput}
                aria-label="Change profile picture"
                disabled={isSaving}
              >
                <Camera className="h-4 w-4 text-primary" />
              </Button>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            disabled={!isEditing || isSaving}
          />
          <CardTitle className="text-3xl font-bold text-primary">{user.displayName || "Achievo User"}</CardTitle>
          <CardDescription className="text-muted-foreground text-base">Your personal account details and journey with Achievo.</CardDescription>
           <Button onClick={handleEditToggle} variant={isEditing ? "secondary" : "outline"} size="sm" className="mt-4" disabled={isSaving}>
            {isEditing ? <XCircle className="mr-2 h-4 w-4" /> : <Edit3 className="mr-2 h-4 w-4" />}
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </Button>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          {!user.emailVerified && (
            <Alert variant="default" className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700">
               <ShieldCheck className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <AlertTitle className="text-yellow-700 dark:text-yellow-300">Verify Your Email</AlertTitle>
              <AlertDescription className="text-yellow-600 dark:text-yellow-500">
                Your email address is not verified. Please check your inbox for a verification link, or resend it.
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleResendVerificationEmail}
                  disabled={isResendingVerification}
                  className="p-0 h-auto ml-1 text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200 underline"
                >
                  {isResendingVerification ? <LoadingSpinner size={16} className="mr-1" /> : <Send className="mr-1 h-3 w-3" />}
                  {isResendingVerification ? "Sending..." : "Resend Verification Email"}
                </Button>
              </AlertDescription>
            </Alert>
          )}

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

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="title" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Title</Label>
                       <Select onValueChange={field.onChange} value={field.value || "N/A"} disabled={isSaving}>
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
                      <p className={`text-md font-semibold ${user.emailVerified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                        {user.emailVerified ? "Verified" : "Not Verified"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
                  <Briefcase className="w-7 h-7 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Title</p>
                    <p className="text-md font-semibold text-foreground">{profileTitle}</p>
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

