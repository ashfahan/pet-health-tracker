import type React from "react"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Pet Health Tracker</title>
        <meta name="description" content="Track your pets' health information, vaccinations, medications, and vet appointments" />
      </head>
      <body className="p-5">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="pet-health-theme">
          {children}
          <Toaster position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
