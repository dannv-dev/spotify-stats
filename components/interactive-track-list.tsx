"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, Play, Pause, ExternalLink, TrendingUp, Zap, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface Track {
  id: string
  name: string
  artists: { name: string }[]
  album: { name: string; images: { url: string }[] }
  duration_ms: number
  popularity: number
  preview_url?: string
  external_urls: { spotify: string }
}

interface InteractiveTrackListProps {
  tracks: Track[]
}

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function InteractiveTrackList({ tracks }: InteractiveTrackListProps) {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
  const [hoveredTrackId, setHoveredTrackId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlayPause = (track: Track) => {
    if (!track.preview_url) return

    if (playingTrackId === track.id) {
      audioRef.current?.pause()
      setPlayingTrackId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(track.preview_url)
      audioRef.current.play()
      audioRef.current.onended = () => setPlayingTrackId(null)
      setPlayingTrackId(track.id)
    }
  }

  const getPopularityLabel = (popularity: number) => {
    if (popularity >= 80) return { label: "Fire", icon: Zap, color: "text-orange-500" }
    if (popularity >= 60) return { label: "Popular", icon: TrendingUp, color: "text-blue-500" }
    return { label: "Hidden Gem", icon: Heart, color: "text-pink-500" }
  }

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="flex items-center gap-2">
          <span>All Tracks</span>
          <span className="text-sm font-normal text-muted-foreground">({tracks.length} songs)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {tracks.map((track, index) => {
            const isPlaying = playingTrackId === track.id
            const isHovered = hoveredTrackId === track.id
            const popularityInfo = getPopularityLabel(track.popularity)
            const PopularityIcon = popularityInfo.icon

            return (
              <div
                key={track.id}
                className={cn(
                  "flex items-center gap-4 p-4 transition-all duration-300",
                  "hover:bg-accent/50 hover:scale-[1.01] cursor-pointer group",
                  isPlaying && "bg-primary/10 border-l-4 border-primary",
                )}
                onMouseEnter={() => setHoveredTrackId(track.id)}
                onMouseLeave={() => setHoveredTrackId(null)}
              >
                {/* Rank with animation */}
                <div className="relative w-8 text-center">
                  <span
                    className={cn(
                      "text-xl font-bold transition-all duration-300",
                      index < 3 ? "text-primary" : "text-muted-foreground",
                      isHovered && "scale-125",
                    )}
                  >
                    {index + 1}
                  </span>
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>

                {/* Album Art with play button overlay */}
                <div className="relative">
                  <Avatar className={cn("w-14 h-14 rounded transition-all duration-300", isHovered && "scale-110")}>
                    <AvatarImage src={track.album.images?.[0]?.url || "/placeholder.svg"} alt={track.name} />
                    <AvatarFallback className="rounded">{track.name[0]}</AvatarFallback>
                  </Avatar>
                  {track.preview_url && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className={cn(
                        "absolute inset-0 m-auto w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                        isPlaying && "opacity-100",
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlayPause(track)
                      }}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </Button>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-semibold truncate transition-colors duration-300",
                      isHovered && "text-primary",
                      isPlaying && "text-primary",
                    )}
                  >
                    {track.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {track.artists.map((a) => a.name).join(", ")}
                  </p>
                </div>

                {/* Album Name */}
                <div className="hidden lg:block text-sm text-muted-foreground truncate max-w-[200px]">
                  {track.album.name}
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {formatDuration(track.duration_ms)}
                </div>

                {/* Popularity with animated bar */}
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      <PopularityIcon className={cn("w-3 h-3", popularityInfo.color)} />
                      <span className="text-xs text-muted-foreground">{popularityInfo.label}</span>
                    </div>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          track.popularity >= 80 && "bg-gradient-to-r from-orange-500 to-red-500",
                          track.popularity >= 60 &&
                            track.popularity < 80 &&
                            "bg-gradient-to-r from-blue-500 to-cyan-500",
                          track.popularity < 60 && "bg-gradient-to-r from-pink-500 to-purple-500",
                        )}
                        style={{
                          width: isHovered ? `${track.popularity}%` : "0%",
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{track.popularity}%</span>
                </div>

                {/* Open in Spotify */}
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn("opacity-0 group-hover:opacity-100 transition-opacity", isHovered && "scale-110")}
                  asChild
                >
                  <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
