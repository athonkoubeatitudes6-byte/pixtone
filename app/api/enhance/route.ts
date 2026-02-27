import Replicate from "replicate"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json({ error: "No image" }, { status: 400 })
    }

    // Extraire base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "")
    const buffer = Buffer.from(base64Data, "base64")

    // Sauvegarder temporairement
    const filePath = path.join("/tmp", `upload-${Date.now()}.png`)
    fs.writeFileSync(filePath, buffer)

    const output = await replicate.run(
      "nightmareai/real-esrgan",
      {
        input: {
          image: fs.createReadStream(filePath),
        },
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