import { useEffect, useState } from 'react'

export function useExternalImage(src: string, width: number) {
  const [heightImg, setHeightImg] = useState(0)

  useEffect(() => {
    const img = new window.Image()
    img.src = src

    img.onload = () => {
      const aspectRatio = img.width / img.height
      const currentHeight = width / aspectRatio

      setHeightImg(currentHeight)
    }

    img.onerror = () => {
      // biome-ignore lint/suspicious/noConsole: Error loading image
      console.error('Error loading image:', src)
      setHeightImg(0)
    }
  }, [src, width])

  return { heightImg }
}
