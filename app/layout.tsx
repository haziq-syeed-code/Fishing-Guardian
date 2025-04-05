import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"
import { Settings } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fishing Assistant",
  description: "Weather and fishing predictions for Tamil Nadu fishermen",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
              <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Fishing Assistant
                </Link>
                <nav className="flex items-center gap-4">
                  <Link
                    href="/"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/map"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Map
                  </Link>
                  <Link
                    href="/alerts"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Alerts
                  </Link>
                  <Link
                    href="/route-optimizer"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Route
                  </Link>
                  <Link
                    href="/report"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Report
                  </Link>
                  <Link
                    href="/settings"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                </nav>
              </div>
            </header>
            <main className="container mx-auto px-4 py-8">{children}</main>
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
              <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
                <p>© {new Date().getFullYear()} Fishing Assistant. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'