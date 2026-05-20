import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK'],
})

export const metadata: Metadata = {
  title: 'AWS Cloud Club UniUyo | Build, Learn & Grow in the Cloud',
  description:
    'Join a vibrant community of innovators, creators, and students at the University of Uyo exploring AWS Cloud technologies and real-world solutions.',
  openGraph: {
    title: 'AWS Cloud Club UniUyo',
    description: 'Build, Learn & Grow in the Cloud with AWS Student Community UniUyo.',
    url: 'https://awsccuniuyo.vercel.app',
    siteName: 'AWS Cloud Club UniUyo',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AWSUniuyo',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
