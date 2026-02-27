"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sun, Palette, Sparkles, Sliders } from "lucide-react"

export default function EditorPage() {
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("light")

  const [values, setValues] = useState({
    exposure: 0,
    contrast: 0,
    saturation: 0,
  })

  useEffect(() => {
    const storedImage = localStorage.getItem("pixtone-image")
    if (!storedImage) {
      router.push("/")
    } else {
      setImage(storedImage)
    }
  }, [router])

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
      <div className="flex-1 flex items-center justify-center bg-black">
        {image && (
          <img
            src={image}
            alt="preview"
            className="max-h-full object-contain"
            style={{ filter: filterStyle }}
          />
        )}
      </div>

      {/* SLIDERS */}
      <div className="bg-[#111] px-5 pt-4 pb-6 min-h-[180px]">

        {activeCategory === "light" && (
          <div className="space-y-6">
            <Slider label="Exposition" value={values.exposure} onChange={(v) => updateValue("exposure", v)} />
            <Slider label="Contraste" value={values.contrast} onChange={(v) => updateValue("contrast", v)} />
          </div>
        )}

        {activeCategory === "color" && (
          <div className="space-y-6">
            <Slider label="Saturation" value={values.saturation} onChange={(v) => updateValue("saturation", v)} />
          </div>
        )}
      </div>

      {/* MENU */}
      <div className="bg-[#0c0c0c] border-t border-zinc-800 flex justify-around py-3 text-xs">
        <CategoryItem icon={<Sparkles size={20} />} label="Auto" active={false} onClick={() => {}} />
        <CategoryItem icon={<Sun size={20} />} label="Lumière" active={activeCategory === "light"} onClick={() => setActiveCategory("light")} />
        <CategoryItem icon={<Palette size={20} />} label="Couleur" active={activeCategory === "color"} onClick={() => setActiveCategory("color")} />
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