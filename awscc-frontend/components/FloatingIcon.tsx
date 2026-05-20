'use client'

import Image from 'next/image'

export default function FloatingIcon({ src, alt, size }: { src: string; alt: string; size: number }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="object-contain p-2"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
    />
  )
}
