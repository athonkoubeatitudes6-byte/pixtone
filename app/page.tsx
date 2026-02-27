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

    // Vérification sécurité (image seulement)
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image valide.")
      return
    }

    const reader = new FileReader()

    reader.onload = function () {
      try {
        const result = reader.result as string

        // On supprime ancienne image si existe
        localStorage.removeItem("pixtone-image")

        // On sauvegarde la nouvelle image
        localStorage.setItem("pixtone-image", result)

        // Petite sécurité avant redirection
        setTimeout(() => {
          router.push("/editor")
        }, 150)

      } catch (error) {
        console.error("Erreur upload:", error)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* HEADER */}
      <div className="p-6 text-xl font-bold">
        PixTone
      </div>

      {/* HERO */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Sublime tes photos en un instant ✨
        </h1>

        <p className="mt-6 text-gray-400 max-w-xl text-lg">
          PixTone est une application gratuite et puissante pour transformer
          tes images avec des outils professionnels inspirés de Lightroom.
        </p>

        <button
          onClick={handleImportClick}
          className="mt-10 bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 active:scale-95 transition"
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