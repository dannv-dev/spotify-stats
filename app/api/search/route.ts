import { getSession } from "@/lib/auth"
import { spotifyApi } from "@/lib/spotify"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { accessToken } = await getSession()

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter required" }, { status: 400 })
  }

  try {
    const results = await spotifyApi(
      `/search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=20`,
      accessToken,
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Search API error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
