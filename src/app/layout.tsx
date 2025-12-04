import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ontario Flag Time Machine',
  description: 'Explore the history of the Ontario flag through an interactive vintage time machine',
  keywords: ['Ontario', 'flag', 'history', 'Canada', 'vexillology', 'TypeScript'],
  authors: [{ name: 'Julio Calvo' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body>
        {/* Noise texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
