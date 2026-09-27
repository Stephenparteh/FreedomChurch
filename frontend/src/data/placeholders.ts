import type { ChurchEvent, Ministry, Sermon } from '@/types/content'

/**
 * Sample content ONLY — shaped like what the backend will eventually return
 * (see docs/BACKEND_PLAN.md) so page components can be built against a
 * realistic data contract now. None of this is real church content; it
 * exists to demonstrate layout and will be deleted once pages fetch from
 * the API in Milestone 3.
 */

export const placeholderMinistries: Ministry[] = [
  {
    id: 'worship',
    name: 'Worship Ministry',
    summary: 'Leading the congregation in praise through music.',
    description:
      'Sample copy — open to musicians, vocalists, and sound/media volunteers. Replace with real ministry details.',
    meetingInfo: 'TODO_CONFIRM_SCHEDULE',
  },
  {
    id: 'children',
    name: "Children's Ministry",
    summary: "Nurturing the faith of the church's youngest members.",
    description:
      'Sample copy — teaching, activities, and care for children during services. Replace with real ministry details.',
    meetingInfo: 'TODO_CONFIRM_SCHEDULE',
  },
  {
    id: 'outreach',
    name: 'Outreach Ministry',
    summary: 'Serving the surrounding community.',
    description:
      'Sample copy — community service, food drives, and support initiatives. Replace with real ministry details.',
    meetingInfo: 'TODO_CONFIRM_SCHEDULE',
  },
]

export const placeholderSermons: Sermon[] = [
  {
    id: 'sample-1',
    title: 'Sample Sermon Title',
    preacher: 'TODO_CONFIRM_PREACHER',
    date: 'TODO_CONFIRM_DATE',
    category: 'Faith',
    description: 'Placeholder description — real sermons will be managed from the admin dashboard.',
  },
  {
    id: 'sample-2',
    title: 'Sample Sermon Title',
    preacher: 'TODO_CONFIRM_PREACHER',
    date: 'TODO_CONFIRM_DATE',
    category: 'Christian Living',
    description: 'Placeholder description — real sermons will be managed from the admin dashboard.',
  },
  {
    id: 'sample-3',
    title: 'Sample Sermon Title',
    preacher: 'TODO_CONFIRM_PREACHER',
    date: 'TODO_CONFIRM_DATE',
    category: 'Spiritual Growth',
    description: 'Placeholder description — real sermons will be managed from the admin dashboard.',
  },
]

export const placeholderEvents: ChurchEvent[] = [
  {
    id: 'sample-event-1',
    title: 'Sunday Worship Service',
    date: 'TODO_CONFIRM_DATE',
    description: 'Weekly gathering for worship and fellowship. Placeholder — confirm real schedule.',
  },
  {
    id: 'sample-event-2',
    title: 'Bible Study',
    date: 'TODO_CONFIRM_DATE',
    description: 'Placeholder — confirm real schedule and description.',
  },
]
