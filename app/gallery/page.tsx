"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function GalleryPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("pixtone-gallery") || "[]")
    setImages(stored)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-4">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Photos modifiées</h1>
        <button onClick={() => router.push("/")} className="text-gray-400">
          Accueil
        </button>
      </div>

      {images.length === 0 ? (
        <p className="text-gray-500">Aucune image téléchargée.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              className="rounded-lg"
            />
          ))}
        </div>
      )}

    </div>
  )
}