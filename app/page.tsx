import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Music2 } from "lucide-react"

export default async function Home() {
  const { accessToken } = await getSession()

  if (accessToken) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-md w-full mx-4">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Music2 className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-balance">Spotify Stats Dashboard</h1>
            <p className="text-muted-foreground text-lg text-balance">
              Discover your music listening patterns, top artists, and favorite tracks
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <a href="/api/auth/login">
              <Button size="lg" className="w-full text-base font-semibold">
                Connect with Spotify
              </Button>
            </a>

            <p className="text-sm text-muted-foreground">Sign in to view your personalized music statistics</p>
          </div>
        </div>
      </div>
    </div>
  )
}
