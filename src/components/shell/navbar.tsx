import { useEffect, useState, useCallback, useRef } from "react"
import { getLenis } from "@/lib/lenis"

const NAV_ITEMS = [
  { label: "Home", target: "hero" },
  { label: "Projects", target: "portfolio" },
  { label: "About Us", target: "equipo" },
  { label: "Contact", target: "contacto" },
]

const NAV_OFFSET = 80

export function Navbar() {
  const [active, setActive] = useState("hero")
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const [navTop, setNavTop] = useState(48)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setMenuOpen(false)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  /* Close menu on tap outside */
  useEffect(() => {
    if (!menuOpen) return
    const onTap = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", onTap)
    document.addEventListener("touchstart", onTap)
    return () => {
      document.removeEventListener("mousedown", onTap)
      document.removeEventListener("touchstart", onTap)
    }
  }, [menuOpen])

  const scrollTo = useCallback((id: string) => {
    const lenis = getLenis()
    if (!lenis) return
    if (id === "hero") {
      lenis.scrollTo(0)
    } else {
      lenis.scrollTo(`#${id}`, { offset: -NAV_OFFSET })
    }
    setMenuOpen(false)
  }, [])

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY
      const vh = window.innerHeight
      const trigger = scrollY + vh * 0.3
      const atBottom =
        scrollY + vh >= document.documentElement.scrollHeight - 50

      // Continuous interpolation: scroll 0→80px maps top 48→24px
      const t = Math.min(1, Math.max(0, scrollY / 80))
      setNavTop(48 - t * 24)

      if (atBottom) {
        setActive("contacto")
        return
      }

      let current = "hero"
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.target)
        if (el && el.offsetTop <= trigger) {
          current = item.target
        }
      }
      setActive(current)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /* ── Mobile nav ── */
  if (isMobile) {
    return (
      <div ref={menuRef} className="fixed right-[var(--sp-6)] z-50" style={{ top: navTop }}>
        <nav className="flex items-center gap-3 h-11 px-4 rounded-full bg-white/[0.06] border border-white/[0.10] backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
          <span className="font-[var(--font-heading)] text-[17px] font-[800] text-white tracking-[-0.02em] select-none">
            Backbn
          </span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="size-9 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="3" y1="3" x2="13" y2="13" />
                <line x1="13" y1="3" x2="3" y2="13" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="1" y1="4" x2="15" y2="4" />
                <line x1="1" y1="8" x2="15" y2="8" />
                <line x1="1" y1="12" x2="15" y2="12" />
              </svg>
            )}
          </button>
        </nav>

        {menuOpen && (
          <div className="mt-2 rounded-2xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] overflow-hidden">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.target}
                onClick={() => scrollTo(item.target)}
                className={`block w-full text-left px-5 py-3 font-[var(--font-body)] text-[15px] font-[500] transition-colors cursor-pointer ${
                  active === item.target
                    ? "text-white bg-white/[0.06]"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  /* ── Desktop nav ── */
  const left = NAV_ITEMS.slice(0, 2)
  const right = NAV_ITEMS.slice(2)

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      {left.map((item) => (
        <NavButton
          key={item.target}
          label={item.label}
          active={active === item.target}
          onClick={() => scrollTo(item.target)}
        />
      ))}

      <span className="px-4 font-[var(--font-heading)] text-[19px] font-[800] text-white tracking-[-0.02em] select-none shrink-0">
        Backbn
      </span>

      {right.map((item) => (
        <NavButton
          key={item.target}
          label={item.label}
          active={active === item.target}
          onClick={() => scrollTo(item.target)}
        />
      ))}
    </nav>
  )
}

function NavButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full font-[var(--font-body)] text-[13px] font-[500] transition-all duration-200 cursor-pointer whitespace-nowrap ${
        active
          ? "text-white bg-white/[0.1]"
          : "text-white/40 hover:text-white/70"
      }`}
    >
      {label}
    </button>
  )
}
