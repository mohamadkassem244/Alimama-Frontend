import { NextRequest, NextResponse } from "next/server"
import { API_BASE_URL } from "@/services/api-client"
import { Agent } from "undici"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get("keyword")
  const page = searchParams.get("page") || "1"
  const pageSize = searchParams.get("page_size") || "20"

  if (!keyword) {
    return NextResponse.json({ success: false, error: "keyword query param is required" }, { status: 400 })
  }

  const upstreamUrl = `${API_BASE_URL}/v2_0_0-search/search?keyword=${encodeURIComponent(keyword)}&page=${page}&page_size=${pageSize}`

  try {
    const dispatcher = new Agent({
      connect: {
        rejectUnauthorized: false,
      },
    })

    const response = await fetch(upstreamUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      dispatcher,
    })

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Upstream error ${response.status}: ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[search API] Failed to fetch results:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch search results" }, { status: 500 })
  }
}

