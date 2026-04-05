import { motion } from "framer-motion"
import { lazy, Suspense, useEffect, type ReactNode } from "react"
import Lenis from "lenis"
import { setLenis } from "@/lib/lenis"
import { Navbar } from "@/components/shell/navbar"

const ShaderBackground = lazy(() =>
  import("@/components/shell/shader-background").then((m) => ({ default: m.ShaderBackground }))
)
import { Hero } from "@/components/sections/hero"
import { Problem } from "@/components/sections/problem"
import { WhatWeBuild } from "@/components/sections/what-we-build"
import { Process } from "@/components/sections/process"
import { Portfolio } from "@/components/sections/portfolio"
import { Technologies } from "@/components/sections/technologies"
import { Team } from "@/components/sections/team"
import { Contact } from "@/components/sections/contact"
import { ZigzagDivider } from "@/components/ui/zigzag-divider"
import { HandwrittenArrow } from "@/components/ui/handwritten-arrow"

function Reveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis()
    setLenis(lenis)
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => {
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <ShaderBackground />
      </Suspense>
      <Navbar />
      <main>
        <Hero />
        <div className="h-[15vh]" />
        <Problem />
        <div className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)]">
          <Reveal><WhatWeBuild /></Reveal>
        </div>
        <ZigzagDivider />
        <Process />
        <HandwrittenArrow />
        <div className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)]">
          <Reveal><Portfolio /></Reveal>
        </div>
        <Technologies />
        <Team />
        <Contact />
      </main>
    </>
  )
}
