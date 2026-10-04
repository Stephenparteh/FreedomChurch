/**
 * Optional local-development convenience script. Run with `npm run seed`.
 *
 * Seeds:
 *  1. The SiteSetting singleton with the two VERIFIED real values (church
 *     name + motto — confirmed in Milestone 2 from the church's own logo).
 *  2. The three VERIFIED real ministry names from the legacy site
 *     (Worship, Children's, Outreach — see docs/LEGACY_AUDIT.md), with
 *     placeholder descriptions clearly marked as such, matching the same
 *     convention the Milestone 2 frontend already used.
 *  3. The two VERIFIED real congregation photos (see docs/LEGACY_AUDIT.md)
 *     as published GalleryItem records, at their stable frontend/public/
 *     URLs.
 *  4. A small number of `[DEV]`-prefixed sample Sermon/Event/Announcement/
 *     LeadershipMember/ServiceUnit records, ONLY so pagination and list
 *     rendering can be exercised locally. These are not real church
 *     content and must never be confused for it — see section 35 of the
 *     Milestone 3 brief.
 *
 * Does NOT run automatically on server startup. Safe to run repeatedly
 * (upserts by slug/key).
 */
import { connectDb, disconnectDb } from '../config/db.js'
import { AnnouncementModel } from '../models/Announcement.js'
import { EventModel } from '../models/Event.js'
import { GalleryItemModel } from '../models/GalleryItem.js'
import { LeadershipMemberModel } from '../models/LeadershipMember.js'
import { MinistryModel } from '../models/Ministry.js'
import { ServiceUnitModel } from '../models/ServiceUnit.js'
import { SermonModel } from '../models/Sermon.js'
import { getOrCreateSiteSettings } from '../models/SiteSetting.js'

async function seed() {
  await connectDb()

  await getOrCreateSiteSettings()
  console.log('[seed] site settings ensured')

  const ministries = [
    {
      slug: 'worship',
      name: 'Worship Ministry',
      shortDescription: 'TODO_CONFIRM_SHORT_DESCRIPTION',
      description:
        'TODO_CONFIRM_DESCRIPTION — open to musicians, vocalists, and sound/media volunteers. Replace with real ministry details from church leadership.',
      displayOrder: 1,
      isPublished: true,
    },
    {
      slug: 'childrens',
      name: "Children's Ministry",
      shortDescription: 'TODO_CONFIRM_SHORT_DESCRIPTION',
      description:
        'TODO_CONFIRM_DESCRIPTION — teaching, activities, and care for children during services. Replace with real ministry details from church leadership.',
      displayOrder: 2,
      isPublished: true,
    },
    {
      slug: 'outreach',
      name: 'Outreach Ministry',
      shortDescription: 'TODO_CONFIRM_SHORT_DESCRIPTION',
      description:
        'TODO_CONFIRM_DESCRIPTION — community service, food drives, and support initiatives. Replace with real ministry details from church leadership.',
      displayOrder: 3,
      isPublished: true,
    },
  ]
  for (const ministry of ministries) {
    await MinistryModel.findOneAndUpdate({ slug: ministry.slug }, ministry, {
      upsert: true,
      setDefaultsOnInsert: true,
    })
  }
  console.log(`[seed] ${ministries.length} verified ministry names ensured`)

  const sermon = await SermonModel.findOneAndUpdate(
    { slug: 'dev-sample-sermon' },
    {
      slug: 'dev-sample-sermon',
      title: '[DEV] Sample Sermon',
      speaker: 'Development Test Data',
      description: 'Development-only sample record for exercising the API locally. Not real content.',
      date: new Date(),
      category: 'Faith Series',
      isPublished: true,
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  )

  const event = await EventModel.findOneAndUpdate(
    { slug: 'dev-sample-event' },
    {
      slug: 'dev-sample-event',
      title: '[DEV] Sample Event',
      description: 'Development-only sample record for exercising the API locally. Not real content.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isPublished: true,
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  )

  const announcement = await AnnouncementModel.findOneAndUpdate(
    { slug: 'dev-sample-announcement' },
    {
      slug: 'dev-sample-announcement',
      title: '[DEV] Sample Announcement',
      content: 'Development-only sample record for exercising the API locally. Not real content.',
      publishedAt: new Date(),
      isPublished: true,
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  )

  // These two ARE real, verified NFPC photography (see docs/LEGACY_AUDIT.md
  // and docs/MIGRATION_NOTES.md) — not dev/test placeholders — so they're
  // seeded as genuine published content, at their stable frontend/public/
  // URLs (see docs/ARCHITECTURE.md for why gallery images live there rather
  // than as bundled Vite assets).
  const galleryPhotos = [
    {
      imageUrl: '/photos/congregation-worship.webp',
      altText: 'The NFPC congregation gathered in worship',
      caption: 'Congregation gathered in worship',
      category: 'Sunday Worship',
      isPublished: true,
    },
    {
      imageUrl: '/photos/congregation-service.webp',
      altText: 'A service in session at NFPC',
      caption: 'A service in session',
      category: 'Sunday Worship',
      isPublished: true,
    },
  ]
  for (const photo of galleryPhotos) {
    await GalleryItemModel.findOneAndUpdate({ imageUrl: photo.imageUrl }, photo, {
      upsert: true,
      setDefaultsOnInsert: true,
    })
  }

  const leader = await LeadershipMemberModel.findOneAndUpdate(
    { name: '[DEV] Sample Leader' },
    {
      name: '[DEV] Sample Leader',
      role: 'Development Test Data',
      isPublished: true,
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  )

  const worship = await MinistryModel.findOne({ slug: 'worship' })
  const serviceUnit = await ServiceUnitModel.findOneAndUpdate(
    { slug: 'dev-sample-unit' },
    {
      slug: 'dev-sample-unit',
      name: '[DEV] Sample Service Unit',
      description: 'Development-only sample record for exercising the API locally. Not real content.',
      ministry: worship?._id,
      isPublished: true,
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  )

  console.log('[seed] records ensured:', {
    sermon: sermon?.slug,
    event: event?.slug,
    announcement: announcement?.slug,
    galleryPhotos: galleryPhotos.length,
    leader: leader?.id,
    serviceUnit: serviceUnit?.slug,
  })

  await disconnectDb()
  console.log('[seed] done')
}

seed().catch((err) => {
  console.error('[seed] failed:', err)
  process.exit(1)
})
