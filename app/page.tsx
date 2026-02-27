"use client"

import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
      router.push("/editor")
    } catch (error) {
      console.error("Erreur de connexion :", error)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <button
        onClick={handleLogin}
        className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
      >
        Se connecter avec Google
      </button>
     </div>
  )
}