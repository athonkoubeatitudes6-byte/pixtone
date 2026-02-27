"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Wand2,
  Sliders,
  Crop,
  Sparkles,
  Layers
} from "lucide-react"

export default function EditorPage() {
  const router = useRouter()

  const [image, setImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [filter, setFilter] = useState("none")

  useEffect(() => {
    const storedImage = localStorage.getItem("pixtone-image")
    if (!storedImage) {
      router.push("/")
    } else {
      setImage(storedImage)
    }
  }, [router])

  // Toggle propre (ouvre / ferme)
  const toggleTab = (tab: string) => {
    setActiveTab(prev => (prev === tab ? null : tab))
  }

  const filters: Record<string, string> = {
    none: "none",
    subtle: "brightness(1.05) contrast(1.05) saturate(1.1)",
    strong: "brightness(1.1) contrast(1.2) saturate(1.3)",
    bw: "grayscale(1) contrast(1.1)",
    cold: "brightness(1.05) contrast(1.05) saturate(1.1) hue-rotate(180deg)",
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">

      {/* IMAGE */}
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

      {/* PANEL ANIMÉ */}
      <div
        className={`transition-all duration-300 overflow-hidden bg-zinc-900 border-t border-zinc-800 ${
          activeTab ? "max-h-40 p-4" : "max-h-0 p-0"
        }`}
      >
        {activeTab === "actions" && (
          <div className="flex gap-4 overflow-x-auto">
            <button className="btn">Auto</button>
            <button className="btn">Améliorer</button>
            <button className="btn">Sujet</button>
            <button className="btn">Ciel</button>
          </div>
        )}

        {activeTab === "filters" && (
          <div className="flex gap-4 overflow-x-auto">
            <button onClick={() => setFilter("none")} className="btn">Normal</button>
            <button onClick={() => setFilter("subtle")} className="btn">Subtil</button>
            <button onClick={() => setFilter("strong")} className="btn">Forte</button>
            <button onClick={() => setFilter("bw")} className="btn">N&B</button>
            <button onClick={() => setFilter("cold")} className="btn">Froid</button>
          </div>
        )}

        {activeTab === "crop" && (
          <div className="text-gray-400">Recadrage bientôt disponible...</div>
        )}

        {activeTab === "adjust" && (
          <div className="text-gray-400">Réglages avancés bientôt disponibles...</div>
        )}

        {activeTab === "mask" && (
          <div className="text-gray-400">Masquage intelligent bientôt disponible...</div>
        )}
      </div>

      {/* BOTTOM NAV PRO */}
      <div className="bg-zinc-950 border-t border-zinc-800 px-4 py-3">
        <div className="flex justify-between items-center max-w-md mx-auto">

          <NavButton
            icon={<Wand2 size={20} />}
            label="Actions"
            active={activeTab === "actions"}
            onClick={() => toggleTab("actions")}
          />

          <NavButton
            icon={<Sparkles size={20} />}
            label="Filtres"
            active={activeTab === "filters"}
            onClick={() => toggleTab("filters")}
          />

          <NavButton
            icon={<Crop size={20} />}
            label="Recadrage"
            active={activeTab === "crop"}
            onClick={() => toggleTab("crop")}
          />

          <NavButton
            icon={<Sliders size={20} />}
            label="Modifier"
            active={activeTab === "adjust"}
            onClick={() => toggleTab("adjust")}
          />

          <NavButton
            icon={<Layers size={20} />}
            label="Masque"
            active={activeTab === "mask"}
            onClick={() => toggleTab("mask")}
          />

        </div>
      </div>

    </div>
  )
}

// Bouton stylé
function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center text-xs transition ${
        active ? "text-white" : "text-gray-500"
      }`}
    >
      <div
        className={`p-2 rounded-xl transition ${
          active ? "bg-zinc-800" : ""
        }`}
      >
        {icon}
      </div>
      <span className="mt-1">{label}</span>
    </button>
  )
}