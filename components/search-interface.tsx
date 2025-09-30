"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2, Music, Users, Disc } from "lucide-react"

export function SearchInterface() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for tracks, artists, or albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={loading || !query.trim()}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      {results && (
        <Tabs defaultValue="tracks" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracks">
              <Music className="w-4 h-4 mr-2" />
              Tracks ({results.tracks?.items.length || 0})
            </TabsTrigger>
            <TabsTrigger value="artists">
              <Users className="w-4 h-4 mr-2" />
              Artists ({results.artists?.items.length || 0})
            </TabsTrigger>
            <TabsTrigger value="albums">
              <Disc className="w-4 h-4 mr-2" />
              Albums ({results.albums?.items.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-3 mt-6">
            {results.tracks?.items.map((track: any) => (
              <Card key={track.id} className="border-border bg-card hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14 rounded">
                      <AvatarImage src={track.album.images?.[0]?.url || "/placeholder.svg"} alt={track.name} />
                      <AvatarFallback className="rounded">{track.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{track.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.artists.map((a: any) => a.name).join(", ")}
                      </p>
                    </div>

                    <div className="hidden sm:block text-sm text-muted-foreground truncate max-w-[200px]">
                      {track.album.name}
                    </div>

                    {track.preview_url && (
                      <audio controls className="h-8">
                        <source src={track.preview_url} type="audio/mpeg" />
                      </audio>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="artists" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.artists?.items.map((artist: any) => (
                <Card key={artist.id} className="border-border bg-card hover:bg-accent/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Avatar className="w-full aspect-square rounded-lg">
                        <AvatarImage
                          src={artist.images?.[0]?.url || "/placeholder.svg"}
                          alt={artist.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-lg text-4xl">{artist.name[0]}</AvatarFallback>
                      </Avatar>

                      <div className="space-y-1">
                        <h3 className="font-bold truncate">{artist.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {artist.followers.total.toLocaleString()} followers
                        </p>
                        <p className="text-xs text-muted-foreground capitalize truncate">
                          {artist.genres.slice(0, 2).join(", ") || "Artist"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="albums" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.albums?.items.map((album: any) => (
                <Card key={album.id} className="border-border bg-card hover:bg-accent/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={album.images?.[0]?.url || "/placeholder.svg"}
                          alt={album.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold truncate">{album.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {album.artists.map((a: any) => a.name).join(", ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {album.release_date.split("-")[0]} • {album.total_tracks} tracks
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {!results && !loading && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Search for your favorite tracks, artists, and albums</p>
        </div>
      )}
    </div>
  )
}
