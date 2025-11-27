"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/translation-context"
import { Languages, Loader2 } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

export default function TranslateDemoPage() {
  const [inputText, setInputText] = useState("")
  const [translatedResult, setTranslatedResult] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const { translateText, targetLanguage } = useTranslation()

  const handleTranslate = async () => {
    if (!inputText.trim()) return

    setIsTranslating(true)
    const result = await translateText(inputText, "auto")
    setTranslatedResult(result)
    setIsTranslating(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-serif font-bold">
              <TranslatedText text="Translation Demo" />
            </h1>
            <p className="text-muted-foreground text-lg">
              <TranslatedText text="Test the translation feature by entering text in any language" />
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                <TranslatedText text="Translate Text" />
              </CardTitle>
              <CardDescription>
                <TranslatedText text="Enter text in any language and translate it to English or your selected language" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  <TranslatedText text="Input Text (Any Language)" />
                </label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text here..."
                  rows={6}
                  className="resize-none"
                />
              </div>

              <Button onClick={handleTranslate} disabled={isTranslating || !inputText.trim()} className="w-full">
                {isTranslating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <TranslatedText text="Translating..." />
                  </>
                ) : (
                  <>
                    <Languages className="mr-2 h-4 w-4" />
                    <TranslatedText
                      text={`Translate to ${targetLanguage === "en" ? "English" : targetLanguage.toUpperCase()}`}
                    />
                  </>
                )}
              </Button>

              {translatedResult && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    <TranslatedText text="Translated Result" />
                  </label>
                  <div className="p-4 bg-muted rounded-md min-h-[150px]">
                    <p className="text-foreground">{translatedResult}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatedText text="How It Works" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">
                  <TranslatedText text="Automatic Product Translation" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  <TranslatedText text="All product names and descriptions are automatically translated when you select a different language from the header" />
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">
                  <TranslatedText text="Language Detection" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  <TranslatedText text="The system automatically detects the source language and translates to your preferred language" />
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">
                  <TranslatedText text="Translation Cache" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  <TranslatedText text="Translations are cached to improve performance and reduce API calls" />
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
