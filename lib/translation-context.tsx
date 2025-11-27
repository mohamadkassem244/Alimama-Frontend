"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface TranslationContextType {
  targetLanguage: string
  setTargetLanguage: (lang: string) => void
  translateText: (text: string, sourceLang?: string) => Promise<string>
  isTranslating: boolean
  translationCache: Map<string, string>
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationCache] = useState(new Map<string, string>())

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage")
    if (savedLang) {
      setTargetLanguage(savedLang)
    }
  }, [])

  // Save language preference
  useEffect(() => {
    localStorage.setItem("preferredLanguage", targetLanguage)
  }, [targetLanguage])

  const translateText = async (text: string, sourceLang = "auto"): Promise<string> => {
    // If target is English and text is already English, return as is
    if (targetLanguage === "en") {
      return text
    }

    // Check cache first
    const cacheKey = `${sourceLang}-${targetLanguage}-${text}`
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!
    }

    setIsTranslating(true)

    try {
      // Using MyMemory Translation API (free, no API key required)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLanguage}`,
      )
      const data = await response.json()

      if (data.responseStatus === 200 && data.responseData) {
        const translated = data.responseData.translatedText
        translationCache.set(cacheKey, translated)
        return translated
      }

      // Fallback to original text if translation fails
      return text
    } catch (error) {
      console.error("[v0] Translation error:", error)
      return text
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <TranslationContext.Provider
      value={{
        targetLanguage,
        setTargetLanguage,
        translateText,
        isTranslating,
        translationCache,
      }}
    >
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider")
  }
  return context
}
