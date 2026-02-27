import Replicate from "replicate"
import { NextResponse } from "next/server"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(req: Request) {
  const { image } = await req.json()

  const output = await replicate.run(
    "nightmareai/real-esrgan",
    {
      input: { image }
    }
  )

  return NextResponse.json({ output })
}