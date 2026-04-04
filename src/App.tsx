import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { Hero } from "@/components/sections/hero"
import { Problem } from "@/components/sections/problem"
import { WhatWeBuild } from "@/components/sections/what-we-build"
import { Process } from "@/components/sections/process"
import { Portfolio } from "@/components/sections/portfolio"
import { Technologies } from "@/components/sections/technologies"
import { Team } from "@/components/sections/team"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/sections/footer"

function Reveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "var(--reveal-margin)" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  return (
    <>
      <Hero />
      <div className="max-w-[var(--container-content)] mx-auto px-[var(--sp-6)]">
        <Reveal><Problem /></Reveal>
        <Reveal><WhatWeBuild /></Reveal>
        <Reveal><Process /></Reveal>
        <Reveal><Portfolio /></Reveal>
        <Reveal><Technologies /></Reveal>
        <Reveal><Team /></Reveal>
        <Reveal><Contact /></Reveal>
        <Footer />
      </div>
    </>
  )
}
