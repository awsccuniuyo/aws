'use client'

export default function PartnerLogo({ src, name }: { src: string; name: string }) {
  return (
    <img
      src={src}
      alt={name}
      className="w-10 h-10 object-contain"
      onError={(e) => {
        const el = e.target as HTMLImageElement
        el.style.display = 'none'
        el.parentElement!.innerHTML = `<span class="text-brand-dark font-black text-lg">${name[0]}</span>`
      }}
    />
  )
}
