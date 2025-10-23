"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  Upload, 
  Globe,
  Shield,
  Zap
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <h1 className="text-2xl font-bold">Mave CMS v2.0</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Documentation</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">
            The Future of{" "}
            <span className="text-primary">Headless CMS</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Built with Next.js 16, Turbopack, and React 19. Experience lightning-fast 
            content management with enterprise-grade security and scalability.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="px-8">
              Start Building
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Why Choose Mave CMS v2.0?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with modern technologies and designed for scale from day one.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Powered by Next.js 16 and Turbopack for 10x faster builds and development.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Advanced RBAC/ABAC with 2FA/MFA support and complete audit logging.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Global CDN</CardTitle>
                <CardDescription>
                  Built-in CDN with automatic image optimization and global edge caching.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Dynamic Content</CardTitle>
                <CardDescription>
                  Create any content structure without code changes. Full version control.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multi-Tenant</CardTitle>
                <CardDescription>
                  Complete organization isolation with custom domains and workspaces.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Track content performance with real-time analytics and insights.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Built with Modern Tech</h3>
            <p className="text-lg text-muted-foreground">
              Leveraging the latest technologies for optimal performance and developer experience.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">N16</span>
              </div>
              <h4 className="font-semibold">Next.js 16</h4>
              <p className="text-sm text-muted-foreground">Turbopack enabled</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">R19</span>
              </div>
              <h4 className="font-semibold">React 19</h4>
              <p className="text-sm text-muted-foreground">Latest features</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">GQL</span>
              </div>
              <h4 className="font-semibold">GraphQL</h4>
              <p className="text-sm text-muted-foreground">Type-safe APIs</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">TS</span>
              </div>
              <h4 className="font-semibold">TypeScript</h4>
              <p className="text-sm text-muted-foreground">Type safety</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">M</span>
              </div>
              <span className="font-semibold">Mave CMS v2.0</span>
            </div>
            <p className="text-muted-foreground">
              Made with ❤️ by <a href="https://atiqisrak.vercel.app" className="text-primary hover:underline">Atiq Israk</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}