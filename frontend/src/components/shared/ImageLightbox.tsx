import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

/**
 * Full-viewport image viewer, portaled to document.body so it is never
 * clipped by an ancestor's overflow/transform. Closes on Escape, on clicking
 * the backdrop, or via the close button; clicking the image itself does not
 * close it. Centralized here so every flyer grid (homepage preview, events
 * page) can reuse the same viewer instead of each building its own.
 */
export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Image preview"}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-900/90 p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 5 15 15M15 5 5 15" strokeLinecap="round" />
        </svg>
      </button>

      <img
        src={src}
        alt={alt}
        className="max-h-[88vh] max-w-[92vw] object-contain shadow-elevated"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body,
  );
}
