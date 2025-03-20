"use client"

import { useState } from "react"
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Trash2 } from "lucide-react"

export default function ProfilePage() {
  // Mock data for demonstration
  const dataSourceStatus = {
    Github: { imported: true, data: { username: "devuser", repos: 24, followers: 156, following: 89 } },
    Linkedin: { imported: true, data: { name: "Dev User", position: "Software Engineer", connections: 500 } },
    Spotify: { imported: false, data: null },
    Youtube: { imported: true, data: { channelsFollowed: ["Code with Me", "Tech Talks", "Web Dev Simplified"] } },
    Podcasts: { imported: false, data: null },
    Location: { imported: false, data: null },
  }

  const [expandedSource, setExpandedSource] = useState<string | null>(null)

  const toggleExpand = (source: string) => {
    if (expandedSource === source) {
      setExpandedSource(null)
    } else {
      setExpandedSource(source)
    }
  }

  return (
    <div className="p-6 bg-gray-800/80 rounded-lg border border-green-400/20 shadow-lg">
      <h2 className="text-2xl font-pixel mb-6 accent-text">Profile</h2>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* User Name Card - Green (Left on desktop, top on mobile) */}
          <div className="w-full md:w-1/3">
            <div className="content-card p-4 rounded-lg text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-600 to-blue-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-pixel mb-4 accent-text">User Name</h3>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            {/* ATClub Bio Card - Blue (1st on right column) */}
            <div className="content-card-alt p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-pixel secondary-accent-text">ATClub Bio</h3>
                <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-pixel">Edit</button>
              </div>
              <p className="font-body text-slate-300 leading-relaxed">
                This is a placeholder for your bio. Tell others about yourself, your interests, and what you're looking
                for on ATClubSocial.
              </p>
            </div>

            {/* ATClub Profile Card - Green (2nd on right column) */}
            <div className="content-card p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-pixel accent-text">ATClub Profile</h3>
                <button className="px-2 py-1 bg-green-600 text-white rounded text-xs font-pixel">Edit photo</button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 border border-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="font-body text-slate-300 text-sm">Upload a profile photo for your ATClub profile</p>
              </div>
            </div>

            {/* Data Management Card - Blue (3rd on right column) */}
            <div className="content-card-alt p-4 rounded-lg">
              <h3 className="text-lg font-pixel mb-4 secondary-accent-text">Data Management</h3>

              <div className="space-y-3">
                {Object.entries(dataSourceStatus).map(([source, status]) => (
                  <div key={source} className="space-y-2">
                    <div className="flex flex-col sm:flex-row">
                      <div
                        className={`font-body text-slate-200 flex items-center cursor-pointer mb-2 sm:mb-0 sm:flex-1 ${status.imported ? "hover:text-slate-100" : ""}`}
                        onClick={() => status.imported && toggleExpand(source)}
                      >
                        {status.imported ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                        )}
                        <span>{source}</span>
                        {status.imported &&
                          (expandedSource === source ? (
                            <ChevronUp className="h-4 w-4 ml-2" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-2" />
                          ))}
                      </div>
                      <div className="flex justify-end sm:justify-between sm:w-[220px] gap-2">
                        <div className="w-16 text-center">
                          {source !== "Podcasts" && source !== "Location" ? (
                            <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-body w-16 h-6">
                              Import
                            </button>
                          ) : (
                            <div className="w-16 h-6 hidden sm:block"></div>
                          )}
                        </div>
                        <div className="w-16 text-center">
                          {source !== "Github" ? (
                            <button className="px-2 py-1 bg-gray-600 text-white rounded text-xs font-body w-16 h-6">
                              Manual
                            </button>
                          ) : (
                            <div className="w-16 h-6 hidden sm:block"></div>
                          )}
                        </div>
                        <div className="w-16 text-center">
                          {status.imported ? (
                            <button className="px-2 py-1 bg-red-600 text-white rounded text-xs font-body w-16 h-6">
                              <span className="flex items-center justify-center">
                                <Trash2 className="h-3 w-3 mr-1" />
                                <span>Delete</span>
                              </span>
                            </button>
                          ) : (
                            <div className="w-16 h-6 hidden sm:block"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {status.imported && expandedSource === source && (
                      <div className="ml-7 p-3 bg-gray-700 rounded-md">
                        <DataPreview source={source} data={status.data} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DataPreviewProps {
  source: string
  data: any
}

function DataPreview({ source, data }: DataPreviewProps) {
  if (!data) return <p className="font-body text-slate-300 text-sm">No data available</p>

  switch (source) {
    case "Github":
      return (
        <div className="space-y-1">
          <p className="font-body text-slate-300 text-sm">
            Username: <span className="text-blue-400">{data.username}</span>
          </p>
          <p className="font-body text-slate-300 text-sm">Repositories: {data.repos}</p>
          <p className="font-body text-slate-300 text-sm">
            Followers: {data.followers} | Following: {data.following}
          </p>
        </div>
      )
    case "Linkedin":
      return (
        <div className="space-y-1">
          <p className="font-body text-slate-300 text-sm">Name: {data.name}</p>
          <p className="font-body text-slate-300 text-sm">Position: {data.position}</p>
          <p className="font-body text-slate-300 text-sm">Connections: {data.connections}+</p>
        </div>
      )
    case "Youtube":
      return (
        <div className="space-y-1">
          <p className="font-body text-slate-300 text-sm">Channels followed:</p>
          <ul className="list-disc list-inside">
            {data.channelsFollowed.map((channel: string) => (
              <li key={channel} className="font-body text-slate-300 text-sm ml-2">
                {channel}
              </li>
            ))}
          </ul>
        </div>
      )
    default:
      return <p className="font-body text-slate-300 text-sm">Data preview not available</p>
  }
}

