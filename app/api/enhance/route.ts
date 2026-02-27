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
      "stability-ai/sdxl",
      {
        input: {
          prompt: "Enhance this image, improve quality, lighting, sharpness",
          image: image
        }
      }
    )

    return NextResponse.json({ output })

  } catch (error) {
    console.error("API ERROR:", error)
    return NextResponse.json(
      { error: "Enhancement failed" },
      { status: 500 }
    )
  }
}