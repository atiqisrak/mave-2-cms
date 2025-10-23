"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useValidateInvitationTokenQuery, useRegisterWithInvitationMutation } from '@/store/api/invitationApi';
import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { setCredentials, setInvitationToken } from '@/store/slices/authSlice';
import { Loader2, Mail, Lock, User, Building, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const inviteAcceptanceSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type InviteAcceptanceFormValues = z.infer<typeof inviteAcceptanceSchema>;

interface InviteAcceptanceFormProps {
  token: string;
}

export function InviteAcceptanceForm({ token }: InviteAcceptanceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { 
    data: invitationData, 
    isLoading: isValidatingInvitation, 
    error: invitationError 
  } = useValidateInvitationTokenQuery({ token });

  const [registerWithInvitation] = useRegisterWithInvitationMutation();

  const form = useForm<InviteAcceptanceFormValues>({
    resolver: zodResolver(inviteAcceptanceSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  // Pre-fill email from invitation
  useEffect(() => {
    if (invitationData?.invitation?.email) {
      form.setValue('email', invitationData.invitation.email);
    }
  }, [invitationData, form]);

  const onSubmit = async (values: InviteAcceptanceFormValues) => {
    if (!invitationData?.invitation) return;

    setIsLoading(true);
    try {
      const result = await registerWithInvitation({
        token,
        email: invitationData.invitation.email || values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      }).unwrap();

      // Store credentials in Redux
      dispatch(setCredentials({
        user: result.user,
        tokens: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        organization: result.user.organization,
      }));

      // Clear invitation token
      dispatch(setInvitationToken(null));

      toast.success('Account created successfully! Welcome to the team.');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidatingInvitation) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Validating invitation...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (invitationError || !invitationData?.isValid) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-destructive">Invalid Invitation</CardTitle>
          <CardDescription>
            This invitation link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full" 
            onClick={() => router.push('/auth/login')}
          >
            Go to Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">M</span>
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Join the Team</CardTitle>
        <CardDescription className="text-center">
          You've been invited to join {invitationData.invitation?.organization?.name || 'the organization'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="John"
                          className="pl-10"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Doe"
                          className="pl-10"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                        {...field}
                        disabled
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Create a password"
                        className="pl-10"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Accept Invitation
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/auth/login')}>
            Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
