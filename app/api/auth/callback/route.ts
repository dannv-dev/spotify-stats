import { getAccessToken } from "@/lib/spotify"
import { setSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url))
  }

  try {
    const data = await getAccessToken(code)

    if (data.access_token) {
      await setSession(data.access_token, data.refresh_token, data.expires_in)
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.redirect(new URL("/?error=token_failed", request.url))
  } catch (error) {
    console.error("[v0] Auth callback error:", error)
    return NextResponse.redirect(new URL("/?error=server_error", request.url))
  }
}
