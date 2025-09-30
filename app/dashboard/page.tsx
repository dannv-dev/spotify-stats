import { getSession } from "@/lib/auth"
import { spotifyApi } from "@/lib/spotify"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Music, Disc3, Clock } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { StatsGrid } from "@/components/stats-grid"
import { Music2 } from "lucide-react"
import { NavMenu } from "@/components/nav-menu"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"

async function getUserProfile(accessToken: string) {
  return spotifyApi("/me", accessToken)
}

async function getTopArtists(accessToken: string) {
  return spotifyApi("/me/top/artists?limit=5&time_range=short_term", accessToken)
}

async function getTopTracks(accessToken: string) {
  return spotifyApi("/me/top/tracks?limit=5&time_range=short_term", accessToken)
}

async function getRecentlyPlayed(accessToken: string) {
  return spotifyApi("/me/player/recently-played?limit=5", accessToken)
}

export default async function DashboardPage() {
  const { accessToken } = await getSession()

  if (!accessToken) {
    redirect("/")
  }

  try {
    const [profile, topArtists, topTracks, recentlyPlayed] = await Promise.all([
      getUserProfile(accessToken),
      getTopArtists(accessToken),
      getTopTracks(accessToken),
      getRecentlyPlayed(accessToken),
    ])

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

            <main className="container mx-auto px-4 py-8 space-y-8">
              {/* Profile Section */}
              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <Avatar className="w-24 h-24 border-2 border-primary/20">
                      <AvatarImage src={profile.images?.[0]?.url || "/placeholder.svg"} alt={profile.display_name} />
                      <AvatarFallback className="text-2xl">{profile.display_name?.[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center md:text-left space-y-2">
                      <h2 className="text-3xl font-bold">{profile.display_name}</h2>
                      <p className="text-muted-foreground">{profile.email}</p>

                      <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="font-semibold">{profile.followers?.total.toLocaleString()}</span> followers
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Music className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm capitalize">{profile.product} account</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Overview */}
              <StatsGrid
                topArtistsCount={topArtists.items.length}
                topTracksCount={topTracks.items.length}
                recentlyPlayedCount={recentlyPlayed.items.length}
              />

              {/* Quick Overview Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Top Artists Preview */}
                <Card className="border-border bg-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Top Artists This Month
                    </CardTitle>
                    <Link href="/artists" className="text-sm text-primary hover:underline">
                      View all
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topArtists.items.map((artist: any, index: number) => (
                      <div key={artist.id} className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-muted-foreground w-8">{index + 1}</span>
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={artist.images?.[0]?.url || "/placeholder.svg"} alt={artist.name} />
                          <AvatarFallback>{artist.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{artist.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {artist.genres.slice(0, 2).join(", ") || "Artist"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Top Tracks Preview */}
                <Card className="border-border bg-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Disc3 className="w-5 h-5" />
                      Top Tracks This Month
                    </CardTitle>
                    <Link href="/tracks" className="text-sm text-primary hover:underline">
                      View all
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topTracks.items.map((track: any, index: number) => (
                      <div key={track.id} className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-muted-foreground w-8">{index + 1}</span>
                        <Avatar className="w-12 h-12 rounded">
                          <AvatarImage src={track.album.images?.[0]?.url || "/placeholder.svg"} alt={track.name} />
                          <AvatarFallback>{track.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{track.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {track.artists.map((a: any) => a.name).join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recently Played Preview */}
                <Card className="border-border bg-card md:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recently Played
                    </CardTitle>
                    <Link href="/recent" className="text-sm text-primary hover:underline">
                      View all
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {recentlyPlayed.items.map((item: any) => (
                        <div key={item.played_at} className="flex flex-col gap-2">
                          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                            <img
                              src={item.track.album.images?.[0]?.url || "/placeholder.svg"}
                              alt={item.track.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-sm truncate">{item.track.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.track.artists.map((a: any) => a.name).join(", ")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>

        <MobileNav />
      </div>
    )
  } catch (error) {
    console.error("[v0] Dashboard error:", error)
    redirect("/?error=api_failed")
  }
}
