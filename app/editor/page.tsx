"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Download } from "lucide-react"
import html2canvas from "html2canvas"

export default function EditorPage() {
  const router = useRouter()
  const imageRef = useRef<HTMLDivElement>(null)

  const [image, setImage] = useState<string | null>(null)
  const [filter, setFilter] = useState("none")

  useEffect(() => {
    const storedImage = localStorage.getItem("pixtone-image")
    if (!storedImage) {
      router.push("/")
    } else {
      setImage(storedImage)
    }
  }, [router])

  const filters: Record<string, string> = {
    none: "none",
    subtle: "brightness(1.05) contrast(1.05) saturate(1.1)",
    strong: "brightness(1.1) contrast(1.2) saturate(1.3)",
    bw: "grayscale(1) contrast(1.1)",
    cold: "brightness(1.05) contrast(1.05) saturate(1.1) hue-rotate(180deg)",
  }

  // 📥 EXPORT IMAGE
  const handleDownload = async () => {
    if (!imageRef.current) return

    const canvas = await html2canvas(imageRef.current)
    const dataUrl = canvas.toDataURL("image/png")

    // téléchargement
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = "pixtone-edit.png"
    link.click()

    // sauvegarde dans galerie
    const existing = JSON.parse(localStorage.getItem("pixtone-gallery") || "[]")
    existing.push(dataUrl)
    localStorage.setItem("pixtone-gallery", JSON.stringify(existing))
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b border-zinc-800">
        <button onClick={() => router.push("/gallery")} className="text-sm text-gray-400">
          Galerie
        </button>

        <button onClick={handleDownload}>
          <Download size={22} />
        </button>
      </div>

      {/* IMAGE */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {image && (
          <div ref={imageRef}>
            <img
              src={image}
              alt="preview"
              className="max-h-full max-w-full object-contain"
              style={{ filter: filters[filter] }}
            />
          </div>
        )}
      </div>

      {/* SIMPLE FILTER BAR */}
      <div className="bg-zinc-950 border-t border-zinc-800 flex justify-around py-3">
        <button onClick={() => setFilter("none")}>Normal</button>
        <button onClick={() => setFilter("subtle")}>Subtil</button>
        <button onClick={() => setFilter("strong")}>Forte</button>
        <button onClick={() => setFilter("bw")}>N&B</button>
        <button onClick={() => setFilter("cold")}>Froid</button>
      </div>

    </div>
  )
}