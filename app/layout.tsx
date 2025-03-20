import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Pet Health Tracker</title>
        <meta
          name="description"
          content="Track your pets' health information, vaccinations, medications, and vet appointments"
        />
      </head>
      <body className="p-5">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="pet-health-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
