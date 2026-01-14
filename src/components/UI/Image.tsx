import { useEffect, useState } from 'react'

import s from './Image.module.css'

type LocalImage = { src: string; width: number; height: number }

type ImageProps = {
  src: LocalImage | string
  alt: string
  priority?: boolean
  width: number
  grow?: boolean
}

export function Image({ src, alt, priority, width, grow }: ImageProps) {
  if (typeof src === 'string') {
    return <ExternalImage alt={alt} grow={grow} priority={priority} src={src} width={width} />
  }

  const aspectRatio = src.width / src.height
  const currentHeight = width / aspectRatio
  const styleResize = grow ? { width: '100%', height: '100%' } : { width, height: currentHeight }

  return (
    <div className={s.imageWrapper} style={{ ...styleResize }}>
      <img
        alt={alt}
        className={s.image}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        height={currentHeight}
        loading={priority ? 'eager' : 'lazy'}
        src={src.src}
        style={grow ? { width: '100%', height: '100%' } : { maxHeight: currentHeight, maxWidth: width }}
        width={width}
      />
    </div>
  )
}

type ExternalImageProps = {
  src: string
  alt: string
  priority?: boolean
  width: number
  grow?: boolean
}

export function ExternalImage({ src, alt, priority, width, grow }: ExternalImageProps) {
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
      // biome-ignore lint/suspicious/noConsole: Error loading external image
      console.error('Error loading image:', src)
      setHeightImg(0)
    }
  }, [src, width])

  const styleResize = grow ? { width: '100%', height: '100%' } : { width, height: heightImg }

  return (
    <div className={s.imageWrapper} style={{ ...styleResize }}>
      {heightImg > 0 ? (
        <img
          alt={alt}
          className={s.image}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          height={heightImg}
          loading={priority ? 'eager' : 'lazy'}
          src={src}
          style={grow ? { width: '100%', height: '100%' } : { maxHeight: heightImg, maxWidth: width }}
          width={width}
        />
      ) : null}
    </div>
  )
}
