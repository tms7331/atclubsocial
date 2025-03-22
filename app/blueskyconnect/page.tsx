"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AtclubCommonality } from "@/utils/db"
import { useAtom } from 'jotai'
import { didAtom } from '../atoms/profile'

export default function BlueskyConnectPage() {
  const [connectOption, setConnectOption] = useState<string>("professional")
  const [localOnly, setLocalOnly] = useState<boolean>(false)
  const [connections, setConnections] = useState<AtclubCommonality[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [did] = useAtom(didAtom)

  useEffect(() => {
    const fetchCommonalities = async () => {
      if (!did) return;

      try {
        const response = await fetch(`/api/get-commonalities?did0=${did}`)
        const data = await response.json()

        if (data.success) {
          setConnections(data.commonalities)
        }
      } catch (error) {
        console.error("Failed to fetch connections:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCommonalities()
  }, [did])

  return (
    <div className="space-y-6">
      {/* Introduction Section */}
      <div className="p-6 content-card rounded-lg border border-green-400/20 shadow-lg">
        <h2 className="text-2xl font-pixel mb-4 accent-text">Bluesky Connect</h2>
        <p className="font-body text-lg text-slate-200 leading-relaxed mb-6">
          Find and connect with other Bluesky members who share your interests and passions. Select your preferred
          connection type to discover like-minded people.
        </p>

        {/* Connection Options */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
            {/* Option 1: Professional Connect */}
            <div
              className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${connectOption === "professional"
                ? "border-green-500 bg-green-500/10"
                : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
                }`}
              onClick={() => setConnectOption("professional")}
            >
              <div className="flex items-center mb-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${connectOption === "professional" ? "border-green-500" : "border-gray-500"
                    }`}
                >
                  {connectOption === "professional" && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                </div>
                <h3 className="font-pixel text-base accent-text">Professional Connect</h3>
              </div>
              <p className="font-body text-sm text-slate-300 ml-6">
                Connect based on professional interests from Github and LinkedIn
              </p>
            </div>

            {/* Option 2: Culture Connect */}
            <div
              className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${connectOption === "culture"
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
                }`}
              onClick={() => setConnectOption("culture")}
            >
              <div className="flex items-center mb-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${connectOption === "culture" ? "border-blue-500" : "border-gray-500"
                    }`}
                >
                  {connectOption === "culture" && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                </div>
                <h3 className="font-pixel text-base secondary-accent-text">Culture Connect</h3>
              </div>
              <p className="font-body text-sm text-slate-300 ml-6">
                Connect based on cultural interests from Spotify, YouTube, and Podcasts
              </p>
            </div>
          </div>

          {/* Local Option */}
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded border-2 mr-2 cursor-pointer flex items-center justify-center ${localOnly ? "border-green-500 bg-green-500/20" : "border-gray-500"
                }`}
              onClick={() => setLocalOnly(!localOnly)}
            >
              {localOnly && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <label className="font-body text-slate-200 cursor-pointer" onClick={() => setLocalOnly(!localOnly)}>
              Show only local connections
            </label>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            className={`px-6 py-2 ${connectOption === "professional" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded font-pixel text-sm transition-colors`}
          >
            Find Connections
          </button>
        </div>
      </div>

      {/* Connections Section - Reused from event-connections */}
      <div className="p-6 bg-gray-800/80 rounded-lg border border-gray-700 shadow-lg">
        <h3 className="text-xl font-pixel mb-6 text-slate-200">
          {connectOption === "professional" ? "Professional Connections" : "Culture Connections"}
          {localOnly && " (Local)"}
        </h3>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-slate-300">Loading connections...</div>
          ) : connections.map((connection) => (
            <Link
              key={connection.did1}
              href={`/user-profile/${connection.did1}`}
              className="block p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600/50"
            >
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-blue-600 mr-4 flex-shrink-0"></div>
                <div className="flex-1">
                  <h4 className="font-pixel text-sm text-slate-200 mb-1">{connection.did1.slice(0, 14)}</h4>
                  <div>
                    <span className="font-body text-xs text-slate-400 block mb-1">Common Interests:</span>
                    <p className="font-body text-sm text-slate-300">{connection.commonalities}</p>
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

