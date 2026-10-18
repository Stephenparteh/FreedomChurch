import { useEffect, useId, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { resolveMediaUrl } from '@/lib/media'
import { uploadMedia } from '@/lib/api/admin'
import { ApiClientError } from '@/lib/api/client'

const ACCEPT = 'image/jpeg,image/png,image/gif,image/webp'

/**
 * Real file upload for an image field. Selecting a file shows an immediate local
 * preview (an object URL) so the box never sits empty while the upload is in
 * flight, then uploads the file and stores the returned server path. The local
 * preview is revoked once it's no longer needed — on a new selection, on
 * unmount, or once the server URL takes over — so it never leaks.
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
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const localPreviewRef = useRef<string | null>(null)
  const inputId = useId()
  const preview = localPreview ?? resolveMediaUrl(value)

  function setLocal(url: string | null) {
    if (localPreviewRef.current) URL.revokeObjectURL(localPreviewRef.current)
    localPreviewRef.current = url
    setLocalPreview(url)
  }

  // Revoke on unmount, in case a selection is still in flight when the form closes.
  useEffect(() => () => setLocal(null), []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleFile(file: File | undefined) {
    if (!file) return
    setLocal(URL.createObjectURL(file))
    setUploading(true)
    setError('')
    try {
      const { data } = await uploadMedia(file)
      onChange(data.url)
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'The image could not be uploaded.')
    } finally {
      setLocal(null)
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <p id={`${id}-label`} className="field-label">
        {label}
      </p>
      <div className="flex flex-col gap-4 rounded-lg border border-dashed border-border-strong bg-surface-muted p-4 sm:flex-row sm:items-center">
        <div className="relative flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface sm:w-48">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="px-3 text-center text-xs text-text-muted">No image selected</span>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface/70">
              <span role="status" className="flex items-center gap-2 text-xs font-medium text-text">
                <span aria-hidden className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border-strong border-t-primary-600" />
                Uploading...
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor={inputId}
            className="inline-flex min-h-10 cursor-pointer items-center rounded-md border border-border-strong bg-surface px-4 text-sm font-semibold text-text hover:border-primary-300 focus-within:outline-2 focus-within:outline-primary-500"
          >
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
              Remove
            </Button>
          )}
        </div>
      </div>
      <p className="field-help">{help ?? 'JPEG, PNG, GIF, or WebP. Up to 5 MB.'}</p>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}
