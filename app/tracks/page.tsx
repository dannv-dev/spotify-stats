import { getSession } from "@/lib/auth"
import { spotifyApi } from "@/lib/spotify"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { AudioFeaturesChart } from "@/components/audio-features-chart"
import { Music2 } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { NavMenu } from "@/components/nav-menu"
import { MobileNav } from "@/components/mobile-nav"
import { InteractiveTrackList } from "@/components/interactive-track-list"

async function getTopTracks(accessToken: string, timeRange: string) {
  console.log("[v0] Fetching top tracks with timeRange:", timeRange)
  return spotifyApi(`/me/top/tracks?limit=50&time_range=${timeRange}`, accessToken)
}

async function getAudioFeatures(accessToken: string, trackIds: string[]) {
  console.log("[v0] Fetching audio features for", trackIds.length, "tracks")
  const ids = trackIds.join(",")
  return spotifyApi(`/audio-features?ids=${ids}`, accessToken)
}

async function getUserProfile(accessToken: string) {
  console.log("[v0] Fetching user profile")
  return spotifyApi("/me", accessToken)
}

export default async function TracksPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  console.log("[v0] TracksPage rendering")
  const { accessToken } = await getSession()

  if (!accessToken) {
    console.log("[v0] No access token, redirecting to home")
    redirect("/")
  }

  const params = await searchParams
  const timeRange = params.range || "short_term"
  console.log("[v0] Using time range:", timeRange)

  try {
    const [topTracks, profile] = await Promise.all([getTopTracks(accessToken, timeRange), getUserProfile(accessToken)])

    console.log("[v0] Successfully fetched", topTracks.items.length, "tracks")

    const trackIds = topTracks.items.slice(0, 20).map((track: any) => track.id)
    const audioFeatures = await getAudioFeatures(accessToken, trackIds)

    console.log("[v0] Successfully fetched audio features")

    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <div className="flex">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-card">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
              <Music2 className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Spotify Stats</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <NavMenu />
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={profile.images?.[0]?.url || "/placeholder.svg"} alt={profile.display_name} />
                  <AvatarFallback>{profile.display_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{profile.display_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 md:ml-64">
            <header className="border-b border-border bg-card md:hidden sticky top-0 z-10">
              <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music2 className="w-6 h-6 text-primary" />
                  <h1 className="text-xl font-bold">Spotify Stats</h1>
                </div>
                <LogoutButton />
              </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Top Tracks</h2>
                  <p className="text-muted-foreground">Your most played songs</p>
                </div>
                <TimeRangeSelector currentRange={timeRange} basePath="/tracks" />
              </div>

              {/* Audio Features Chart */}
              <AudioFeaturesChart audioFeatures={audioFeatures.audio_features} />

              <InteractiveTrackList tracks={topTracks.items} />
            </main>
          </div>
        </div>

        <MobileNav />
      </div>
    )
  } catch (error) {
    console.error("[v0] Top tracks error:", error)
    redirect("/?error=api_failed")
  }
}
