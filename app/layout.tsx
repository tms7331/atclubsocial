import "./globals.css"
import { Press_Start_2P, VT323, Inter, Space_Grotesk } from "next/font/google"
import type React from "react"
import Link from "next/link"
import FloatingPixels from "./components/FloatingPixels"
import PixelatedBackground from "./components/PixelatedBackground"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
})

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata = {
  title: "ATClubSocial",
  description: "Connect and discover events",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} ${vt323.variable} ${inter.variable} ${spaceGrotesk.variable} font-sans bg-gray-900 text-slate-200 dark:bg-gray-900 dark:text-slate-200`}
      >
        <PixelatedBackground />

        {/* Fixed Navbar - More Compact */}
        <header className="fixed top-0 left-0 right-0 bg-gray-900 z-10 border-b border-green-400/30">
          <div className="max-w-4xl mx-auto px-4">
            {/* Top Row - Only Title */}
            <div className="flex justify-center py-2">
              <h1 className="text-xl font-bold font-pixel navbar-text">ATClubSocial</h1>
            </div>

            {/* Second Row - All Navigation Buttons */}
            <div className="flex justify-center space-x-4 pb-2">
              <Link
                href="/connect"
                className="font-pixel text-xs hover:text-green-300 transition-colors pixelated-border px-2 py-1 navbar-text"
              >
                Connect
              </Link>
              <Link
                href="/events"
                className="font-pixel text-xs hover:text-green-300 transition-colors pixelated-border px-2 py-1 navbar-text"
              >
                Events
              </Link>
              <Link
                href="/profile"
                className="font-pixel text-xs hover:text-green-300 transition-colors pixelated-border px-2 py-1 navbar-text"
              >
                Profile
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 pt-24">
          <main className="py-6">{children}</main>
        </div>
        <FloatingPixels />
      </body>
    </html>
  )
}

