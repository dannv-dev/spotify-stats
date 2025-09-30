import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Music2 } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { SearchInterface } from "@/components/search-interface"
import { NavMenu } from "@/components/nav-menu"
import { MobileNav } from "@/components/mobile-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { spotifyApi } from "@/lib/spotify"

async function getUserProfile(accessToken: string) {
  return spotifyApi("/me", accessToken)
}

export default async function SearchPage() {
  const { accessToken } = await getSession()

  if (!accessToken) {
    redirect("/")
  }

  const profile = await getUserProfile(accessToken)

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

          <main className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold">Search</h2>
              <p className="text-muted-foreground">Find tracks, artists, and albums</p>
            </div>

            <SearchInterface />
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
