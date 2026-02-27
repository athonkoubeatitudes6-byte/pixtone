"use client"

import { useState, useEffect } from "react"
import { Sun, Palette, Sparkles, Sliders } from "lucide-react"

export default function EditorPage() {
  const [image, setImage] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("light")

  const [values, setValues] = useState({
    exposure: 0,
    contrast: 0,
    highlights: 0,
    saturation: 0,
  })

  useEffect(() => {
    const storedImage = localStorage.getItem("pixtone-image")
    if (storedImage) {
      setImage(storedImage)
    }
  }, [])

  const updateValue = (key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const filterStyle = `
    brightness(${1 + values.exposure / 100})
    contrast(${1 + values.contrast / 100})
    saturate(${1 + values.saturation / 100})
  `

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">

      {/* IMAGE */}
      <div className="flex-1 flex items-center justify-center overflow-hidden bg-black">
        {image ? (
          <img
            src={image}
            alt="preview"
            className="max-h-full object-contain transition-all duration-200"
            style={{ filter: filterStyle }}
          />
        ) : (
          <div className="text-gray-500">
            Aucune image chargée
          </div>
        )}
      </div>

      {/* SLIDERS */}
      <div className="bg-[#111] px-5 pt-4 pb-6 min-h-[180px]">

        {activeCategory === "light" && (
          <div className="space-y-6">
            <Slider label="Exposition" value={values.exposure} onChange={(v) => updateValue("exposure", v)} />
            <Slider label="Contraste" value={values.contrast} onChange={(v) => updateValue("contrast", v)} />
            <Slider label="Hautes lumières" value={values.highlights} onChange={(v) => updateValue("highlights", v)} />
          </div>
        )}

        {activeCategory === "color" && (
          <div className="space-y-6">
            <Slider label="Saturation" value={values.saturation} onChange={(v) => updateValue("saturation", v)} />
          </div>
        )}

        {activeCategory === "effects" && (
          <div className="text-center text-gray-500 mt-6">
            Effets bientôt disponibles
          </div>
        )}

        {activeCategory === "detail" && (
          <div className="text-center text-gray-500 mt-6">
            Détail bientôt disponible
          </div>
        )}
      </div>

      {/* MENU */}
      <div className="bg-[#0c0c0c] border-t border-zinc-800 flex justify-around py-3 text-xs">
        <CategoryItem icon={<Sparkles size={20} />} label="Auto" active={false} onClick={() => {}} />
        <CategoryItem icon={<Sun size={20} />} label="Lumière" active={activeCategory === "light"} onClick={() => setActiveCategory("light")} />
        <CategoryItem icon={<Palette size={20} />} label="Couleur" active={activeCategory === "color"} onClick={() => setActiveCategory("color")} />
        <CategoryItem icon={<Sliders size={20} />} label="Effets" active={activeCategory === "effects"} onClick={() => setActiveCategory("effects")} />
        <CategoryItem icon={<Sliders size={20} />} label="Détail" active={activeCategory === "detail"} onClick={() => setActiveCategory("detail")} />
      </div>
    </div>
  )
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex justify-between text-sm text-gray-300 mb-2">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={-100}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-white"
      />
    </div>
  )
}

function CategoryItem({
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
      className={`flex flex-col items-center gap-1 ${
        active ? "text-white" : "text-gray-500"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}