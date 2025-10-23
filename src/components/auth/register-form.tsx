"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRegisterMutation, useCreateOrganizationMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { setCredentials } from '@/store/slices/authSlice';
import { Loader2, Mail, Lock, User, Building, Users } from 'lucide-react';
import { toast } from 'sonner';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  organizationName: z.string().optional(),
  organizationSlug: z.string().optional(),
  joinOrganizationSlug: z.string().optional(),
}).refine((data) => {
  // Either create new organization or join existing one
  const hasNewOrg = data.organizationName && data.organizationSlug;
  const hasJoinOrg = data.joinOrganizationSlug;
  return hasNewOrg || hasJoinOrg;
}, {
  message: "Either create a new organization or join an existing one",
  path: ["organizationName"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [register] = useRegisterMutation();
  const [createOrganization] = useCreateOrganizationMutation();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      organizationName: '',
      organizationSlug: '',
      joinOrganizationSlug: '',
    },
  });

  // Check if this is an invitation flow
  const invitationToken = searchParams.get('token');
  const isInvitationFlow = !!invitationToken;

  // Redirect to invitation acceptance form if there's a token
  useEffect(() => {
    if (isInvitationFlow) {
      router.push(`/auth/invite/${invitationToken}`);
    }
  }, [isInvitationFlow, invitationToken, router]);

  // Auto-generate organization slug from name
  const watchOrganizationName = form.watch('organizationName');
  useEffect(() => {
    if (watchOrganizationName) {
      const slug = watchOrganizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setValue('organizationSlug', slug);
    }
  }, [watchOrganizationName, form]);

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      if (values.joinOrganizationSlug) {
        // Join existing organization
        const result = await register({
          organizationSlug: values.joinOrganizationSlug,
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        }).unwrap();

        dispatch(setCredentials({
          user: result.user,
          tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          },
          organization: result.user.organization,
        }));

        toast.success('Account created successfully! Welcome to the organization.');
      } else {
        // Journey 1: Independent User → Organization Creator
        setIsCreatingOrg(true);
        
        // First create the organization
        const orgResult = await createOrganization({
          name: values.organizationName!,
          slug: values.organizationSlug!,
          plan: 'free',
        }).unwrap();

        // Then register the user with the new organization
        const result = await register({
          organizationId: orgResult.id,
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        }).unwrap();

        dispatch(setCredentials({
          user: result.user,
          tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          },
          organization: result.user.organization,
        }));

        toast.success('Account and organization created successfully!');
      }

      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
      setIsCreatingOrg(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">M</span>
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Create account</CardTitle>
        <CardDescription className="text-center">
          Get started with Mave CMS
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
              name="joinOrganizationSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Join Existing Organization (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter organization slug to join"
                        className="pl-10"
                        {...field}
                        disabled={isLoading}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Clear organization creation fields when joining
                          if (value) {
                            form.setValue('organizationName', '');
                            form.setValue('organizationSlug', '');
                          }
                          field.onChange(value);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="My Company"
                        className="pl-10"
                        {...field}
                        disabled={isLoading}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Clear join field when creating new organization
                          if (value) {
                            form.setValue('joinOrganizationSlug', '');
                          }
                          field.onChange(value);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Slug</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="my-company"
                        className="pl-10"
                        {...field}
                        disabled={isLoading}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Clear join field when creating new organization
                          if (value) {
                            form.setValue('joinOrganizationSlug', '');
                          }
                          field.onChange(value);
                        }}
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
            <Button type="submit" className="w-full" disabled={isLoading || isCreatingOrg}>
              {(isLoading || isCreatingOrg) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
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
