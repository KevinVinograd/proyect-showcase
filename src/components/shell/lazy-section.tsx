import { useRef, useState, useEffect, type ReactNode } from "react"

interface LazySectionProps {
  children: ReactNode
  /** CSS min-height to reserve before mount, prevents layout collapse */
  placeholder?: string
}

/**
 * Defers mounting of children until the wrapper approaches the viewport.
 * Once mounted, children stay mounted permanently.
 */
export function LazySection({ children, placeholder = "50vh" }: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true)
          observer.disconnect()
        }
      },
      { rootMargin: "100% 0px 100% 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (mounted) {
    return <>{children}</>
  }

  return <div ref={ref} style={{ minHeight: placeholder }} />
}
