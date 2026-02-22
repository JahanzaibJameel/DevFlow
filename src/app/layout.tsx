import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { Toaster } from '@/components/ui/sonner'
import { PostHogProvider } from '@/components/providers/posthog-provider'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DevFlow - Project Management for Freelancers & Teams',
  description: 'Enterprise-grade project management platform with AI integration',
  keywords: ['project management', 'freelancer', 'team', 'SaaS', 'AI'],
  authors: [{ name: 'DevFlow Team' }],
  creator: 'DevFlow',
  publisher: 'DevFlow',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://devflow.vercel.app',
    title: 'DevFlow - Project Management for Freelancers & Teams',
    description: 'Enterprise-grade project management platform with AI integration',
    siteName: 'DevFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevFlow - Project Management for Freelancers & Teams',
    description: 'Enterprise-grade project management platform with AI integration',
    creator: '@devflow',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
              <Toaster />
              <Analytics />
            </QueryProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}