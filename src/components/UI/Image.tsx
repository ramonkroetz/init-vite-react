import { ExternalImage } from './ExternalImage/ExternalImage'

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
    <div style={{ position: 'relative', ...styleResize }}>
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
