import { Schema, model, type InferSchemaType } from 'mongoose'
import { applyJsonTransform } from './plugins.js'

const serviceTimeSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 120 },
    day: { type: String, required: true, trim: true, maxlength: 40 },
    time: { type: String, required: true, trim: true, maxlength: 60 },
  },
  { _id: false },
)

// Free-form on purpose: each giving method (Orange Money, Bank Transfer, ...) needs
// different details, and NFPC hasn't confirmed a fixed set of sub-fields for any of
// them. The church writes exactly what a giver needs to see for that method, and
// nothing is shown publicly until an admin enters it here — no fabricated numbers.
const givingMethodSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    instructions: { type: String, trim: true, maxlength: 1000 },
  },
  { _id: false },
)

const siteSettingSchema = new Schema(
  {
    // Singleton: this field is always "default" so findOneAndUpdate({key:'default'}, ..., {upsert:true})
    // reliably targets the one settings document that should ever exist.
    key: { type: String, required: true, unique: true, default: 'default' },
    churchName: { type: String, required: true, trim: true, maxlength: 200 },
    motto: { type: String, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 1000 },
    // Separate from `description` (used by the homepage hero): the homepage's brief
    // About section has its own independent copy, editable on its own in the dashboard.
    aboutDescription: { type: String, trim: true, maxlength: 1000 },
    email: { type: String, trim: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 60 },
    address: { type: String, trim: true, maxlength: 300 },
    serviceTimes: { type: [serviceTimeSchema], default: [] },
    socials: {
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      twitter: { type: String, trim: true },
    },
    logoUrl: { type: String, trim: true },
    footerNote: { type: String, trim: true, maxlength: 500 },
    givingMethods: { type: [givingMethodSchema], default: [] },
  },
  { timestamps: true },
)

applyJsonTransform(siteSettingSchema)

export type SiteSetting = InferSchemaType<typeof siteSettingSchema>
export const SiteSettingModel = model('SiteSetting', siteSettingSchema)

/**
 * Verified-real defaults only (church name + motto, confirmed in
 * Milestone 2 by inspecting the church's own logo — see
 * docs/LEGACY_AUDIT.md). Everything else is left unset rather than
 * defaulted to an invented value; the frontend renders TODO_CONFIRM
 * copy for whatever comes back empty, same convention as Milestone 1/2.
 */
const VERIFIED_DEFAULTS = {
  key: 'default',
  churchName: 'National Freedom Pentecostal Church',
  motto: 'You Must Be Free',
}

export async function getOrCreateSiteSettings() {
  return SiteSettingModel.findOneAndUpdate(
    { key: 'default' },
    { $setOnInsert: VERIFIED_DEFAULTS },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  )
}
