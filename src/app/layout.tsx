import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { GraphQLProvider } from "@/components/providers/graphql-provider";
import { AuthInitializer } from "@/components/providers/auth-initializer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mave CMS v2.0",
  description: "The Future of Headless Content Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <GraphQLProvider>
            <AuthInitializer>
              {children}
            </AuthInitializer>
            <Toaster />
          </GraphQLProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
