"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Wand2,
  Sliders,
  Crop,
  Sparkles,
  Layers,
  Download
} from "lucide-react"
import html2canvas from "html2canvas"

export default function EditorPage() {
  const router = useRouter()
  const imageRef = useRef<HTMLDivElement>(null)

  const [image, setImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [filter, setFilter] = useState("none")
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    const storedImage = localStorage.getItem("pixtone-image")
    if (!storedImage) {
      router.push("/")
    } else {
      setImage(storedImage)
    }
  }, [router])

  const toggleTab = (tab: string) => {
    if (tab === "filters" && activeTab !== "filters") {
      setAnalyzing(true)
      setTimeout(() => setAnalyzing(false), 800)
    }
    setActiveTab(prev => (prev === tab ? null : tab))
  }

  const filters: Record<string, string> = {
    none: "none",
    subtle: "brightness(1.05) contrast(1.05) saturate(1.1)",
    strong: "brightness(1.15) contrast(1.25) saturate(1.4)",
    bw: "grayscale(1) contrast(1.2)",
    cold: "brightness(1.05) contrast(1.1) saturate(1.1) hue-rotate(180deg)",
  }

  const handleDownload = async () => {
    if (!imageRef.current) return

    const canvas = await html2canvas(imageRef.current)
    const dataUrl = canvas.toDataURL("image/png")

    const link = document.createElement("a")
    link.href = dataUrl
    link.download = "pixtone-edit.png"
    link.click()

    const existing = JSON.parse(localStorage.getItem("pixtone-gallery") || "[]")
    existing.push(dataUrl)
    localStorage.setItem("pixtone-gallery", JSON.stringify(existing))
  }

  // 🔥 IA AUTO ENHANCE
  const handleAutoEnhance = async () => {
    if (!image) return

    try {
      setAnalyzing(true)

      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      })

      const data = await res.json()

      if (data.output) {
        setImage(data.output)
      }

    } catch (err) {
      console.error("Erreur IA:", err)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
        <div className="text-lg font-semibold tracking-wide">Pixtone</div>

        <button
          onClick={handleDownload}
          className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 transition"
        >
          <Download size={20} />
        </button>
      </div>

      {/* IMAGE */}
      <div className="flex-1 flex items-center justify-center overflow-hidden px-4">
        {image && (
          <div ref={imageRef} className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={image}
              alt="preview"
              className="max-h-[75vh] max-w-full object-contain transition-all duration-300"
              style={{ filter: filters[filter] }}
            />
          </div>
        )}
      </div>

      {/* PANEL */}
      <div
        className={`transition-all duration-300 overflow-hidden bg-zinc-900 border-t border-zinc-800 ${
          activeTab ? "max-h-72 p-5" : "max-h-0 p-0"
        }`}
      >

        {/* ACTIONS */}
        {activeTab === "actions" && (
          <PanelContainer>
            <PanelButton onClick={handleAutoEnhance}>
              {analyzing ? "Analyse IA..." : "Auto IA"}
            </PanelButton>
            <PanelButton>Améliorer</PanelButton>
            <PanelButton>Sujet</PanelButton>
            <PanelButton>Ciel</PanelButton>
          </PanelContainer>
        )}

        {/* FILTRES */}
        {activeTab === "filters" && image && (
          <div className="flex gap-4 overflow-x-auto">
            {Object.entries(filters).map(([key, value]) => (
              <div
                key={key}
                onClick={() => setFilter(key)}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition ${
                  filter === key
                    ? "border-blue-500 scale-105"
                    : "border-transparent hover:scale-105"
                }`}
              >
                <img
                  src={image}
                  alt={key}
                  className="w-24 h-24 object-cover"
                  style={{ filter: value }}
                />
                <div className="text-xs text-center py-1 bg-zinc-800">
                  {key.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "crop" && (
          <div className="text-center text-gray-400">
            Recadrage bientôt disponible...
          </div>
        )}

        {activeTab === "adjust" && (
          <div className="text-center text-gray-400">
            Réglages avancés bientôt disponibles...
          </div>
        )}

        {activeTab === "mask" && (
          <div className="text-center text-gray-400">
            Masquage intelligent bientôt disponible...
          </div>
        )}

      </div>

      {/* NAVIGATION BAS */}
      <div className="bg-zinc-950 border-t border-zinc-800 py-4">
        <div className="flex justify-center gap-8">

          <NavButton icon={<Wand2 size={20} />} label="Actions" active={activeTab === "actions"} onClick={() => toggleTab("actions")} />
          <NavButton icon={<Sparkles size={20} />} label="Filtres" active={activeTab === "filters"} onClick={() => toggleTab("filters")} />
          <NavButton icon={<Crop size={20} />} label="Recadrage" active={activeTab === "crop"} onClick={() => toggleTab("crop")} />
          <NavButton icon={<Sliders size={20} />} label="Modifier" active={activeTab === "adjust"} onClick={() => toggleTab("adjust")} />
          <NavButton icon={<Layers size={20} />} label="Masque" active={activeTab === "mask"} onClick={() => toggleTab("mask")} />

        </div>
      </div>

    </div>
  )
}

function NavButton({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center text-xs transition-all ${
        active ? "text-white scale-105" : "text-gray-500"
      }`}
    >
      <div
        className={`p-3 rounded-2xl transition-all ${
          active ? "bg-zinc-800 shadow-lg" : "hover:bg-zinc-800"
        }`}
      >
        {icon}
      </div>
      <span className="mt-1">{label}</span>
    </button>
  )
}

function PanelContainer({ children }: any) {
  return (
    <div className="flex gap-4 overflow-x-auto justify-center">
      {children}
    </div>
  )
}

function PanelButton({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm transition whitespace-nowrap"
    >
      {children}
    </button>
  )
}