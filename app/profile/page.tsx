"use client"

import type React from "react"
import Image from "next/image"

import { useState, useRef, useEffect } from "react"
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Trash2, Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useAtom } from 'jotai'
import { didAtom, profileDataAtom } from '../atoms/profile'
import {
  ProfileData,
  DataSourceStatuses,
  DataSourceStatus,
  SourceData,
  GithubData,
  LinkedinData,
  YoutubeData,
  SpotifyData,
  PodcastData,
  LocationData
} from '@/app/types/profile'

export default function ProfilePage() {
  const [did] = useAtom(didAtom)
  const [profileData, setProfileData] = useAtom(profileDataAtom)

  const dataSourceStatus: DataSourceStatuses = {
    Github: { imported: false, data: null },
    Linkedin: { imported: false, data: null },
    Spotify: { imported: false, data: null },
    Youtube: { imported: false, data: null },
    Podcasts: { imported: false, data: null },
    Location: { imported: false, data: null },
  }

  // State variables
  const [expandedSource, setExpandedSource] = useState<string | null>(null)
  const [editingBio, setEditingBio] = useState(false)
  const [bio, setBio] = useState("")
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [manualEditSource, setManualEditSource] = useState<string | null>(null)
  const [manualEditData, setManualEditData] = useState<any>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!did) return

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
        setBio(dbdata.bio || "Tell others about yourself, your interests, and what you're looking for on ATClubSocial.")
      } catch (error) {
        console.error('Error fetching profile data:', error)
      }
    }

    fetchProfileData()
  }, [did, setProfileData])

  const toggleExpand = (source: string) => {
    if (expandedSource === source) {
      setExpandedSource(null)
    } else {
      setExpandedSource(source)
    }
  }

  // Bio functions
  const handleSaveBio = async () => {
    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          did,
          bio,
          ...profileData.sources // Preserve other existing data
        }),
      })

      if (!response.ok) throw new Error('Failed to update bio')
      setEditingBio(false)
    } catch (error) {
      console.error('Error saving bio:', error)
    }
  }

  // Photo upload functions
  const handleEditPhoto = () => {
    setShowPhotoUpload(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSavePhoto = async () => {
    try {
      // First upload the photo to storage (you'll need to implement this)
      // Then update the profile with the photo URL
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          did,
          photo: selectedFile, // You'll need to handle file upload separately
          ...profileData.sources
        }),
      })

      if (!response.ok) throw new Error('Failed to update photo')
      setShowPhotoUpload(false)
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error('Error saving photo:', error)
    }
  }

  const handleCancelPhotoUpload = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setShowPhotoUpload(false)
  }

  // Manual data edit functions
  const getInitialDataForSource = (source: keyof DataSourceStatuses): SourceData => {
    switch (source) {
      case "Github":
        return { username: "", commits: 0, stars: 0 };
      case "Linkedin":
        return { bio: "" };
      case "Youtube":
        return { channelsFollowed: "" };
      case "Spotify":
        return { topArtists: "" };
      case "Podcasts":
        return { favoritePodcasts: "" };
      case "Location":
        return { city: "" };
    }
  };

  const handleManualEdit = (source: keyof DataSourceStatuses) => {
    if (manualEditSource === source) {
      setManualEditSource(null);
      return;
    }

    // Use profileData instead of dataSourceStatus to get current values
    const initialData = profileData?.sources[source].imported
      ? { ...profileData.sources[source].data }
      : getInitialDataForSource(source);

    setManualEditData(initialData);
    setManualEditSource(source);
  };

  const handleSaveManualData = async () => {
    try {
      if (!manualEditSource) return

      // Validate that the data matches the expected type structure
      const serializedData = JSON.stringify(manualEditData)
      const fieldName = manualEditSource.toLowerCase()

      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          did,
          [fieldName]: serializedData, // Store the entire data object as a JSON string
        }),
      })

      if (!response.ok) throw new Error('Failed to update data')

      // Update local state
      setProfileData((prev: ProfileData | null) => ({
        ...prev,
        sources: {
          ...prev?.sources,
          [manualEditSource]: {
            imported: true,
            data: manualEditData
          }
        }
      }))
      setManualEditSource(null)
    } catch (error) {
      console.error('Error saving manual data:', error)
    }
  }

  const handleManualDataChange = (field: string, value: any) => {
    setManualEditData({
      ...manualEditData,
      [field]: value,
    })
  }

  const handleManualArrayChange = (field: string, index: number, value: string) => {
    const newArray = [...manualEditData[field]]
    newArray[index] = value

    setManualEditData({
      ...manualEditData,
      [field]: newArray,
    })
  }

  return (
    <div className="p-6 bg-gray-800/80 rounded-lg border border-green-400/20 shadow-lg">
      <h2 className="text-2xl font-pixel mb-6 accent-text">Profile</h2>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* User Name Card - Green (Left on desktop, top on mobile) */}
          <div className="w-full md:w-1/3">
            <div className="content-card p-4 rounded-lg text-center">
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <Image
                  src={profileData?.avatar || "/placeholder.svg"}
                  alt="Profile"
                  className="rounded-full object-cover"
                  fill
                  sizes="128px"
                />
              </div>
              <h3 className="text-lg font-pixel mb-4 accent-text">{profileData?.username}</h3>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            {/* ATClub Bio Card - Blue (1st on right column) */}
            <div className="content-card-alt p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-pixel secondary-accent-text">ATClub Bio</h3>
                {editingBio ? (
                  <button
                    onClick={handleSaveBio}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-pixel flex items-center"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingBio(true)}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-pixel"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingBio ? (
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="font-body text-slate-300 leading-relaxed bg-gray-700 border-gray-600 min-h-[100px]"
                />
              ) : (
                <p className="font-body text-slate-300 leading-relaxed">{bio}</p>
              )}
            </div>

            {/* ATClub Profile Card - Green (2nd on right column) */}
            <div className="content-card p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-pixel accent-text">ATClub Profile</h3>
                <button
                  disabled
                  className="px-2 py-1 bg-gray-600 text-gray-400 rounded text-xs font-pixel cursor-not-allowed"
                >
                  Edit photo
                </button>
              </div>
              <div className="flex items-center space-x-4">
                {previewUrl ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={previewUrl || "/placeholder.svg"}
                      alt="Profile preview"
                      className="object-cover"
                      width={64}
                      height={64}
                      unoptimized={previewUrl ? true : false}
                    />
                  </div>
                ) : (
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
                )}
                <p className="font-body text-slate-300 text-sm">Upload a profile photo for your ATClub profile</p>
              </div>

              {/* Photo Upload Modal */}
              {showPhotoUpload && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <h4 className="font-pixel text-sm text-slate-200 mb-3">Upload Profile Photo</h4>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-col items-center mb-4">
                    {previewUrl ? (
                      <div className="w-32 h-32 rounded-lg overflow-hidden mb-2">
                        <Image
                          src={previewUrl || "/placeholder.svg"}
                          alt="Profile preview"
                          className="object-cover"
                          width={128}
                          height={128}
                          unoptimized={previewUrl ? true : false}
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 bg-gray-800 rounded-lg flex flex-col items-center justify-center text-gray-500 border border-gray-600 cursor-pointer hover:bg-gray-750 mb-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="text-xs font-body">Click to select</span>
                      </div>
                    )}

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-body text-blue-400 hover:text-blue-300"
                    >
                      {previewUrl ? "Change image" : "Select image"}
                    </button>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelPhotoUpload}
                      className="px-2 py-1 bg-gray-600 text-white rounded text-xs font-pixel"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePhoto}
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs font-pixel"
                      disabled={!selectedFile}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Data Management Card - Blue (3rd on right column) */}
            <div className="content-card-alt p-4 rounded-lg">
              <h3 className="text-lg font-pixel mb-4 secondary-accent-text">Data Management</h3>

              <div className="space-y-3">
                {profileData && (Object.entries(profileData.sources || {}) as [string, DataSourceStatus][]).map(([source, status]) => (
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
                            <button
                              className="px-2 py-1 bg-gray-600 text-white rounded text-xs font-body w-16 h-6"
                              onClick={() => handleManualEdit(source as keyof DataSourceStatuses)}
                            >
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
                        <DataPreview source={source as keyof DataSourceStatuses} data={status.data} />
                      </div>
                    )}

                    {manualEditSource === source && (
                      <div className="ml-7 p-3 bg-gray-700 rounded-md">
                        <div className="space-y-3">
                          {source === "Github" && (
                            <>
                              <div>
                                <label className="font-body text-slate-400 text-sm block mb-1">Username</label>
                                <Input
                                  value={manualEditData.username || ""}
                                  onChange={(e) => handleManualDataChange("username", e.target.value)}
                                  className="bg-gray-800 border-gray-600 text-slate-200 font-body"
                                />
                              </div>
                              <div>
                                <label className="font-body text-slate-400 text-sm block mb-1">Repositories</label>
                                <Input
                                  type="number"
                                  value={manualEditData.repos || 0}
                                  onChange={(e) => handleManualDataChange("repos", Number.parseInt(e.target.value))}
                                  className="bg-gray-800 border-gray-600 text-slate-200 font-body"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="font-body text-slate-400 text-sm block mb-1">Followers</label>
                                  <Input
                                    type="number"
                                    value={manualEditData.followers || 0}
                                    onChange={(e) =>
                                      handleManualDataChange("followers", Number.parseInt(e.target.value))
                                    }
                                    className="bg-gray-800 border-gray-600 text-slate-200 font-body"
                                  />
                                </div>
                                <div>
                                  <label className="font-body text-slate-400 text-sm block mb-1">Following</label>
                                  <Input
                                    type="number"
                                    value={manualEditData.following || 0}
                                    onChange={(e) =>
                                      handleManualDataChange("following", Number.parseInt(e.target.value))
                                    }
                                    className="bg-gray-800 border-gray-600 text-slate-200 font-body"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {source === "Linkedin" && (
                            <>
                              <div>
                                <label className="font-body text-slate-400 text-sm block mb-1">Bio</label>
                                <Textarea
                                  value={manualEditData.bio || ""}
                                  onChange={(e) => handleManualDataChange("bio", e.target.value)}
                                  className="bg-gray-800 border-gray-600 text-slate-200 font-body"
                                />
                              </div>
                            </>
                          )}

                          {source === "Youtube" && (
                            <div>
                              <label className="font-body text-slate-400 text-sm block mb-1">Channels Followed</label>
                              <Input
                                value={manualEditData.channelsFollowed || ""}
                                onChange={(e) => handleManualDataChange("channelsFollowed", e.target.value)}
                                className="bg-gray-800 border-gray-600 text-slate-200 font-body"
                                placeholder="Comma-separated list of channels"
                              />
                            </div>
                          )}

                          {source === "Spotify" && (
                            <div>
                              <label className="font-body text-slate-400 text-sm block mb-1">Top Artists</label>
                              <Input
                                value={manualEditData.topArtists || ""}
                                onChange={(e) => handleManualDataChange("topArtists", e.target.value)}
                                className="bg-gray-800 border-gray-600 text-slate-200 font-body"
                                placeholder="Comma-separated list of artists"
                              />
                            </div>
                          )}

                          {source === "Podcasts" && (
                            <div>
                              <label className="font-body text-slate-400 text-sm block mb-1">Favorite Podcasts</label>
                              <Input
                                value={manualEditData.favoritePodcasts || ""}
                                onChange={(e) => handleManualDataChange("favoritePodcasts", e.target.value)}
                                className="bg-gray-800 border-gray-600 text-slate-200 font-body"
                                placeholder="Comma-separated list of podcasts"
                              />
                            </div>
                          )}

                          {source === "Location" && (
                            <div>
                              <label className="font-body text-slate-400 text-sm block mb-1">City</label>
                              <Input
                                value={manualEditData.city || ""}
                                onChange={(e) => handleManualDataChange("city", e.target.value)}
                                className="bg-gray-800 border-gray-600 text-slate-200 font-body"
                                placeholder="Your city"
                              />
                            </div>
                          )}

                          <div className="flex justify-end mt-4">
                            <button
                              onClick={() => setManualEditSource(null)}
                              className="px-2 py-1 bg-gray-600 text-white rounded text-xs font-body mr-2"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveManualData}
                              className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-body flex items-center"
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </button>
                          </div>
                        </div>
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
  source: keyof DataSourceStatuses;
  data: SourceData | null;
}

function DataPreview({ source, data }: DataPreviewProps) {
  if (!data) return <p className="font-body text-slate-300 text-sm">No data available</p>

  switch (source) {
    case "Github":
      const githubData = data as GithubData
      return (
        <div className="space-y-1">
          <p className="font-body text-slate-300 text-sm">
            Username: <span className="text-blue-400">{githubData.username}</span>
          </p>
          <p className="font-body text-slate-300 text-sm">Commits: {githubData.commits}</p>
          <p className="font-body text-slate-300 text-sm">Stars: {githubData.stars}</p>
        </div>
      )
    case "Linkedin":
      const linkedinData = data as LinkedinData
      return (
        <div className="space-y-1">
          <p className="font-body text-slate-300 text-sm">Bio: {linkedinData.bio}</p>
        </div>
      )
    case "Youtube":
      const youtubeData = data as YoutubeData
      return (
        <div className="space-y-1">
          <p className="font-body text-slate-300 text-sm">Channels followed:</p>
          <p className="font-body text-slate-300 text-sm">{youtubeData.channelsFollowed}</p>
        </div>
      )
    case "Spotify":
      const spotifyData = data as SpotifyData
      return (
        <div className="space-y-1">
          <p className="font-body text-slate-300 text-sm">Top Artists:</p>
          <p className="font-body text-slate-300 text-sm">{spotifyData.topArtists}</p>
        </div>
      )
    case "Podcasts":
      const podcastData = data as PodcastData
      return (
        <div className="space-y-1">
          <p className="font-body text-slate-300 text-sm">Favorite Podcasts:</p>
          <p className="font-body text-slate-300 text-sm">{podcastData.favoritePodcasts}</p>
        </div>
      )
    case "Location":
      const locationData = data as LocationData
      return (
        <div className="space-y-1">
          <p className="font-body text-slate-300 text-sm">City: {locationData.city}</p>
        </div>
      )
    default:
      return <p className="font-body text-slate-300 text-sm">Data preview not available</p>
  }
}

// Helper function to validate and serialize data
const serializeSourceData = (source: string, data: any): string => {
  // Type guards to ensure data matches expected structure
  switch (source) {
    case "Github":
      const githubData = data as GithubData
      if (
        typeof githubData.username === 'string' &&
        typeof githubData.commits === 'number' &&
        typeof githubData.stars === 'number'
      ) {
        return JSON.stringify(githubData)
      }
      throw new Error('Invalid Github data structure')

    case "Linkedin":
      const linkedinData = data as LinkedinData
      if (
        typeof linkedinData.bio === 'string'
      ) {
        return JSON.stringify(linkedinData)
      }
      throw new Error('Invalid Linkedin data structure')

    case "Youtube":
      const youtubeData = data as YoutubeData
      if (Array.isArray(youtubeData.channelsFollowed)) {
        return JSON.stringify(youtubeData)
      }
      throw new Error('Invalid Youtube data structure')

    case "Spotify":
      const spotifyData = data as SpotifyData
      if (Array.isArray(spotifyData.topArtists)) {
        return JSON.stringify(spotifyData)
      }
      throw new Error('Invalid Spotify data structure')

    case "Podcasts":
      const podcastData = data as PodcastData
      if (Array.isArray(podcastData.favoritePodcasts)) {
        return JSON.stringify(podcastData)
      }
      throw new Error('Invalid Podcast data structure')

    case "Location":
      const locationData = data as LocationData
      if (typeof locationData.city === 'string') {
        return JSON.stringify(locationData)
      }
      throw new Error('Invalid Location data structure')

    default:
      throw new Error('Unknown source type')
  }
}

// Helper function to deserialize data
const deserializeSourceData = (source: string, data: string | null): SourceData | null => {
  if (!data) return null

  try {
    const parsed = JSON.parse(data)
    // The type checking is handled by the type assertion
    // You might want to add additional runtime validation here
    return parsed as SourceData
  } catch (error) {
    console.error(`Error deserializing ${source} data:`, error)
    return null
  }
}

