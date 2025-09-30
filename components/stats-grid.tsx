import { Card, CardContent } from "@/components/ui/card"
import { Users, Disc3, Clock } from "lucide-react"

interface StatsGridProps {
  topArtistsCount: number
  topTracksCount: number
  recentlyPlayedCount: number
}

export function StatsGrid({ topArtistsCount, topTracksCount, recentlyPlayedCount }: StatsGridProps) {
  const stats = [
    {
      label: "Top Artists",
      value: topArtistsCount,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Top Tracks",
      value: topTracksCount,
      icon: Disc3,
      color: "text-green-500",
    },
    {
      label: "Recently Played",
      value: recentlyPlayedCount,
      icon: Clock,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
