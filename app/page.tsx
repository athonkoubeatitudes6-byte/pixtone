"use client"

import { useRouter } from "next/navigation"
import { useRef } from "react"

export default function HomePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      localStorage.setItem("pixtone-image", reader.result as string)
      router.push("/editor")
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* HEADER */}
      <div className="p-6 text-xl font-bold">
        PixTone
      </div>

      {/* HERO SECTION */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Transforme tes photos en œuvres professionnelles ✨
        </h1>

        <p className="mt-6 text-gray-400 max-w-xl text-lg">
          Bienvenue sur <span className="text-white font-semibold">PixTone</span>,
          l’application gratuite et puissante qui sublime tes images
          en quelques secondes. Ajuste la lumière, les couleurs,
          les détails et bien plus encore.
        </p>

        <button
          onClick={handleImportClick}
          className="mt-10 bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition"
        >
          Importer une photo
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}