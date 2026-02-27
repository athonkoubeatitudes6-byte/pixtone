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
    <div className="relative w-full h-96 bg-black">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />
    </div>
  )
}