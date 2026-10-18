/**
 * SAMPLE content for populating the NFPC website during development. Run with
 * `npm run seed-nfpc`. Remove it with `npm run seed-nfpc:remove`.
 *
 * Every record is unmistakably sample content:
 *  - titles, names, and roles start with "[SAMPLE]"
 *  - slugs start with "sample-"
 *  - media and links use example.com, or clearly labeled placeholder images
 *  - no official NFPC contact details, addresses, social accounts, or service
 *    times are written. Sample service times are labeled as sample.
 *
 * Gallery: only two genuine NFPC photographs exist in the project. They are
 * created by the base seed (`npm run seed`) and are NOT labeled sample, so
 * --remove never touches them. Two more gallery records use labeled placeholder
 * images in frontend/public/photos/sample/. No fake NFPC photographs are created.
 *
 * Safety (same guards as seed-demo):
 *  - Refuses NODE_ENV=production.
 *  - Refuses a non-local MONGODB_URI unless --allow-remote is passed.
 *  - Upserts by stable sample slug or name, so reruns never create duplicates.
 *  - Never overwrites a non-sample record; matching is limited to sample keys.
 *  - --remove deletes only records that carry the sample marker.
 */
import mongoose from 'mongoose'
import { connectDb, disconnectDb } from '../config/db.js'
import { env } from '../config/env.js'
import { AnnouncementModel } from '../models/Announcement.js'
import { BranchModel } from '../models/Branch.js'
import { EventModel } from '../models/Event.js'
import { GalleryItemModel } from '../models/GalleryItem.js'
import { LeadershipMemberModel } from '../models/LeadershipMember.js'
import { MinistryModel } from '../models/Ministry.js'
import { SermonModel } from '../models/Sermon.js'
import { ServiceSessionModel } from '../models/ServiceSession.js'

const SAMPLE = '[SAMPLE]'
const DAY = 24 * 60 * 60 * 1000
const args = new Set(process.argv.slice(2))
const REMOVE = args.has('--remove')
const ALLOW_REMOTE = args.has('--allow-remote')

function fail(message: string): never {
  console.error(`[seed-nfpc] ${message}`)
  process.exit(1)
}

if (env.NODE_ENV === 'production') {
  fail('Refusing to run sample content with NODE_ENV=production.')
}

const isLocal = /\/\/(?:[^@/]*@)?(localhost|127\.0\.0\.1|\[::1\])(?::|\/|$)/.test(env.MONGODB_URI)
if (!isLocal && !ALLOW_REMOTE) {
  fail('MONGODB_URI does not point to localhost. Sample content is for development databases only. Re-run with --allow-remote if this is the intended development database.')
}

const sermons = [
  {
    slug: 'sample-walking-in-faith',
    title: `${SAMPLE} Walking in Faith`,
    speaker: 'Sample Speaker One',
    date: new Date('2026-09-06'),
    category: 'Faith Series',
    description: 'A sample message on taking the next step of trust even when the path ahead is not yet clear.',
    videoUrl: 'https://example.com/sample/walking-in-faith',
  },
  {
    slug: 'sample-the-freedom-of-grace',
    title: `${SAMPLE} The Freedom of Grace`,
    speaker: 'Sample Speaker Two',
    date: new Date('2026-09-13'),
    category: 'Spiritual Growth',
    description: 'A sample message on how grace releases us from striving and invites us into rest.',
    audioUrl: 'https://example.com/sample/freedom-of-grace.mp3',
  },
  {
    slug: 'sample-serving-with-joy',
    title: `${SAMPLE} Serving with Joy`,
    speaker: 'Sample Speaker One',
    date: new Date('2026-09-20'),
    category: 'Christian Living',
    description: 'A sample message on serving neighbours and family with a glad and generous heart.',
    videoUrl: 'https://example.com/sample/serving-with-joy',
    audioUrl: 'https://example.com/sample/serving-with-joy.mp3',
  },
  {
    slug: 'sample-leading-with-humility',
    title: `${SAMPLE} Leading with Humility`,
    speaker: 'Sample Speaker Three',
    date: new Date('2026-09-27'),
    category: 'Leadership Series',
    description: 'A sample message on leadership that begins with humility and a willingness to be taught.',
    videoUrl: 'https://example.com/sample/leading-with-humility',
  },
]

// Event dates are relative to now, so the upcoming and past split always looks populated.
const events = [
  {
    slug: 'sample-sunday-worship',
    title: `${SAMPLE} Sunday Worship`,
    description: 'Sample event for layout testing. Congregational worship, prayer, and the teaching of the Word.',
    date: new Date(Date.now() + 3 * DAY),
    startTime: '09:00',
    endTime: '11:30',
    category: 'Services',
    location: `${SAMPLE} Main Sanctuary`,
  },
  {
    slug: 'sample-community-bible-study',
    title: `${SAMPLE} Community Bible Study`,
    description: 'Sample event for layout testing. An evening of study, questions, and fellowship.',
    date: new Date(Date.now() + 6 * DAY),
    startTime: '18:00',
    endTime: '19:30',
    category: 'Bible Studies',
    location: `${SAMPLE} Fellowship Hall`,
    rsvpUrl: 'https://example.com/sample/rsvp-bible-study',
  },
  {
    slug: 'sample-youth-night',
    title: `${SAMPLE} Youth Night`,
    description: 'Sample event for layout testing. Music, games, and a short message for young people.',
    date: new Date(Date.now() + 12 * DAY),
    startTime: '17:30',
    category: 'Youth Events',
    location: `${SAMPLE} Fellowship Hall`,
    rsvpUrl: 'https://example.com/sample/rsvp-youth-night',
  },
  {
    slug: 'sample-community-outreach',
    title: `${SAMPLE} Community Outreach Day`,
    description: 'Sample past event for layout testing. Volunteers served neighbours with food and practical help.',
    date: new Date(Date.now() - 14 * DAY),
    category: 'Other',
    location: `${SAMPLE} Community Centre`,
  },
]

const announcements = [
  {
    slug: 'sample-prayer-line-open',
    title: `${SAMPLE} Prayer requests welcome`,
    content: 'Sample announcement for layout testing. Prayer requests can be sent through the contact page.',
    publishedAt: new Date('2026-09-28'),
  },
  {
    slug: 'sample-youth-camp-registration',
    title: `${SAMPLE} Youth camp registration`,
    content: 'Sample announcement for layout testing. Registration for the youth camp is open to all young people in the congregation.',
    publishedAt: new Date('2026-09-18'),
  },
  {
    slug: 'sample-volunteers-needed',
    title: `${SAMPLE} Volunteers needed`,
    content: 'Sample announcement for layout testing. The welcome team is looking for volunteers to greet visitors on Sunday mornings.',
    publishedAt: new Date('2026-09-08'),
  },
  {
    slug: 'sample-archived-notice',
    title: `${SAMPLE} Archived notice`,
    content: 'Sample archived announcement. Archived items are hidden from the website and kept in the CMS.',
    publishedAt: new Date('2026-06-01'),
    isArchived: true,
  },
]

const ministries = [
  {
    slug: 'sample-youth-ministry',
    name: `${SAMPLE} Youth Ministry`,
    shortDescription: 'Sample short description for layout testing.',
    description: 'Sample full description for layout testing. Replace with the real ministry description from church leadership.',
    meetingInfo: `${SAMPLE} Sample meeting details`,
    displayOrder: 1,
  },
  {
    slug: 'sample-womens-ministry',
    name: `${SAMPLE} Women's Ministry`,
    shortDescription: 'Sample short description for layout testing.',
    description: 'Sample full description for layout testing. Replace with the real ministry description from church leadership.',
    displayOrder: 2,
  },
  {
    slug: 'sample-mens-ministry',
    name: `${SAMPLE} Men's Ministry`,
    shortDescription: 'Sample short description for layout testing.',
    description: 'Sample full description for layout testing. Replace with the real ministry description from church leadership.',
    displayOrder: 3,
  },
  {
    slug: 'sample-childrens-ministry',
    name: `${SAMPLE} Children's Ministry`,
    shortDescription: 'Sample short description for layout testing.',
    description: 'Sample full description for layout testing. Replace with the real ministry description from church leadership.',
    displayOrder: 4,
  },
]

const leadership = [
  { name: `${SAMPLE} Leader One`, role: `${SAMPLE} Sample role`, bio: `${SAMPLE} Sample biography. No real person is described here.`, displayOrder: 1 },
  { name: `${SAMPLE} Leader Two`, role: `${SAMPLE} Sample role`, bio: `${SAMPLE} Sample biography. No real person is described here.`, displayOrder: 2 },
  { name: `${SAMPLE} Leader Three`, role: `${SAMPLE} Sample role`, bio: `${SAMPLE} Sample biography. No real person is described here.`, displayOrder: 3 },
  { name: `${SAMPLE} Leader Four`, role: `${SAMPLE} Sample role`, bio: `${SAMPLE} Sample biography. No real person is described here.`, displayOrder: 4 },
]

// Schedule times are invented for layout testing. They are labeled sample and are not NFPC service times.
const serviceSessions = [
  {
    slug: 'sample-sample-sunday-service',
    name: `${SAMPLE} Sample Sunday Service`,
    dayOfWeek: 'Sunday',
    startTime: '09:00',
    endTime: '11:00',
    platform: 'in-person' as const,
    locationName: `${SAMPLE} Main Sanctuary`,
    description: 'Sample schedule for layout testing. Not an official NFPC service time.',
    displayOrder: 1,
  },
  {
    slug: 'sample-sample-bible-study',
    name: `${SAMPLE} Sample Bible Study`,
    dayOfWeek: 'Tuesday',
    startTime: '18:00',
    endTime: '19:30',
    platform: 'hybrid' as const,
    locationName: `${SAMPLE} Fellowship Hall`,
    meetingUrl: 'https://example.com/sample/bible-study',
    description: 'Sample schedule for layout testing. Not an official NFPC service time.',
    displayOrder: 2,
  },
  {
    slug: 'sample-sample-prayer-meeting',
    name: `${SAMPLE} Sample Prayer Meeting`,
    dayOfWeek: 'Thursday',
    startTime: '17:30',
    endTime: '18:30',
    platform: 'online' as const,
    meetingUrl: 'https://example.com/sample/prayer-meeting',
    description: 'Sample schedule for layout testing. Not an official NFPC service time.',
    displayOrder: 3,
  },
  {
    slug: 'sample-sample-youth-gathering',
    name: `${SAMPLE} Sample Youth Gathering`,
    dayOfWeek: 'Saturday',
    startTime: '16:00',
    endTime: '18:00',
    platform: 'in-person' as const,
    locationName: `${SAMPLE} Fellowship Hall`,
    description: 'Sample schedule for layout testing. Not an official NFPC service time.',
    displayOrder: 4,
  },
]

const branches = [
  {
    slug: 'sample-branch-replace-this',
    name: `${SAMPLE} Branch — Replace This`,
    description: 'Sample branch for layout testing. Replace this description, or remove the record, with real branch information from church leadership.',
    address: `${SAMPLE} Sample Street, Sample Town`,
    phone: '+000 000 0000 (sample)',
    history: `${SAMPLE} Sample text describing how this branch started. Replace with confirmed history, or leave blank.`,
    serviceTimes: `${SAMPLE} Sundays, 9:00 AM (sample schedule — not an official time)`,
    leadershipInfo: `${SAMPLE} Led by a sample leader`,
    displayOrder: 1,
  },
  {
    slug: 'sample-second-branch',
    name: `${SAMPLE} Second Branch — Replace This`,
    description: 'Another sample branch, with fewer fields filled in, to test how the page looks when optional details are missing.',
    displayOrder: 2,
  },
]

// Two genuine NFPC photographs are created by the base seed and are not labeled sample.
// These two are labeled placeholders for layout testing only.
const galleryPlaceholders = [
  {
    title: `${SAMPLE} Placeholder photo one`,
    imageUrl: '/photos/sample/gallery-sample-1.svg',
    altText: 'Sample placeholder image. Not a photograph of NFPC.',
    caption: `${SAMPLE} Replace with NFPC photography`,
    category: 'Sunday Worship',
    displayOrder: 10,
  },
  {
    title: `${SAMPLE} Placeholder photo two`,
    imageUrl: '/photos/sample/gallery-sample-2.svg',
    altText: 'Sample placeholder image. Not a photograph of NFPC.',
    caption: `${SAMPLE} Replace with NFPC photography`,
    category: 'Community Outreach',
    displayOrder: 11,
  },
]

async function upsertAll() {
  for (const s of sermons) {
    await SermonModel.findOneAndUpdate({ slug: s.slug }, { ...s, isPublished: true }, { upsert: true, setDefaultsOnInsert: true })
  }
  for (const e of events) {
    await EventModel.findOneAndUpdate({ slug: e.slug }, { ...e, isPublished: true }, { upsert: true, setDefaultsOnInsert: true })
  }
  for (const a of announcements) {
    await AnnouncementModel.findOneAndUpdate(
      { slug: a.slug },
      { isArchived: false, ...a, isPublished: true },
      { upsert: true, setDefaultsOnInsert: true },
    )
  }
  for (const m of ministries) {
    await MinistryModel.findOneAndUpdate({ slug: m.slug }, { ...m, isPublished: true }, { upsert: true, setDefaultsOnInsert: true })
  }
  for (const l of leadership) {
    await LeadershipMemberModel.findOneAndUpdate({ name: l.name }, { ...l, isPublished: true }, { upsert: true, setDefaultsOnInsert: true })
  }
  for (const s of serviceSessions) {
    await ServiceSessionModel.findOneAndUpdate({ slug: s.slug }, { ...s, isPublished: true }, { upsert: true, setDefaultsOnInsert: true })
  }
  for (const g of galleryPlaceholders) {
    await GalleryItemModel.findOneAndUpdate({ imageUrl: g.imageUrl }, { ...g, isPublished: true }, { upsert: true, setDefaultsOnInsert: true })
  }
  for (const b of branches) {
    await BranchModel.findOneAndUpdate({ slug: b.slug }, { ...b, isPublished: true }, { upsert: true, setDefaultsOnInsert: true })
  }
}

async function removeSample() {
  const results = await Promise.all([
    SermonModel.deleteMany({ slug: /^sample-/ }),
    EventModel.deleteMany({ slug: /^sample-/ }),
    AnnouncementModel.deleteMany({ slug: /^sample-/ }),
    MinistryModel.deleteMany({ slug: /^sample-/ }),
    LeadershipMemberModel.deleteMany({ name: { $regex: /^\[SAMPLE\]/ } }),
    ServiceSessionModel.deleteMany({ slug: /^sample-/ }),
    GalleryItemModel.deleteMany({ title: { $regex: /^\[SAMPLE\]/ } }),
    BranchModel.deleteMany({ slug: /^sample-/ }),
  ])
  const labels = ['sermons', 'events', 'announcements', 'ministries', 'leadership', 'service sessions', 'gallery placeholders', 'branches']
  results.forEach((r, i) => console.log(`[seed-nfpc] removed ${r.deletedCount} ${labels[i]}`))
}

async function main() {
  await connectDb()
  console.log(`[seed-nfpc] database: ${mongoose.connection.name} (${REMOVE ? 'remove sample records' : 'upsert sample records'})`)
  if (REMOVE) {
    await removeSample()
  } else {
    await upsertAll()
    console.log(
      `[seed-nfpc] ensured: ${sermons.length} sermons, ${events.length} events, ${announcements.length} announcements, ` +
        `${ministries.length} ministries, ${leadership.length} leadership, ${serviceSessions.length} service sessions, ` +
        `${galleryPlaceholders.length} gallery placeholders, ${branches.length} branches`,
    )
  }
  await disconnectDb()
  console.log('[seed-nfpc] done')
}

main().catch((err) => {
  console.error('[seed-nfpc] failed:', err)
  process.exit(1)
})
