"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TranslatedText } from "./translated-text"

export function HeroSection() {
  return (
    <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <img
          src="/hero-ecommerce-shopping.jpg"
          alt="E-commerce shopping experience"
          className="w-full h-full object-cover opacity-60"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      {/* </CHANGE> */}

      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-balance text-white drop-shadow-lg">
          <TranslatedText text="Discover Your Style" />
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 text-balance drop-shadow-md">
          <TranslatedText text="Shop the latest trends in fashion, accessories, and lifestyle products" />
        </p>
        {/* </CHANGE> */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/?tag=new arrival">
            <Button size="lg" className="w-full sm:w-auto">
              <TranslatedText text="Shop New Arrivals" />
            </Button>
          </Link>
          <Link href="/sale">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            >
              <TranslatedText text="View Sale" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
