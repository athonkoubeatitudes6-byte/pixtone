import Replicate from "replicate"
import { NextResponse } from "next/server"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json({ error: "No image" }, { status: 400 })
    }

    const prediction = await replicate.predictions.create({
      version: "42fed1c4973f0e4e2f4d41b2e7b4a8e6c7e4d1e3c6b5a4d3e2f1c0b9a8d7e6f5", // real-esrgan version
      input: {
        image: image
      }
    })

    // attendre résultat
    let result = prediction
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      result = await replicate.predictions.get(prediction.id)
    }

    if (result.status === "succeeded") {
      return NextResponse.json({ output: result.output })
    }

    return NextResponse.json({ error: "Enhancement failed" }, { status: 500 })

  } catch (error) {
    console.error("API ERROR:", error)
    return NextResponse.json(
      { error: "Enhancement failed" },
      { status: 500 }
    )
  }
}