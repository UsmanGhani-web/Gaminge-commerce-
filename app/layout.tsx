import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './auth/auth.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GamingTech Pro - Premium PC Accessories Store',
  description: 'Modern 3D Gaming PC Accessories Online Store with Custom PC Builder',
  keywords: 'gaming, pc accessories, gaming mouse, gaming keyboard, gaming headset, custom pc build',
  authors: [{ name: 'GamingTech Pro' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 