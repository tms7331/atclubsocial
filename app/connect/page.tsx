import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ConnectPage() {
  return (
    <div className="p-6 bg-gray-800/80 rounded-lg border border-green-400/20 shadow-lg">
      <h2 className="text-2xl font-pixel mb-6 accent-text">Connect</h2>
      <div className="space-y-6">
        <p className="font-body text-lg text-slate-200 leading-relaxed">
          Welcome to the Connect page! This is where you can find and connect with other members of ATClubSocial.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Bluesky Connect Card - Green - Order 1 on mobile and desktop */}
          <div className="content-card rounded-lg overflow-hidden order-1" style={{ minHeight: "160px" }}>
            <Link href="/blueskyconnect" className="block h-full">
              <div className="p-4 h-full hover:bg-gray-700/90 transition-colors flex flex-col">
                <h3 className="text-lg font-pixel mb-2 accent-text">Bluesky Connect</h3>
                <p className="font-body text-slate-300 mb-2">
                  Discover and connect with other Bluesky members who share your interests.
                </p>
                <div className="mt-auto text-right">
                  <span className="text-green-400 font-pixel text-xs flex items-center justify-end">
                    Explore <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Popup Events Card - Blue - Order 2 on mobile and desktop */}
          <div className="content-card-alt rounded-lg order-2" style={{ minHeight: "160px" }}>
            <div className="p-4 h-full flex flex-col">
              <h3 className="text-lg font-pixel mb-2 secondary-accent-text">Popup Events</h3>
              <p className="font-body text-slate-300 mb-2">
                Join others for watch parties, cooking parties, and more...
              </p>
              <div className="mt-auto text-right">
                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-pixel rounded inline-block">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Recommend-Swap Card - Green - Order 3 on mobile, Order 4 on desktop */}
          <div className="content-card rounded-lg order-3 md:order-4" style={{ minHeight: "160px" }}>
            <div className="p-4 h-full flex flex-col">
              <h3 className="text-lg font-pixel mb-2 accent-text">Recommend-Swap</h3>
              <p className="font-body text-slate-300 mb-2">Swap music, podcast, or YouTube recommendations.</p>
              <div className="mt-auto text-right">
                <span className="px-2 py-1 bg-green-600 text-white text-xs font-pixel rounded inline-block">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Groups Card - Blue - Order 4 on mobile, Order 3 on desktop */}
          <div className="content-card-alt rounded-lg order-4 md:order-3" style={{ minHeight: "160px" }}>
            <div className="p-4 h-full flex flex-col">
              <h3 className="text-lg font-pixel mb-2 secondary-accent-text">Groups</h3>
              <p className="font-body text-slate-300 mb-2">Join groups based on shared interests and activities.</p>
              <div className="mt-auto text-right">
                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-pixel rounded inline-block">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

