type CropArea = {
  x: number
  y: number
  width: number
  height: number
}

export default function getCroppedImg(
  imageSrc: string,
  crop: CropArea
): Promise<string> {
  const canvas = document.createElement("canvas")
  const image = new Image()
  image.src = imageSrc

  return new Promise((resolve) => {
    image.onload = () => {
      canvas.width = crop.width
      canvas.height = crop.height

      const ctx = canvas.getContext("2d")

      if (!ctx) return

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      )

      resolve(canvas.toDataURL("image/jpeg"))
    }
  })
}