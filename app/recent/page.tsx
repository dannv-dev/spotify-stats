import { getSession } from "@/lib/auth"
import { spotifyApi } from "@/lib/spotify"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Music2, Clock } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { NavMenu } from "@/components/nav-menu"
import { MobileNav } from "@/components/mobile-nav"

async function getRecentlyPlayed(accessToken: string) {
  return spotifyApi("/me/player/recently-played?limit=50", accessToken)
}

async function getUserProfile(accessToken: string) {
  return spotifyApi("/me", accessToken)
}

function formatPlayedAt(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export default async function RecentPage() {
  const { accessToken } = await getSession()

  if (!accessToken) {
    redirect("/")
  }

  try {
    const [recentlyPlayed, profile] = await Promise.all([getRecentlyPlayed(accessToken), getUserProfile(accessToken)])

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
              <div>
                <h2 className="text-3xl font-bold">Recently Played</h2>
                <p className="text-muted-foreground">Your listening history</p>
              </div>

              {/* Grid View */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {recentlyPlayed.items.map((item: any, index: number) => (
                  <Card
                    key={`${item.track.id}-${index}`}
                    className="border-border bg-card hover:bg-accent/50 transition-colors group"
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={item.track.album.images?.[0]?.url || "/placeholder.svg"}
                            alt={item.track.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {item.track.name}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {item.track.artists.map((a: any) => a.name).join(", ")}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatPlayedAt(item.played_at)}
                          </span>
                          <span>{formatDuration(item.track.duration_ms)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* List View */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Listening Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentlyPlayed.items.map((item: any, index: number) => (
                      <div
                        key={`${item.track.id}-list-${index}`}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                      >
                        <Avatar className="w-14 h-14 rounded">
                          <AvatarImage
                            src={item.track.album.images?.[0]?.url || "/placeholder.svg"}
                            alt={item.track.name}
                          />
                          <AvatarFallback className="rounded">{item.track.name[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate group-hover:text-primary transition-colors">
                            {item.track.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {item.track.artists.map((a: any) => a.name).join(", ")}
                          </p>
                        </div>

                        <div className="hidden sm:block text-sm text-muted-foreground truncate max-w-[200px]">
                          {item.track.album.name}
                        </div>

                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatPlayedAt(item.played_at)}
                        </div>

                        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {formatDuration(item.track.duration_ms)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>

        <MobileNav />
      </div>
    )
  } catch (error) {
    console.error("[v0] Recently played error:", error)
    redirect("/?error=api_failed")
  }
}
