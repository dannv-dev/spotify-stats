"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Music, Zap, Smile, Guitar } from "lucide-react"

interface AudioFeaturesChartProps {
  audioFeatures: any[]
}

export function AudioFeaturesChart({ audioFeatures }: AudioFeaturesChartProps) {
  // Calculate average audio features
  const validFeatures = audioFeatures.filter((f) => f !== null)

  if (validFeatures.length === 0) {
    return null
  }

  const avgFeatures = {
    danceability: validFeatures.reduce((sum, f) => sum + f.danceability, 0) / validFeatures.length,
    energy: validFeatures.reduce((sum, f) => sum + f.energy, 0) / validFeatures.length,
    valence: validFeatures.reduce((sum, f) => sum + f.valence, 0) / validFeatures.length,
    acousticness: validFeatures.reduce((sum, f) => sum + f.acousticness, 0) / validFeatures.length,
    instrumentalness: validFeatures.reduce((sum, f) => sum + f.instrumentalness, 0) / validFeatures.length,
    speechiness: validFeatures.reduce((sum, f) => sum + f.speechiness, 0) / validFeatures.length,
  }

  const avgTempo = validFeatures.reduce((sum, f) => sum + f.tempo, 0) / validFeatures.length

  const barData = [
    { name: "Danceability", value: avgFeatures.danceability * 100, fill: "hsl(var(--chart-1))" },
    { name: "Energy", value: avgFeatures.energy * 100, fill: "hsl(var(--chart-2))" },
    { name: "Valence", value: avgFeatures.valence * 100, fill: "hsl(var(--chart-3))" },
    { name: "Acousticness", value: avgFeatures.acousticness * 100, fill: "hsl(var(--chart-4))" },
  ]

  const radarData = [
    { feature: "Dance", value: avgFeatures.danceability * 100 },
    { feature: "Energy", value: avgFeatures.energy * 100 },
    { feature: "Valence", value: avgFeatures.valence * 100 },
    { feature: "Acoustic", value: avgFeatures.acousticness * 100 },
    { feature: "Instrumental", value: avgFeatures.instrumentalness * 100 },
    { feature: "Speech", value: avgFeatures.speechiness * 100 },
  ]

  const getVibeDescription = () => {
    if (avgFeatures.energy > 0.7 && avgFeatures.danceability > 0.7) return "High energy party vibes!"
    if (avgFeatures.valence > 0.7) return "Feeling happy and positive!"
    if (avgFeatures.acousticness > 0.7) return "Acoustic and chill"
    if (avgFeatures.energy > 0.7) return "Energetic and intense"
    return "Balanced musical taste"
  }

  return (
    <div className="space-y-4">
      <Card className="border-border bg-gradient-to-r from-primary/10 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-primary animate-pulse" />
            <div>
              <p className="text-sm text-muted-foreground">Your Music Vibe</p>
              <p className="text-xl font-bold">{getVibeDescription()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Audio Features
            </CardTitle>
            <CardDescription>Average characteristics of your top tracks</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Value",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-primary" />
              Feature Radar
            </CardTitle>
            <CardDescription>Comprehensive audio profile visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Value",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid className="stroke-muted" />
                  <PolarAngleAxis
                    dataKey="feature"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Radar
                    name="Features"
                    dataKey="value"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.6}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Guitar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Average Tempo</span>
                </div>
                <span className="text-lg font-bold text-primary">{Math.round(avgTempo)} BPM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
