"use client"

import { useEffect, useRef, useState } from "react"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { Upload, SlidersHorizontal, LogOut } from "lucide-react"

export default function Editor() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/")
      } else {
        setUser(currentUser)
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    if (!image) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = image.width
    canvas.height = image.height

    ctx.filter = `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
    `

    ctx.drawImage(image, 0, 0)
  }, [image, brightness, contrast, saturation])

  const handleUpload = (e: any) => {
    const file = e.target.files[0]
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
    <div className="flex flex-col h-screen bg-[#121212] text-white">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-4 py-3 bg-[#1a1a1a] border-b border-neutral-800">
        <h1 className="font-semibold">PixTone Pro</h1>
        <div className="flex items-center gap-3">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt="profil"
              className="w-9 h-9 rounded-full"
            />
          )}
          <button onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* CANVAS */}
      <div className="flex-1 flex items-center justify-center bg-black">
        {!image ? (
          <label className="flex flex-col items-center gap-3 cursor-pointer text-neutral-400">
            <Upload size={30} />
            Importer une image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleUpload}
            />
          </label>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-h-[80%] max-w-[90%] rounded-xl"
          />
        )}
      </div>

      {/* SLIDERS */}
      {image && (
        <div className="bg-[#1a1a1a] p-4 space-y-4 border-t border-neutral-800">
          
          <Slider
            label="Luminosité"
            value={brightness}
            setValue={setBrightness}
          />

          <Slider
            label="Contraste"
            value={contrast}
            setValue={setContrast}
          />

          <Slider
            label="Saturation"
            value={saturation}
            setValue={setSaturation}
          />

        </div>
      )}
    </div>
  )
}

function Slider({ label, value, setValue }: any) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="200"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full accent-white"
      />
    </div>
  )
}