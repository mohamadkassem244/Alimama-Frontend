"use client"

import type React from "react"

import { useEffect } from "react"
import { useTranslation } from "@/lib/translation-context"

interface AutoTranslateWrapperProps {
  children: React.ReactNode
}

export function AutoTranslateWrapper({ children }: AutoTranslateWrapperProps) {
  const { targetLanguage } = useTranslation()

  useEffect(() => {
    // Add data attribute to body for CSS or conditional rendering
    document.documentElement.setAttribute("data-translate-lang", targetLanguage)
  }, [targetLanguage])

  return <>{children}</>
}
