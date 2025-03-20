const users = [
  {
    id: 1,
    name: "Alex Johnson",
    handle: "@alexj",
    bio: "Tech enthusiast, music lover, and amateur photographer. Always looking to connect with like-minded people and explore new ideas.",
    interests: ["Technology", "Music", "Photography", "Travel", "Books"],
    location: "San Francisco, CA",
    joinedDate: "January 2023",
  },
  {
    id: 2,
    name: "Sam Rivera",
    handle: "@samr",
    bio: "Digital artist, gamer, and travel addict. I love exploring new cultures and bringing those experiences into my creative work.",
    interests: ["Art", "Gaming", "Travel", "Design", "Food"],
    location: "Austin, TX",
    joinedDate: "February 2023",
  },
  {
    id: 3,
    name: "Jordan Lee",
    handle: "@jordanl",
    bio: "Software developer by day, bookworm by night. I enjoy cooking new recipes and discussing the latest in tech.",
    interests: ["Technology", "Books", "Cooking", "Science", "Coffee"],
    location: "Seattle, WA",
    joinedDate: "December 2022",
  },
  {
    id: 4,
    name: "Taylor Kim",
    handle: "@taylork",
    bio: "Music producer, fitness enthusiast, and film buff. Always looking for new sounds and visual inspiration.",
    interests: ["Music", "Fitness", "Film", "Art", "Fashion"],
    location: "Los Angeles, CA",
    joinedDate: "March 2023",
  },
  {
    id: 5,
    name: "Morgan Chen",
    handle: "@morganc",
    bio: "Photographer, world traveler, and foodie. I document my journeys through pictures and flavors.",
    interests: ["Photography", "Travel", "Food", "Nature", "Languages"],
    location: "New York, NY",
    joinedDate: "November 2022",
  },
]

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const userId = Number.parseInt(params.id)
  const user = users.find((u) => u.id === userId) || users[0]

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="p-6 bg-gray-800/80 rounded-lg border border-green-400/20 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-blue-600 mr-6"></div>
          <div>
            <h2 className="text-2xl font-pixel accent-text mb-1">{user.name}</h2>
            <p className="font-body text-slate-400">{user.handle}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-pixel mb-2 text-slate-200">Bio</h3>
          <p className="font-body text-slate-300">{user.bio}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-pixel mb-2 text-slate-200">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 ${index % 2 === 0 ? "bg-green-600/20 text-green-400" : "bg-blue-600/20 text-blue-400"} text-xs font-body rounded`}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-pixel mb-2 text-slate-200">Details</h3>
            <div className="space-y-2">
              <p className="font-body text-sm text-slate-300">
                <span className="text-slate-400">Location:</span> {user.location}
              </p>
              <p className="font-body text-sm text-slate-300">
                <span className="text-slate-400">Joined:</span> {user.joinedDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Button */}
      <div className="flex justify-center">
        <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-pixel text-sm transition-colors">
          Connect with {user.name.split(" ")[0]}
        </button>
      </div>
    </div>
  )
}

