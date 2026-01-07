import { useExternalImage } from './useExternalImage'

import s from './ExternalImage.module.css'

type ExternalImageProps = {
  src: string
  alt: string
  priority?: boolean
  width: number
  grow?: boolean
}

export function ExternalImage({ src, alt, priority, width, grow }: ExternalImageProps) {
  const { heightImg } = useExternalImage(src, width)
  const styleResize = grow ? { width: '100%', height: '100%' } : { width, height: heightImg }

  return (
    <div style={{ position: 'relative', ...styleResize }}>
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
