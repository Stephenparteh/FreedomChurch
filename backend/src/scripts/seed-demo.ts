/**
 * DEVELOPMENT / DEMO seed data. Run with `npm run seed-demo`.
 * Remove it again with `npm run seed-demo:remove`.
 *
 * Purpose: make the public website and admin CMS look alive while the church's
 * real content is still being gathered. Every record is clearly labeled:
 *  - titles, names, and subjects start with "[DEMO]"
 *  - slugs start with "demo-"
 *  - sample links point to example.com, which is reserved for documentation
 *
 * Safety:
 *  - Refuses to run when NODE_ENV=production.
 *  - Refuses a non-local MONGODB_URI unless --allow-remote is passed.
 *  - Upserts by slug or [DEMO] name, so reruns never create duplicates.
 *  - Never deletes anything, except in --remove mode, which only matches demo records.
 *  - Writes no real church facts: no service times, addresses, phone numbers,
 *    email addresses, or social links. Gallery and thumbnails use only the two
 *    real NFPC congregation photographs, which the base seed also creates.
 */
import { connectDb, disconnectDb } from '../config/db.js'
import { env } from '../config/env.js'
import { AnnouncementModel } from '../models/Announcement.js'
import { ContactSubmissionModel } from '../models/ContactSubmission.js'
import { EventModel } from '../models/Event.js'
import { GalleryItemModel } from '../models/GalleryItem.js'
import { LeadershipMemberModel } from '../models/LeadershipMember.js'
import { MinistryModel } from '../models/Ministry.js'
import { SermonModel } from '../models/Sermon.js'
import mongoose from 'mongoose'

const DEMO = '[DEMO]'
const DAY = 24 * 60 * 60 * 1000
const args = new Set(process.argv.slice(2))
const REMOVE = args.has('--remove')
const ALLOW_REMOTE = args.has('--allow-remote')

function fail(message: string): never {
  console.error(`[seed-demo] ${message}`)
  process.exit(1)
}

if (env.NODE_ENV === 'production') {
  fail('Refusing to run demo seed data with NODE_ENV=production.')
}

const isLocal = /\/\/(?:[^@/]*@)?(localhost|127\.0\.0\.1|\[::1\])(?::|\/|$)/.test(env.MONGODB_URI)
if (!isLocal && !ALLOW_REMOTE) {
  fail(
    'MONGODB_URI does not point to localhost. Demo data is for development databases only. ' +
      'If this is the intended development database, re-run with --allow-remote.',
  )
}

const sermons = [
  {
    slug: 'demo-sermon-freedom-in-grace',
    title: `${DEMO} Walking in the Freedom of Grace`,
    speaker: 'Demo Speaker One',
    date: new Date(Date.now() - 21 * DAY),
    category: 'Faith Series',
    description:
      'Sample summary for layout testing. A message on how grace frees us from the weight of striving and invites us into daily trust.',
    videoUrl: 'https://example.com/demo/sermon-freedom-in-grace',
    audioUrl: 'https://example.com/demo/sermon-freedom-in-grace.mp3',
  },
  {
    slug: 'demo-sermon-faith-in-the-storm',
    title: `${DEMO} Faith That Stands in the Storm`,
    speaker: 'Demo Speaker Two',
    date: new Date(Date.now() - 14 * DAY),
    category: 'Spiritual Growth',
    description: 'Sample summary for layout testing. Practical encouragement for seasons when the way forward is unclear.',
    videoUrl: 'https://example.com/demo/sermon-faith-in-the-storm',
  },
  {
    slug: 'demo-sermon-serving-our-neighbours',
    title: `${DEMO} Serving Our Neighbours`,
    speaker: 'Demo Speaker One',
    date: new Date(Date.now() - 7 * DAY),
    category: 'Christian Living',
    description: 'Sample summary for layout testing. How everyday kindness becomes a witness in the community.',
    audioUrl: 'https://example.com/demo/sermon-serving-our-neighbours.mp3',
  },
  {
    slug: 'demo-sermon-a-heart-set-free',
    title: `${DEMO} A Heart Set Free`,
    speaker: 'Demo Speaker Three',
    date: new Date(Date.now() - 2 * DAY),
    category: 'Leadership Series',
    description: 'Sample summary for layout testing. Leadership that begins with humility and a willingness to be taught.',
    videoUrl: 'https://example.com/demo/sermon-a-heart-set-free',
    audioUrl: 'https://example.com/demo/sermon-a-heart-set-free.mp3',
  },
]

const events = [
  {
    slug: 'demo-event-sunday-worship',
    title: `${DEMO} Sunday Worship Service`,
    description: 'Sample event for layout testing. Congregational worship, prayer, and the teaching of the Word.',
    date: new Date(Date.now() + 3 * DAY),
    startTime: '09:00',
    endTime: '11:30',
    category: 'Services',
    location: `${DEMO} Main Sanctuary`,
  },
  {
    slug: 'demo-event-community-bible-study',
    title: `${DEMO} Community Bible Study`,
    description: 'Sample event for layout testing. An evening of study, questions, and fellowship.',
    date: new Date(Date.now() + 6 * DAY),
    startTime: '18:00',
    endTime: '19:30',
    category: 'Bible Studies',
    location: `${DEMO} Fellowship Hall`,
    rsvpUrl: 'https://example.com/demo/rsvp-bible-study',
  },
  {
    slug: 'demo-event-youth-night',
    title: `${DEMO} Youth Night`,
    description: 'Sample event for layout testing. Music, games, and a short message for young people.',
    date: new Date(Date.now() + 12 * DAY),
    startTime: '17:30',
    category: 'Youth Events',
    location: `${DEMO} Fellowship Hall`,
    rsvpUrl: 'https://example.com/demo/rsvp-youth-night',
  },
  {
    slug: 'demo-event-thanksgiving',
    title: `${DEMO} Thanksgiving Gathering`,
    description: 'Sample event for layout testing. A time to give thanks together as a church family.',
    date: new Date(Date.now() + 30 * DAY),
    category: 'Other',
  },
  {
    slug: 'demo-event-community-outreach',
    title: `${DEMO} Community Outreach Day`,
    description: 'Sample past event for layout testing. Volunteers served neighbours with food and practical help.',
    date: new Date(Date.now() - 14 * DAY),
    category: 'Other',
    location: `${DEMO} Community Centre`,
  },
]

const announcements = [
  {
    slug: 'demo-announcement-prayer-line',
    title: `${DEMO} Prayer line now open`,
    content:
      'Sample announcement for layout testing. Members can now send prayer requests through the contact page, and the team will pray for each one.',
    publishedAt: new Date(Date.now() - 1 * DAY),
  },
  {
    slug: 'demo-announcement-youth-camp',
    title: `${DEMO} Youth camp registration`,
    content: 'Sample announcement for layout testing. Registration for the youth camp is open to all young people in the congregation.',
    publishedAt: new Date(Date.now() - 5 * DAY),
  },
  {
    slug: 'demo-announcement-volunteers',
    title: `${DEMO} Volunteers needed for Sunday`,
    content: 'Sample announcement for layout testing. The welcome team is looking for volunteers to greet visitors on Sunday mornings.',
    publishedAt: new Date(Date.now() - 9 * DAY),
  },
  {
    slug: 'demo-announcement-archived',
    title: `${DEMO} Archived notice`,
    content: 'Sample archived announcement. Archived items are hidden from the website but kept in the CMS.',
    publishedAt: new Date(Date.now() - 60 * DAY),
    isArchived: true,
  },
]

const ministries = [
  {
    slug: 'demo-ministry-youth',
    name: `${DEMO} Youth Ministry`,
    shortDescription: `${DEMO} Sample short description for layout testing.`,
    description: `${DEMO} Sample full description for layout testing. Replace with the real ministry description from church leadership.`,
    meetingInfo: `${DEMO} Sample meeting details`,
    displayOrder: 1,
  },
  {
    slug: 'demo-ministry-mens',
    name: `${DEMO} Men's Ministry`,
    shortDescription: `${DEMO} Sample short description for layout testing.`,
    description: `${DEMO} Sample full description for layout testing. Replace with the real ministry description from church leadership.`,
    displayOrder: 2,
  },
  {
    slug: 'demo-ministry-womens',
    name: `${DEMO} Women's Ministry`,
    shortDescription: `${DEMO} Sample short description for layout testing.`,
    description: `${DEMO} Sample full description for layout testing. Replace with the real ministry description from church leadership.`,
    displayOrder: 3,
  },
  {
    slug: 'demo-ministry-prayer',
    name: `${DEMO} Prayer Ministry`,
    shortDescription: `${DEMO} Sample short description for layout testing.`,
    description: `${DEMO} Sample full description for layout testing. Replace with the real ministry description from church leadership.`,
    displayOrder: 4,
  },
]

const LEADER_NAME = `${DEMO} Demo Leadership Profile`

const contactMessages = [
  {
    subject: `${DEMO} Question about Sunday service`,
    name: 'Demo Visitor One',
    email: 'demo-visitor-one@example.test',
    message: 'DEMO MESSAGE. Delete after testing. Sample question to test how unread messages look in the inbox.',
    status: 'new' as const,
  },
  {
    subject: `${DEMO} Prayer request`,
    name: 'Demo Visitor Two',
    email: 'demo-visitor-two@example.test',
    phone: '+0 000 000 0000',
    message: 'DEMO MESSAGE. Delete after testing. Sample prayer request to test how read messages look in the inbox.',
    status: 'read' as const,
  },
  {
    subject: `${DEMO} Volunteering enquiry`,
    name: 'Demo Visitor Three',
    email: 'demo-visitor-three@example.test',
    message: 'DEMO MESSAGE. Delete after testing. Sample enquiry to test how archived messages look in the inbox.',
    status: 'archived' as const,
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
  await LeadershipMemberModel.findOneAndUpdate(
    { name: LEADER_NAME },
    {
      name: LEADER_NAME,
      role: `${DEMO} Sample role. Replace with a confirmed leader.`,
      bio: `${DEMO} Sample biography for layout testing. No real person is described here.`,
      displayOrder: 1,
      isPublished: true,
    },
    { upsert: true, setDefaultsOnInsert: true },
  )
  // The two real NFPC photographs. The base seed (`npm run seed`) creates these too, keyed by imageUrl,
  // so running both never duplicates them. They are not demo records and --remove leaves them in place.
  const realPhotos = [
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
  for (const photo of realPhotos) {
    await GalleryItemModel.findOneAndUpdate({ imageUrl: photo.imageUrl }, photo, { upsert: true, setDefaultsOnInsert: true })
  }
  for (const c of contactMessages) {
    await ContactSubmissionModel.findOneAndUpdate({ subject: c.subject }, c, { upsert: true, setDefaultsOnInsert: true })
  }
}

async function removeDemo() {
  const results = await Promise.all([
    SermonModel.deleteMany({ slug: /^demo-/ }),
    EventModel.deleteMany({ slug: /^demo-/ }),
    AnnouncementModel.deleteMany({ slug: /^demo-/ }),
    MinistryModel.deleteMany({ slug: /^demo-/ }),
    LeadershipMemberModel.deleteMany({ name: { $regex: /^\[DEMO\]/ } }),
    ContactSubmissionModel.deleteMany({ subject: { $regex: /^\[DEMO\]/ } }),
  ])
  const labels = ['sermons', 'events', 'announcements', 'ministries', 'leadership', 'contact messages']
  results.forEach((r, i) => console.log(`[seed-demo] removed ${r.deletedCount} ${labels[i]}`))
}

async function main() {
  await connectDb()
  console.log(`[seed-demo] database: ${mongoose.connection.name} (${REMOVE ? 'remove demo records' : 'upsert demo records'})`)
  if (REMOVE) {
    await removeDemo()
  } else {
    await upsertAll()
    console.log(
      `[seed-demo] ensured: ${sermons.length} sermons, ${events.length} events, ${announcements.length} announcements, ` +
        `${ministries.length} ministries, 1 leadership profile, 2 real gallery photos, ${contactMessages.length} contact messages`,
    )
  }
  await disconnectDb()
  console.log('[seed-demo] done')
}

main().catch((err) => {
  console.error('[seed-demo] failed:', err)
  process.exit(1)
})
