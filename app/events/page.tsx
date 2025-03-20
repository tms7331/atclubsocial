import Link from "next/link"

export default function EventsPage() {
  return (
    <div className="p-6 bg-gray-800/80 rounded-lg border border-green-400/20 shadow-lg">
      <h2 className="text-2xl font-pixel mb-6 accent-text">Events</h2>
      <div className="space-y-6">
        <p className="font-body text-lg text-slate-200 leading-relaxed">
          Attach your Luma account to connect at live events.
        </p>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`p-4 ${i % 2 === 0 ? "content-card-alt" : "content-card"} rounded-lg`}>
              <h3 className={`text-lg font-pixel mb-2 ${i % 2 === 0 ? "secondary-accent-text" : "accent-text"}`}>
                Event #{i}
              </h3>
              <div className="flex justify-between mb-2">
                <span className="font-body text-slate-300">Date: March {i + 10}, 2023</span>
                <span className="font-body text-slate-300">Time: {6 + i}:00 PM</span>
              </div>
              <p className="font-body mb-3 text-slate-300">
                This is a placeholder for event description. Join us for this exciting event!
              </p>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
                <Link
                  href={`/event-connections/${i}`}
                  className={`px-3 py-1 ${i % 2 === 0 ? "bg-blue-600" : "bg-green-600"} text-white rounded font-pixel text-xs text-center whitespace-nowrap`}
                >
                  Make Connections
                </Link>
                <button
                  className={`px-3 py-1 ${i % 2 === 0 ? "bg-blue-600" : "bg-green-600"} text-white rounded font-pixel text-xs text-center whitespace-nowrap`}
                >
                  View Event Page
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

