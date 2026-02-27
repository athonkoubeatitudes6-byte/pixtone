"use client"

import Cropper from "react-easy-crop"
import { useState, useCallback } from "react"

type CropArea = {
  x: number
  y: number
  width: number
  height: number
}

type ImageCropperProps = {
  image: string
  onCropComplete: (croppedArea: CropArea) => void
}

export default function ImageCropper({
  image,
  onCropComplete,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const handleCropComplete = useCallback(
    (_: any, croppedAreaPixels: CropArea) => {
      onCropComplete(croppedAreaPixels)
    },
    [onCropComplete]
  )

  return (
    <div className="relative w-full h-full bg-black">

      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}

        /* 🔥 IMPORTANT : recadrage libre */
        aspect={undefined}

        cropShape="rect"
        showGrid={true}

        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />

      {/* 🔎 Slider Zoom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full"
        />
      </div>

    </div>
  )
}