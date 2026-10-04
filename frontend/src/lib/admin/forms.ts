// Conversion between stored records and HTML form values. Kept free of React
// so the date/time and empty-value rules are easy to reason about in one place.

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'slug'
  | 'url'
  | 'email'
  | 'number'
  | 'date'
  | 'datetime'
  | 'time'
  | 'select'
  | 'checkbox'
  | 'image'

export interface FieldConfig {
  name: string
  label: string
  kind: FieldKind
  required?: boolean
  help?: string
  options?: readonly string[] | readonly { value: string; label: string }[]
  maxLength?: number
  full?: boolean
}

export type FormValues = Record<string, string | boolean>

const pad = (n: number) => String(n).padStart(2, '0')

/** yyyy-mm-dd in the admin's local timezone. */
export function toDateInput(iso: unknown): string {
  if (typeof iso !== 'string' || !iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** yyyy-mm-ddTHH:mm in local time, for datetime-local inputs. */
export function toDateTimeInput(iso: unknown): string {
  if (typeof iso !== 'string' || !iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${toDateInput(iso)}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function valuesFromRecord(record: Record<string, unknown> | null, fields: FieldConfig[]): FormValues {
  const values: FormValues = {}
  for (const f of fields) {
    const raw = record?.[f.name]
    switch (f.kind) {
      case 'checkbox':
        values[f.name] = Boolean(raw)
        break
      case 'number':
        values[f.name] = raw === undefined || raw === null ? '0' : String(raw)
        break
      case 'date':
        values[f.name] = toDateInput(raw)
        break
      case 'datetime':
        values[f.name] = toDateTimeInput(raw)
        break
      default:
        values[f.name] = typeof raw === 'string' ? raw : ''
    }
  }
  return values
}

/**
 * Builds the API payload from form values.
 *  - create: empty optional fields are omitted.
 *  - update: empty clearable fields are sent as '' so the API clears them.
 *    Slugs and enums are omitted when empty on update, because the API
 *    doesn't accept '' for a slug.
 */
export function payloadFromValues(
  values: FormValues,
  fields: FieldConfig[],
  mode: 'create' | 'update',
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  for (const f of fields) {
    const raw = values[f.name]
    switch (f.kind) {
      case 'checkbox':
        payload[f.name] = Boolean(raw)
        break
      case 'number': {
        const text = String(raw ?? '').trim()
        if (text !== '') payload[f.name] = Number(text)
        break
      }
      case 'date': {
        const text = String(raw ?? '')
        if (text) payload[f.name] = new Date(`${text}T00:00:00`).toISOString()
        break
      }
      case 'datetime': {
        const text = String(raw ?? '')
        if (text) payload[f.name] = new Date(text).toISOString()
        break
      }
      default: {
        const text = String(raw ?? '').trim()
        if (text !== '') payload[f.name] = text
        else if (mode === 'update' && f.kind !== 'slug') payload[f.name] = ''
      }
    }
  }
  return payload
}

export function validateRequired(values: FormValues, fields: FieldConfig[]): string | null {
  for (const f of fields) {
    if (f.required && f.kind !== 'checkbox' && String(values[f.name] ?? '').trim() === '') {
      return `${f.label} is required.`
    }
  }
  return null
}
