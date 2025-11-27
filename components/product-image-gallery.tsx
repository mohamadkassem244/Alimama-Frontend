"use client"

import { useState } from "react"
import { Play } from "lucide-react"

interface ProductImageGalleryProps {
  images: string[]
  name: string
  videoUrl?: string
}

export function ProductImageGallery({ images, name, videoUrl }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})

  const allImages = images.filter(Boolean)

  if (allImages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted flex items-center justify-center">
          <img src="/diverse-products-still-life.png" alt={name} className="w-full h-full object-cover" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        {imageError[selectedImage] ? (
          <img src="/diverse-products-still-life.png" alt={name} className="w-full h-full object-cover" />
        ) : (
          <img
            src={allImages[selectedImage] || "/placeholder.svg"}
            alt={`${name} - Image ${selectedImage + 1}`}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            loading="eager"
            onError={() => {
              setImageError((prev) => ({ ...prev, [selectedImage]: true }))
            }}
          />
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-[3/4] overflow-hidden rounded-lg bg-muted border-2 transition-colors ${
              selectedImage === index ? "border-primary" : "border-transparent"
            }`}
          >
            {imageError[index] ? (
              <img
                src="/placeholder.svg?height=300&width=225"
                alt={`${name} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={image || "/placeholder.svg"}
                alt={`${name} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => {
                  setImageError((prev) => ({ ...prev, [index]: true }))
                }}
              />
            )}
          </button>
        ))}

        {videoUrl && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted border-2 border-transparent hover:border-primary transition-colors flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
            <Play className="h-12 w-12 text-white relative z-10" />
          </a>
        )}
      </div>
    </div>
  )
}
