// Base API client configuration
const API_BASE_URL = "https://cms2.devback.website"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Generic API fetch wrapper with error handling
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    console.log("[v0] Fetching from:", `${API_BASE_URL}${endpoint}`)

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] API Response received successfully")

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("[v0] API Fetch Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Client-side API fetch (for use in client components)
export async function clientApiFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    console.log("[v0] Client fetching from:", `${API_BASE_URL}${endpoint}`)

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      mode: "cors", // Enable CORS for client-side requests
    })

    console.log("[v0] Client response status:", response.status)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Client API Response received successfully")

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("[v0] Client API Fetch Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    console.log("[v0] apiClient.get:", `${API_BASE_URL}${endpoint}`)

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data as T
  },
}

export { API_BASE_URL }
