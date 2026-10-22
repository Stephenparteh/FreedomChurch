import { useEffect, useRef, useState, type ElementType } from 'react'
import { cn } from '@/lib/cn'

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** ms, for staggering a group of reveals */
  delay?: number
  /** Tag to render (default 'div'). Use e.g. 'ul'/'li' to keep valid HTML nesting when wrapping list items. */
  as?: ElementType
  /** Any other DOM attributes (aria-*, id, role, ...) are passed through to the rendered tag. */
  [key: string]: unknown
}

/**
 * Fades/slides content in once it scrolls into view. A no-op (content stays
 * visible throughout) for prefers-reduced-motion users — the animation
 * classes only apply under the `motion-safe:` variant.
 */
export function Reveal({ children, className, delay = 0, as: Tag = 'div', ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      {...rest}
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={cn(
        'motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out',
        visible
          ? 'motion-safe:translate-y-0 motion-safe:opacity-100'
          : 'motion-safe:translate-y-5 motion-safe:opacity-0',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
