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
      version: "42fed1c497db8a3b2f9b1d0c7f1b5b3e3d18f0b9d6e2a444ef98a32956543d4b",
      input: {
        image: image,
        scale: 2
      }
    })

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