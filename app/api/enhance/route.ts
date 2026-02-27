import Replicate from "replicate"
import { NextResponse } from "next/server"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    console.log("IMAGE RECEIVED:", image?.substring(0, 50))

    const output = await replicate.run(
      "stability-ai/stable-diffusion-img2img",
      {
        input: {
          image: image,
          prompt: "Enhance photo quality, improve lighting, increase sharpness",
          strength: 0.3
        }
      }
    )

    console.log("REPLICATE OUTPUT:", output)

    return NextResponse.json({ output })

  } catch (error: any) {
    console.error("FULL ERROR:", error)
    return NextResponse.json(
      { error: error.message || "Enhancement failed" },
      { status: 500 }
    )
  }
}