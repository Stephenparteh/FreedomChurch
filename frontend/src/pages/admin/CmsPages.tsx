import { CrudPage } from '@/components/admin/CrudPage'
import {
  announcementsConfig,
  branchesConfig,
  eventsConfig,
  galleryConfig,
  ministriesConfig,
  serviceSessionsConfig,
  sermonsConfig,
  teamConfig,
} from './resourceConfigs'

export function AdminSermons() {
  return <CrudPage config={sermonsConfig} />
}

export function AdminEvents() {
  return <CrudPage config={eventsConfig} />
}

export function AdminGallery() {
  return <CrudPage config={galleryConfig} />
}

export function AdminMinistries() {
  return <CrudPage config={ministriesConfig} />
}

export function AdminServiceSessions() {
  return <CrudPage config={serviceSessionsConfig} />
}

export function AdminAnnouncements() {
  return <CrudPage config={announcementsConfig} />
}

export function AdminTeam() {
  return <CrudPage config={teamConfig} />
}

export function AdminBranches() {
  return <CrudPage config={branchesConfig} />
}
