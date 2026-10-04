import { AnnouncementModel } from '../models/Announcement.js'
import { EventModel } from '../models/Event.js'
import { GalleryItemModel } from '../models/GalleryItem.js'
import { LeadershipMemberModel } from '../models/LeadershipMember.js'
import { MinistryModel } from '../models/Ministry.js'
import { SermonModel } from '../models/Sermon.js'
import { ServiceSessionModel } from '../models/ServiceSession.js'
import {
  announcementInput,
  eventInput,
  galleryInput,
  leadershipInput,
  ministryInput,
  sermonInput,
  serviceSessionInput,
} from './schemas.js'
import type { ResourceSpec } from './crud.js'

export const resourceSpecs = {
  sermons: {
    model: SermonModel,
    create: sermonInput,
    defaults: { isPublished: false },
    sort: { date: -1 },
    slugFrom: 'title',
    notFoundMessage: 'Sermon not found.',
  },
  events: {
    model: EventModel,
    create: eventInput,
    defaults: { isPublished: false },
    sort: { date: -1 },
    slugFrom: 'title',
    notFoundMessage: 'Event not found.',
  },
  gallery: {
    model: GalleryItemModel,
    create: galleryInput,
    defaults: { isPublished: false, displayOrder: 0 },
    sort: { displayOrder: 1, createdAt: -1 },
    notFoundMessage: 'Gallery item not found.',
  },
  ministries: {
    model: MinistryModel,
    create: ministryInput,
    defaults: { isPublished: false, displayOrder: 0 },
    sort: { displayOrder: 1, name: 1 },
    slugFrom: 'name',
    notFoundMessage: 'Ministry not found.',
  },
  serviceSessions: {
    model: ServiceSessionModel,
    create: serviceSessionInput,
    defaults: { isPublished: false, displayOrder: 0, platform: 'in-person' },
    sort: { displayOrder: 1, name: 1 },
    slugFrom: 'name',
    notFoundMessage: 'Service session not found.',
  },
  announcements: {
    model: AnnouncementModel,
    create: announcementInput,
    defaults: { isPublished: false, isArchived: false, publishedAt: new Date() },
    sort: { publishedAt: -1 },
    slugFrom: 'title',
    notFoundMessage: 'Announcement not found.',
  },
  leadership: {
    model: LeadershipMemberModel,
    create: leadershipInput,
    defaults: { isPublished: false, displayOrder: 0 },
    sort: { displayOrder: 1, name: 1 },
    notFoundMessage: 'Team member not found.',
  },
} satisfies Record<string, ResourceSpec>
