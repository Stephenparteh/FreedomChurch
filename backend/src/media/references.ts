import type { Model } from 'mongoose'
import { AnnouncementModel } from '../models/Announcement.js'
import { EventModel } from '../models/Event.js'
import { GalleryItemModel } from '../models/GalleryItem.js'
import { LeadershipMemberModel } from '../models/LeadershipMember.js'
import { MinistryModel } from '../models/Ministry.js'
import { ServiceUnitModel } from '../models/ServiceUnit.js'
import { SermonModel } from '../models/Sermon.js'
import { SiteSettingModel } from '../models/SiteSetting.js'
import { deleteImage, UPLOAD_NAME_PATTERN } from './storage.js'

/** Every document field that can point at an uploaded file. Keep in sync when a model gains a media field. */
const MEDIA_FIELDS: Array<[Model<any>, string]> = [
  [SermonModel, 'thumbnail'],
  [EventModel, 'image'],
  [GalleryItemModel, 'imageUrl'],
  [MinistryModel, 'image'],
  [AnnouncementModel, 'image'],
  [LeadershipMemberModel, 'image'],
  [ServiceUnitModel, 'image'],
  [SiteSettingModel, 'logoUrl'],
]

/** Returns the stored file name for an `/uploads/...` reference, or null for anything else (external URLs, seeded /photos paths). */
export function uploadNameFromReference(value: unknown): string | null {
  if (typeof value !== 'string' || !value.startsWith('/uploads/')) return null
  const name = value.slice('/uploads/'.length)
  return UPLOAD_NAME_PATTERN.test(name) ? name : null
}

export async function isUploadReferenced(value: string): Promise<boolean> {
  for (const [model, field] of MEDIA_FIELDS) {
    if (await model.exists({ [field]: value })) return true
  }
  return false
}

/**
 * Deletes the stored file behind a reference, but only when no other record
 * still uses it. A file shared by two records survives until both let go.
 */
export async function releaseUploadIfUnreferenced(value: unknown): Promise<void> {
  const name = uploadNameFromReference(value)
  if (!name || typeof value !== 'string') return
  if (await isUploadReferenced(value)) return
  await deleteImage(name)
}
