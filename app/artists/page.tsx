import { getSession } from "@/lib/auth"
import { spotifyApi } from "@/lib/spotify"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { Music2 } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { NavMenu } from "@/components/nav-menu"
import { MobileNav } from "@/components/mobile-nav"

async function getTopArtists(accessToken: string, timeRange: string) {
  return spotifyApi(`/me/top/artists?limit=50&time_range=${timeRange}`, accessToken)
}

async function getUserProfile(accessToken: string) {
  return spotifyApi("/me", accessToken)
}

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const { accessToken } = await getSession()

  if (!accessToken) {
    redirect("/")
  }

  const params = await searchParams
  const timeRange = params.range || "short_term"

  try {
    const [topArtists, profile] = await Promise.all([
      getTopArtists(accessToken, timeRange),
      getUserProfile(accessToken),
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

            <main className="container mx-auto px-4 py-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Top Artists</h2>
                  <p className="text-muted-foreground">Your most listened to artists</p>
                </div>
                <TimeRangeSelector currentRange={timeRange} basePath="/artists" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {topArtists.items.map((artist: any, index: number) => (
                  <Card key={artist.id} className="border-border bg-card hover:bg-accent/50 transition-colors group">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="relative">
                          <Avatar className="w-full aspect-square rounded-lg">
                            <AvatarImage
                              src={artist.images?.[0]?.url || "/placeholder.svg"}
                              alt={artist.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="rounded-lg text-4xl">{artist.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="absolute top-2 left-2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-lg font-bold">#{index + 1}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                            {artist.name}
                          </h3>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{artist.followers.total.toLocaleString()} followers</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {artist.genres.slice(0, 3).map((genre: string) => (
                              <Badge key={genre} variant="secondary" className="text-xs capitalize">
                                {genre}
                              </Badge>
                            ))}
                          </div>

                          <div className="pt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${Math.max(20, 100 - index * 2)}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{artist.popularity}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </main>
          </div>
        </div>

        <MobileNav />
      </div>
    )
  } catch (error) {
    console.error("[v0] Top artists error:", error)
    redirect("/?error=api_failed")
  }
}
