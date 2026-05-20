export type Gender = 'Male' | 'Female' | 'Prefer not to say'

export type ReferredBy =
  | 'Friend / Colleague'
  | 'Social Media'
  | 'Flyer / Poster'
  | 'Lecturer'
  | 'Other'

export interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  banner_url: string | null
  is_active: boolean
  registration_open: boolean
  max_attendees: number | null
  created_at: string
  registration_count: number
}

export interface Registration {
  id: string
  event_id: string
  full_name: string
  email: string
  gender: Gender
  university: string | null
  department: string | null
  referred_by: ReferredBy | null
  referred_by_detail: string | null
  is_community_member: boolean
  follows_x: boolean
  follows_instagram: boolean
  qr_token: string
  checked_in: boolean
  checked_in_at: string | null
  created_at: string
}

export interface RegistrationCreate {
  event_id: string
  full_name: string
  email: string
  gender: Gender
  university?: string
  department?: string
  referred_by?: ReferredBy
  referred_by_detail?: string
  is_community_member: boolean
  follows_x: boolean
  follows_instagram: boolean
}

export interface RegistrationPublic {
  id: string
  full_name: string
  email: string
  event_id: string
  qr_token: string
  created_at: string
}

export interface EventStats {
  total_registrations: number
  checked_in: number
  not_checked_in: number
  community_members: number
  non_community_members: number
  gender_breakdown: Record<string, number>
  referral_breakdown: Record<string, number>
}

export interface CheckInResponse {
  success: boolean
  message: string
  registration?: Registration
}

export interface Announcement {
  id: string
  title: string
  body: string
  tag: string
  link: string | null
  link_label: string | null
  is_published: boolean
  created_at: string
}

// Team member (static data)
export interface TeamMember {
  name: string
  role: string
  bio: string
  photo: string
  socials: { x?: string; linkedin?: string; instagram?: string }
}

// Partner (static data)
export interface Partner {
  name: string
  description: string
  logo: string
  website?: string
  category: 'core' | 'community' | 'media'
}
 
