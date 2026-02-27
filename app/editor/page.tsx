"use client"

import { useState } from "react"
import { Sliders, Sparkles, Crop, Settings, Eraser, Wand2 } from "lucide-react"

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState("modif")

  const [values, setValues] = useState({
    exposure: 0,
    contrast: 0,
    highlights: 0,
  })

  const updateValue = (key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const filterStyle = `
    brightness(${1 + values.exposure / 100})
    contrast(${1 + values.contrast / 100})
  `

  return (
    <div className="flex flex-col h-screen bg-black text-white">

      {/* IMAGE FULL SCREEN */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <img
          src="/test.jpg"
          alt="preview"
          className="max-h-full object-contain"
          style={{ filter: filterStyle }}
        />
      </div>

      {/* SLIDERS PANEL (LIKE LIGHTROOM) */}
      {activeTab === "modif" && (
        <div className="bg-[#111] px-4 py-4 space-y-5">

          <Slider
            label="Exposition"
            value={values.exposure}
            onChange={(v) => updateValue("exposure", v)}
          />

          <Slider
            label="Contraste"
            value={values.contrast}
            onChange={(v) => updateValue("contrast", v)}
          />

          <Slider
            label="Hautes lumières"
            value={values.highlights}
            onChange={(v) => updateValue("highlights", v)}
          />

        </div>
      )}

      {/* BOTTOM MENU EXACT LIGHTROOM STYLE */}
      <div className="bg-[#0c0c0c] border-t border-zinc-800 flex justify-between px-3 py-2 text-xs">
        <BottomItem icon={<Sparkles size={20} />} label="Actions" active={activeTab === "actions"} onClick={() => setActiveTab("actions")} />
        <BottomItem icon={<Wand2 size={20} />} label="Param. prédéf." active={activeTab === "preset"} onClick={() => setActiveTab("preset")} />
        <BottomItem icon={<Crop size={20} />} label="Recadrage" active={activeTab === "crop"} onClick={() => setActiveTab("crop")} />
        <BottomItem icon={<Sliders size={20} />} label="Modif." active={activeTab === "modif"} onClick={() => setActiveTab("modif")} />
        <BottomItem icon={<Settings size={20} />} label="Masquage" active={activeTab === "mask"} onClick={() => setActiveTab("mask")} />
        <BottomItem icon={<Eraser size={20} />} label="Supprimer" active={activeTab === "delete"} onClick={() => setActiveTab("delete")} />
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
      <div className="flex justify-between mb-2 text-sm text-gray-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={-100}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}

function BottomItem({
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