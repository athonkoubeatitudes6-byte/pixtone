"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function EditorPage() {
  const router = useRouter()

  const [image, setImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [filter, setFilter] = useState("none")

  // 🔐 Sécurité : vérifier si image existe
  useEffect(() => {
    const storedImage = localStorage.getItem("pixtone-image")

    if (!storedImage) {
      router.push("/")
    } else {
      setImage(storedImage)
    }
  }, [router])

  // 🎨 Filtres réels
  const filters: Record<string, string> = {
    none: "none",
    subtle: "brightness(1.05) contrast(1.05) saturate(1.1)",
    strong: "brightness(1.1) contrast(1.2) saturate(1.3)",
    bw: "grayscale(1) contrast(1.1)",
    cold: "brightness(1.05) contrast(1.05) saturate(1.1) hue-rotate(180deg)",
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">

      {/* IMAGE AREA */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {image && (
          <img
            src={image}
            alt="preview"
            className="max-h-full max-w-full object-contain transition-all duration-300"
            style={{ filter: filters[filter] }}
          />
        )}
      </div>

      {/* PANEL */}
      {activeTab && (
        <div className="bg-zinc-900 p-4 border-t border-zinc-800">

          {/* ACTIONS */}
          {activeTab === "actions" && (
            <div className="flex gap-4 overflow-x-auto">
              <button className="px-4 py-2 bg-zinc-800 rounded">Auto</button>
              <button className="px-4 py-2 bg-zinc-800 rounded">Améliorer</button>
              <button className="px-4 py-2 bg-zinc-800 rounded">Sujet</button>
              <button className="px-4 py-2 bg-zinc-800 rounded">Ciel</button>
            </div>
          )}

          {/* FILTRES */}
          {activeTab === "filters" && (
            <div className="flex gap-4 overflow-x-auto">
              <button onClick={() => setFilter("none")} className="px-4 py-2 bg-zinc-800 rounded">Normal</button>
              <button onClick={() => setFilter("subtle")} className="px-4 py-2 bg-zinc-800 rounded">Subtil</button>
              <button onClick={() => setFilter("strong")} className="px-4 py-2 bg-zinc-800 rounded">Forte</button>
              <button onClick={() => setFilter("bw")} className="px-4 py-2 bg-zinc-800 rounded">N&B</button>
              <button onClick={() => setFilter("cold")} className="px-4 py-2 bg-zinc-800 rounded">Froid</button>
            </div>
          )}

          {/* AUTRES ONGLET (placeholder pour futur) */}
          {activeTab === "crop" && (
            <div className="text-gray-400">Outil de recadrage à venir...</div>
          )}

          {activeTab === "adjust" && (
            <div className="text-gray-400">Réglages lumière / couleur à venir...</div>
          )}

          {activeTab === "mask" && (
            <div className="text-gray-400">Masquage intelligent à venir...</div>
          )}

        </div>
      )}

      {/* BOTTOM NAV */}
      <div className="bg-zinc-950 flex justify-around py-3 border-t border-zinc-800">
        <button onClick={() => setActiveTab("actions")}>Actions</button>
        <button onClick={() => setActiveTab("filters")}>Filtres</button>
        <button onClick={() => setActiveTab("crop")}>Recadrage</button>
        <button onClick={() => setActiveTab("adjust")}>Modifier</button>
        <button onClick={() => setActiveTab("mask")}>Masquage</button>
      </div>

    </div>
  )
}