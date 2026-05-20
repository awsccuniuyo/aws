import Hero from '@/components/sections/Hero'
import WhatWeDo from '@/components/sections/WhatWeDo'
import EventsSection from '@/components/sections/EventsSection'
import { CommunitySection, PartnersSection, CTASection } from '@/components/sections/LandingSections'
import { getEvents } from '@/lib/api'
import type { Event } from '@/lib/types'

async function fetchEvents(): Promise<Event[]> {
  try {
    return await getEvents(true)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const events = await fetchEvents()

  return (
    <>
      <Hero />
      <WhatWeDo />
      <EventsSection events={events} />
      <CommunitySection />
      <PartnersSection />
      <CTASection />
    </>
  )
}
