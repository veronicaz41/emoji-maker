import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import Headers from '@/components/Headers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emoji Maker",
  description: "Generate custom emojis with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className={inter.className}>
          <Headers />
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
