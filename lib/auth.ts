import { cookies } from "next/headers"

export async function getSession() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("spotify_access_token")?.value
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value

  return { accessToken, refreshToken }
}

export async function setSession(accessToken: string, refreshToken: string, expiresIn: number) {
  const cookieStore = await cookies()

  cookieStore.set("spotify_access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: expiresIn,
    path: "/",
  })

  cookieStore.set("spotify_refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete("spotify_access_token")
  cookieStore.delete("spotify_refresh_token")
}
