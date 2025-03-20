'use client'
import * as React from 'react'

import Link from "next/link"

// Mock data for demonstration
const events = [
  {
    id: 1,
    title: "Event #1",
    date: "March 11, 2023",
    time: "7:00 PM",
    description: "This is a placeholder for event description. Join us for this exciting event!",
    theme: "green", // green or blue
  },
  {
    id: 2,
    title: "Event #2",
    date: "March 12, 2023",
    time: "8:00 PM",
    description: "This is a placeholder for event description. Join us for this exciting event!",
    theme: "blue",
  },
  {
    id: 3,
    title: "Event #3",
    date: "March 13, 2023",
    time: "9:00 PM",
    description: "This is a placeholder for event description. Join us for this exciting event!",
    theme: "green",
  },
]

// Mock users data
const users = [
  {
    id: 1,
    name: "Alex Johnson",
    interests: ["Technology", "Music", "Photography"],
    commonInterests: "You both share interests in Technology and Music.",
  },
  {
    id: 2,
    name: "Sam Rivera",
    interests: ["Art", "Gaming", "Travel"],
    commonInterests: "You both enjoy Art and have mentioned Travel recently.",
  },
  {
    id: 3,
    name: "Jordan Lee",
    interests: ["Technology", "Books", "Cooking"],
    commonInterests: "You both are interested in Technology and Books.",
  },
  {
    id: 4,
    name: "Taylor Kim",
    interests: ["Music", "Fitness", "Film"],
    commonInterests: "You both have Music and Film as common interests.",
  },
  {
    id: 5,
    name: "Morgan Chen",
    interests: ["Photography", "Travel", "Food"],
    commonInterests: "You both enjoy Photography and have talked about Food.",
  },
]

function EventConnectionsPage({ params }: { params: Promise<{ id: string }> }) {
  // Use React.use() to unwrap the Promise in client components
  const { id } = React.use(params)
  const eventId = Number.parseInt(id)
  const event = events.find((e) => e.id === eventId) || events[0]

  // Determine theme colors based on event theme
  const themeColor = event.theme === "blue" ? "blue" : "green"
  const bgColor = event.theme === "blue" ? "content-card-alt" : "content-card"
  const textColor = event.theme === "blue" ? "secondary-accent-text" : "accent-text"
  const buttonBg = event.theme === "blue" ? "bg-blue-600" : "bg-green-600"
  const hoverBg = event.theme === "blue" ? "hover:bg-blue-700" : "hover:bg-green-700"

  return (
    <div className="space-y-6">
      {/* Event Information */}
      <div className={`p-6 ${bgColor} rounded-lg border border-${themeColor}-400/20 shadow-lg`}>
        <h2 className={`text-2xl font-pixel mb-4 ${textColor}`}>{event.title}</h2>
        <div className="flex justify-between mb-3">
          <span className="font-body text-slate-300">Date: {event.date}</span>
          <span className="font-body text-slate-300">Time: {event.time}</span>
        </div>
        <p className="font-body text-slate-300 mb-4">{event.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-body text-sm text-slate-400">5 people attending</span>
          <button
            className={`px-3 py-1 ${buttonBg} ${hoverBg} text-white rounded font-pixel text-xs transition-colors`}
          >
            View Event Page
          </button>
        </div>
      </div>

      {/* Connections Section */}
      <div className="p-6 bg-gray-800/80 rounded-lg border border-gray-700 shadow-lg">
        <h3 className="text-xl font-pixel mb-6 text-slate-200">People Attending</h3>

        <div className="space-y-4">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/user-profile/${user.id}`}
              className="block p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600/50"
            >
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-blue-600 mr-4 flex-shrink-0"></div>
                <div className="flex-1">
                  <h4 className="font-pixel text-sm text-slate-200 mb-1">{user.name}</h4>
                  <div>
                    <span className="font-body text-xs text-slate-400 block mb-1">Common Interests:</span>
                    <p className="font-body text-sm text-slate-300">{user.commonInterests}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// Add default export
export default EventConnectionsPage

