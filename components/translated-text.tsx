"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/translation-context"
import type { JSX } from "react/jsx-runtime" // Added import for JSX

interface TranslatedTextProps {
  text: string
  sourceLang?: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function TranslatedText({ text, sourceLang = "auto", className, as: Component = "span" }: TranslatedTextProps) {
  const { translateText, targetLanguage } = useTranslation()
  const [translatedText, setTranslatedText] = useState(text)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    const performTranslation = async () => {
      if (targetLanguage === "en") {
        setTranslatedText(text)
        return
      }

      setIsLoading(true)
      const result = await translateText(text, sourceLang)

      if (isMounted) {
        setTranslatedText(result)
        setIsLoading(false)
      }
    }

    performTranslation()

    return () => {
      isMounted = false
    }
  }, [text, targetLanguage, sourceLang, translateText])

  return <Component className={className}>{isLoading ? text : translatedText}</Component>
}
