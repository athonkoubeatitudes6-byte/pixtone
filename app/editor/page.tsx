"use client"

import { useEffect, useRef, useState } from "react"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import {
  Upload,
  LogOut,
  Wand2,
  Sliders,
  Crop,
  Sparkles,
  Eraser,
  Settings
} from "lucide-react"

export default function Editor() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  const [mode, setMode] = useState("modif")

  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [temperature, setTemperature] = useState(0)
  const [tint, setTint] = useState(0)
  const [clarity, setClarity] = useState(0)
  const [sharpness, setSharpness] = useState(0)

  // 🔐 Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/")
      else {
        setUser(currentUser)
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  // 🎨 Canvas
  useEffect(() => {
    if (!image) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = image.width
    canvas.height = image.height

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.filter = `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
    `
    ctx.drawImage(image, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      data[i] += temperature
      data[i + 2] -= temperature
      data[i + 1] += tint

      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] += (data[i] - avg) * (clarity / 100)
      data[i + 1] += (data[i + 1] - avg) * (clarity / 100)
      data[i + 2] += (data[i + 2] - avg) * (clarity / 100)
    }

    ctx.putImageData(imageData, 0, 0)
  }, [image, brightness, contrast, saturation, temperature, tint, clarity, sharpness])

  const handleUpload = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.src = reader.result as string
      img.onload = () => setImage(img)
    }
    reader.readAsDataURL(file)
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/")
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Chargement...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">

      {/* TOP */}
      <div className="flex justify-between items-center px-5 py-4 bg-[#1a1a1a] border-b border-neutral-800">
        <h1 className="font-semibold text-lg">PixTone Pro</h1>
        <div className="flex items-center gap-4">
          {user?.photoURL && (
            <img src={user.photoURL} className="w-9 h-9 rounded-full" />
          )}
          <button onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* IMAGE */}
      <div className="flex-1 flex items-center justify-center p-4 pb-28">
        {!image ? (
          <label className="flex flex-col items-center gap-4 cursor-pointer text-neutral-500">
            <Upload size={35} />
            Importer une image
            <input type="file" hidden accept="image/*" onChange={handleUpload} />
          </label>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-h-[80%] max-w-[95%] rounded-xl"
          />
        )}
      </div>

      {/* PANEL */}
      {image && mode === "modif" && (
        <div className="absolute bottom-20 left-0 right-0 bg-[#1a1a1a] border-t border-neutral-800 p-4 space-y-4">
          <Slider label="Luminosité" value={brightness} setValue={setBrightness} />
          <Slider label="Contraste" value={contrast} setValue={setContrast} />
          <Slider label="Saturation" value={saturation} setValue={setSaturation} />
          <Slider label="Température" value={temperature} setValue={setTemperature} min={-100} max={100} />
          <Slider label="Teinte" value={tint} setValue={setTint} min={-100} max={100} />
          <Slider label="Clarté" value={clarity} setValue={setClarity} min={-100} max={100} />
        </div>
      )}

      {/* MENU BAS FIXE */}
      {image && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-neutral-800 py-3 flex justify-around">

          <MenuButton icon={<Wand2 size={20} />} label="Actions" active={mode === "action"} onClick={() => setMode("action")} />
          <MenuButton icon={<Sparkles size={20} />} label="Param. prédéf." active={mode === "preset"} onClick={() => setMode("preset")} />
          <MenuButton icon={<Crop size={20} />} label="Recadrage" active={mode === "crop"} onClick={() => setMode("crop")} />
          <MenuButton icon={<Sliders size={20} />} label="Modif." active={mode === "modif"} onClick={() => setMode("modif")} />
          <MenuButton icon={<Settings size={20} />} label="Masquage" active={mode === "mask"} onClick={() => setMode("mask")} />
          <MenuButton icon={<Eraser size={20} />} label="Supprimer" active={mode === "remove"} onClick={() => setMode("remove")} />

        </div>
      )}
    </div>
  )
}

function Slider({ label, value, setValue, min = 0, max = 200 }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-neutral-400">
        <span>{label}</span>
        <span className="text-white">{Math.round(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-1 bg-neutral-700 rounded-lg accent-white"
      />
    </div>
  )
}

function MenuButton({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 text-xs transition ${
        active ? "text-white" : "text-neutral-500"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}