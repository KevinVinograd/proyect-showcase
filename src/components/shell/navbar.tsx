import { useEffect, useState, useCallback } from "react"
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

  const scrollTo = useCallback((id: string) => {
    const lenis = getLenis()
    if (!lenis) return
    if (id === "hero") {
      lenis.scrollTo(0)
    } else {
      lenis.scrollTo(`#${id}`, { offset: -NAV_OFFSET })
    }
  }, [])

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY
      const vh = window.innerHeight
      const trigger = scrollY + vh * 0.3
      const atBottom =
        scrollY + vh >= document.documentElement.scrollHeight - 50

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

  const left = NAV_ITEMS.slice(0, 2)
  const right = NAV_ITEMS.slice(2)

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 max-sm:gap-0.5 px-2 max-sm:px-1.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      {left.map((item) => (
        <NavButton
          key={item.target}
          label={item.label}
          active={active === item.target}
          onClick={() => scrollTo(item.target)}
        />
      ))}

      <span className="px-4 max-sm:px-2.5 font-[var(--font-heading)] text-[19px] font-[800] text-white tracking-[-0.02em] select-none">
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
      className={`px-3.5 max-sm:px-2.5 py-1.5 rounded-full font-[var(--font-body)] text-[13px] max-sm:text-[12px] font-[500] transition-all duration-200 cursor-pointer whitespace-nowrap ${
        active
          ? "text-white bg-white/[0.1]"
          : "text-white/40 hover:text-white/70"
      }`}
    >
      {label}
    </button>
  )
}
