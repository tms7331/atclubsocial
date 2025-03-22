"use client"

import { useState, useEffect } from "react"
import BlinkingCursor from "./components/BlinkingCursor"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useAtom } from 'jotai'
import { didAtom } from './atoms/profile'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [blueskyHandle, setBlueskyHandle] = useState("")
  const [, setDid] = useAtom(didAtom)

  const handleLoginBsky = async () => {
    const handle = 'thomasr8.bsky.social';
    try {
      const response = await fetch('/api/atproto/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handle }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to get authorization URL');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }


  useEffect(() => {

    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        console.log("Checking profile", data);
        if (data.profile) {
          console.log('Profile loaded!!', data.profile);
          setIsLoggedIn(true)
          setUsername(data.profile.displayName)
          setDid(data.profile.did)
          fetch("/api/compute-commonalities", {
            method: "POST",
            body: JSON.stringify({ did: data.profile.did }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-pixel accent-text mb-4">Enter ATClub</h1>
        <div className="flex justify-center items-center">
          <span className="font-body text-xl text-slate-200 mr-1">Join the club, find your people</span>
          <BlinkingCursor />
        </div>
      </div>

      {isLoggedIn ? (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-pixel text-green-400 mb-6">Welcome {username}</h2>
          <Link
            href="/connect"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-pixel text-sm transition-colors duration-200 flex items-center"
          >
            Go to Connect
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
          <Input
            type="text"
            placeholder="Your Bluesky handle"
            value={blueskyHandle}
            onChange={(e) => setBlueskyHandle(e.target.value)}
            className="w-full font-body bg-gray-800 text-slate-200 border-gray-700 placeholder:text-gray-500"
          />

          <button
            onClick={handleLoginBsky}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-pixel text-sm transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            Login with Bluesky
          </button>
        </div>
      )}
    </div>
  )
}

