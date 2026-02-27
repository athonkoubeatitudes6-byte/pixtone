import Replicate from "replicate"
import { NextResponse } from "next/server"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const output = await replicate.run(
      "fofr/real-esrgan",
      {
        input: {
          image: image,
          scale: 2
        }
      }
    )

    return NextResponse.json({ output })

  } catch (error: any) {
    console.error("FULL ERROR:", error)
    return NextResponse.json(
      { error: error.message || "Enhancement failed" },
      { status: 500 }
    )
  }
}