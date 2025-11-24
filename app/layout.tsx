import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/contexts/ThemeContext'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Testograph - Твоят личен план за тестостерон',
  description: 'Персонализиран 30-дневен план за повишаване на тестостерона с точни хранителни препоръки, тренировки и TestoUp добавка',
  keywords: ['тестостерон', 'TestoUp', 'хранителен план', 'тренировки', 'либидо', 'енергия', 'мускулна маса'],
  authors: [{ name: 'Testograph' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Testograph',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Testograph',
    title: 'Testograph - Твоят личен план за тестостерон',
    description: 'Персонализиран 30-дневен план за повишаване на тестостерона',
    locale: 'bg_BG',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bg" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
