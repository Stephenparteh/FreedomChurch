import congregationServiceThumb from '@/assets/photos/congregation-service-thumb.webp'
import congregationService from '@/assets/photos/congregation-service.webp'
import congregationWorshipThumb from '@/assets/photos/congregation-worship-thumb.webp'
import congregationWorship from '@/assets/photos/congregation-worship.webp'
import type { GalleryItem } from '@/types/content'

/**
 * Unlike src/data/placeholders.ts, these two entries are REAL NFPC
 * photography (recovered from legacy/images/, optimized to .webp — see
 * docs/MIGRATION_NOTES.md). Everything else the legacy site shipped as
 * gallery-worthy imagery was either generic stock photography of unclear
 * license or, in church.jpg's case, a photo of a building that isn't NFPC's
 * — see docs/LEGACY_AUDIT.md. This is genuinely all the verified gallery
 * content that exists until admins can upload more (Milestone 4).
 */
export const galleryPhotos: (GalleryItem & { fullUrl: string })[] = [
  {
    id: 'congregation-worship',
    imageUrl: congregationWorshipThumb,
    fullUrl: congregationWorship,
    caption: 'Congregation gathered in worship',
    category: 'Sunday Worship',
  },
  {
    id: 'congregation-service',
    imageUrl: congregationServiceThumb,
    fullUrl: congregationService,
    caption: 'A service in session',
    category: 'Sunday Worship',
  },
]
