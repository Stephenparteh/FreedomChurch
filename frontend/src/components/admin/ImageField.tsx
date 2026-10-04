import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { resolveMediaUrl } from '@/lib/media'
import { uploadMedia } from '@/lib/api/admin'
import { ApiClientError } from '@/lib/api/client'

const ACCEPT = 'image/jpeg,image/png,image/gif,image/webp'

/**
 * Real file upload for an image field. Selecting a file uploads it immediately
 * and stores the returned server path. The file is validated again by the API.
 */
export function ImageField({
  id,
  label,
  value,
  onChange,
  help,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  help?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputId = useId()
  const preview = resolveMediaUrl(value)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const { data } = await uploadMedia(file)
      onChange(data.url)
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'The image could not be uploaded.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <p id={`${id}-label`} className="block text-sm font-medium text-text">
        {label}
      </p>
      {preview ? (
        <img src={preview} alt="" className="h-32 w-auto max-w-full rounded-md border border-border object-cover" />
      ) : (
        <p className="text-sm text-text-muted">No image selected.</p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor={inputId} className="cursor-pointer rounded-md border border-border-strong px-3 py-2 text-sm font-medium hover:bg-surface-muted focus-within:outline-2 focus-within:outline-primary-500">
          {value ? 'Replace image' : 'Choose image'}
          <input
            id={inputId}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            aria-labelledby={`${id}-label`}
            disabled={uploading}
            onChange={(e) => {
              void handleFile(e.target.files?.[0])
              e.target.value = ''
            }}
          />
        </label>
        {value && (
          <Button variant="ghost" type="button" onClick={() => onChange('')} disabled={uploading}>
            Remove image
          </Button>
        )}
        {uploading && (
          <span role="status" className="text-sm text-text-muted">
            Uploading...
          </span>
        )}
      </div>
      <p className="text-xs text-text-muted">{help ?? 'JPEG, PNG, GIF, or WebP. Up to 5 MB.'}</p>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}
