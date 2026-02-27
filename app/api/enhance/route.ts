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

    const prediction = await replicate.predictions.create({
      model: "stability-ai/stable-diffusion-img2img",
      input: {
        image: image,
        prompt: "Enhance photo quality, improve lighting, increase sharpness, natural colors",
        strength: 0.3
      }
    })

    // attendre que le modèle termine
    const result = await replicate.wait(prediction)

    return NextResponse.json({ output: result.output })

  } catch (error: any) {
    console.error("FULL ERROR:", error)
    return NextResponse.json(
      { error: error.message || "Enhancement failed" },
      { status: 500 }
    )
  }
}