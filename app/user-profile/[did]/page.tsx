"use client"

import { useEffect, useState } from "react"
import * as React from 'react'
import {
  ProfileData,
  GithubData,
  LinkedinData,
  YoutubeData,
  SpotifyData,
  PodcastData,
  LocationData
} from '@/app/types/profile'


export default function UserProfilePage({ params }: { params: Promise<{ did: string }> }) {
  const { did } = React.use(params)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`/api/get-profile?did=${did}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        const dbdata = data.dbdata
        const atprofile = data.atprofile

        // Transform the raw database data into the expected format
        const transformedData = {
          ...dbdata,
          username: atprofile.displayName,
          handle: atprofile.handle,
          bio: dbdata.bio,
          avatar: atprofile.avatar,
          sources: {
            Github: {
              imported: !!dbdata.github,
              data: dbdata.github ? JSON.parse(dbdata.github) : null
            },
            Linkedin: {
              imported: !!dbdata.linkedin,
              data: dbdata.linkedin ? JSON.parse(dbdata.linkedin) : null
            },
            Spotify: {
              imported: !!dbdata.spotify,
              data: dbdata.spotify ? JSON.parse(dbdata.spotify) : null
            },
            Youtube: {
              imported: !!dbdata.youtube,
              data: dbdata.youtube ? JSON.parse(dbdata.youtube) : null
            },
            Podcasts: {
              imported: !!dbdata.podcasts,
              data: dbdata.podcasts ? JSON.parse(dbdata.podcasts) : null
            },
            Location: {
              imported: !!dbdata.location,
              data: dbdata.location ? JSON.parse(dbdata.location) : null
            }
          }
        }

        setProfileData(transformedData)
      } catch (error) {
        console.error('Error fetching profile data:', error)
      }
    }

    fetchProfileData()
  }, [did])

  // Return loading state if data isn't ready
  if (!profileData) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="p-6 bg-gray-800/80 rounded-lg border border-green-400/20 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-blue-600 mr-6"></div>
          <div>
            <h2 className="text-2xl font-pixel accent-text mb-1">{profileData.username}</h2>
            <a
              href={`https://bsky.app/profile/${profileData.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-slate-400 hover:text-slate-300 transition-colors"
            >
              @{profileData.handle}
            </a>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-pixel mb-2 text-slate-200">Bio</h3>
          <p className="font-body text-slate-300">{profileData.bio}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <p className="font-body text-sm text-slate-300">
              <span className="text-slate-400 block mb-1">Location:</span>
              {profileData.sources.Location.imported && profileData.sources.Location.data ? (
                <>
                  {(profileData.sources.Location.data as LocationData).city}
                </>
              ) : (
                "Location not available"
              )}
            </p>
          </div>
          {profileData.sources.Github.imported && profileData.sources.Github.data && (
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="font-body text-sm text-slate-300">
                <span className="text-slate-400 block mb-1">Github:</span>
                <span className="text-blue-400">@{(profileData.sources.Github.data as GithubData).username}</span>
                <br />
                <span className="text-xs">
                  {(profileData.sources.Github.data as GithubData).commits} commits ·{" "}
                  {(profileData.sources.Github.data as GithubData).stars} stars
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Professional Info */}
      {profileData.sources.Linkedin.imported && profileData.sources.Linkedin.data && (
        <div className="p-6 content-card rounded-lg">
          <h3 className="text-lg font-pixel mb-4 accent-text">Professional</h3>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <p className="font-body text-slate-300 mb-1">
              <span className="text-slate-400">Bio:</span> {(profileData.sources.Linkedin.data as LinkedinData).bio}
            </p>
          </div>
        </div>
      )}

      {/* Media Section */}
      <div className="p-6 content-card-alt rounded-lg">
        <h3 className="text-lg font-pixel mb-4 secondary-accent-text">Media</h3>

        <div className="space-y-4">
          {/* YouTube */}
          {profileData.sources.Youtube.imported && profileData.sources.Youtube.data && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-body text-slate-200 font-semibold mb-2">YouTube Channels</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs font-body rounded">
                  {(profileData.sources.Youtube.data as YoutubeData).channelsFollowed}
                </span>
              </div>
            </div>
          )}

          {/* Spotify */}
          {profileData.sources.Spotify.imported && profileData.sources.Spotify.data && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-body text-slate-200 font-semibold mb-2">Spotify</h4>
              <div className="mb-3">
                <p className="font-body text-slate-400 text-sm mb-1">Top Artists:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs font-body rounded">
                    {(profileData.sources.Spotify.data as SpotifyData).topArtists}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Podcasts */}
          {profileData.sources.Podcasts.imported && profileData.sources.Podcasts.data && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-body text-slate-200 font-semibold mb-2">Podcasts</h4>
              <div className="mb-3">
                <p className="font-body text-slate-400 text-sm mb-1">Favorite Podcasts:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs font-body rounded">
                    {(profileData.sources.Podcasts.data as PodcastData).favoritePodcasts}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connect Button */}
      <div className="flex justify-center">
        <a
          href={`https://bsky.app/profile/${profileData.handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-pixel text-sm transition-colors"
        >
          Connect with {profileData.username || "User"}
        </a>
      </div>
    </div>
  )
}

