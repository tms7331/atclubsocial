import BlinkingCursor from "./components/BlinkingCursor"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-pixel accent-text mb-4">Enter ATClub</h1>
        <div className="flex justify-center items-center">
          <span className="font-body text-xl text-slate-200 mr-1">Join the club, find your people</span>
          <BlinkingCursor />
        </div>
      </div>

      <Link
        href="/connect"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-pixel text-sm transition-colors duration-200 flex items-center"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
        Login with Bluesky
      </Link>
    </div>
  )
}

