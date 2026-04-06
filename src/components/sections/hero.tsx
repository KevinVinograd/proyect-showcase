import { useRef, useState, useEffect, useLayoutEffect } from "react"
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion"
import { useScrollFadeIn } from "@/lib/motion"

const LINE = "Automatizamos tu operación."

const ANIM_DUR = 0.15

function AnimatedLetter({
  char,
  index,
  total,
  progress,
  initFrac,
}: {
  char: string
  index: number
  total: number
  progress: MotionValue<number>
  initFrac: number
}) {
  const denom = 1 - initFrac
  const rawReveal =
    denom > 0 ? ((index / total - initFrac) / denom) * (1 - ANIM_DUR) : -1

  const animStart = rawReveal < 0 ? -2 : rawReveal
  const animEnd = rawReveal < 0 ? -1 : rawReveal + ANIM_DUR

  const opacity = useTransform(progress, [animStart, animEnd], [0, 1])
  const y = useTransform(progress, [animStart, animEnd], [60, 0])
  const rotate = useTransform(
    progress,
    [animStart, animEnd],
    [index % 2 === 0 ? -5 : 5, 0],
  )

  return (
    <motion.span className="inline-block" style={{ opacity, y, rotate }}>
      {char === " " ? "\u00A0" : char}
    </motion.span>
  )
}

function AnimatedLine({
  text,
  progress,
  initFrac,
  innerRef,
}: {
  text: string
  progress: MotionValue<number>
  initFrac: number
  innerRef?: React.RefObject<HTMLSpanElement | null>
}) {
  return (
    <span ref={innerRef} className="inline-block whitespace-nowrap">
      {text.split("").map((char, i) => (
        <AnimatedLetter
          key={i}
          char={char}
          index={i}
          total={text.length}
          progress={progress}
          initFrac={initFrac}
        />
      ))}
    </span>
  )
}

export function Hero() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const [travel, setTravel] = useState(0)
  const [initFrac, setInitFrac] = useState(0)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useLayoutEffect(() => {
    if (isMobile) return
    function measure() {
      const c = containerRef.current
      if (!c) return
      const paddingLeft = parseFloat(getComputedStyle(c).paddingLeft)
      const visibleWidth = window.innerWidth - paddingLeft

      if (lineRef.current) {
        const w = lineRef.current.offsetWidth
        setTravel(Math.max(0, w - visibleWidth + 120))
        setInitFrac(Math.min(1, visibleWidth / w))
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [isMobile])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // — Line: horizontal scroll + letter reveal [0, 30%], fade [55%, 65%] —
  const x = useTransform(scrollYProgress, [0, 0.30], [0, reducedMotion ? 0 : -travel])
  const lineProgress = useTransform(scrollYProgress, [0, 0.30], [0, 1])
  const lineOpacity = useTransform(scrollYProgress, [0.55, 0.65], [1, reducedMotion ? 1 : 0.4])

  // — Content holds, then fades out progressively [30%, 65%] —
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.30, 0.65],
    [0, 0, reducedMotion ? 0 : -60],
  )
  const contentOpacity = useTransform(scrollYProgress, [0.30, 0.65], [1, reducedMotion ? 1 : 0])

  const { opacity: subtitleO, y: subtitleY } = useScrollFadeIn(scrollYProgress, [0.10, 0.20])

  /* Mobile: static hero, no animation, mobile-optimized typography */
  if (isMobile) {
    return (
      <section id="hero" aria-label="Inicio" className="relative min-h-dvh flex items-end pb-[40px] overflow-clip">
        <div className="px-[var(--sp-6)] w-full">
          <h1 className="type-display text-shadow-smooth text-fg">
            <span className="block">Automatizamos</span>
            <span className="block">tu operación.</span>
          </h1>
          <p className="text-fg mt-[var(--sp-6)] font-[var(--font-body)] text-[length:var(--text-body-lg)] font-[600] leading-[1.5] tracking-[-0.01em]">
            Planillas, carga manual, WhatsApp.
            <br />
            Lo reemplazamos con software a medida.
          </p>
        </div>
      </section>
    )
  }

  /* Reduced motion desktop: static visible hero */
  if (reducedMotion) {
    return (
      <section id="hero" aria-label="Inicio" className="relative min-h-screen flex items-end pb-[var(--sp-20)]">
        <div
          ref={containerRef}
          className="pl-[200px] pr-[var(--sp-6)] max-lg:pl-[120px] w-full"
        >
          <h1 className="type-display text-shadow-smooth text-fg">
            <span ref={lineRef}>{LINE}</span>
          </h1>
          <p className="max-w-[1000px] ml-auto text-right type-h3 text-fg pr-[120px] mt-[var(--sp-20)]">
            Planillas, carga manual, WhatsApp.
            <br />
            Lo reemplazamos con software a medida.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="hero" aria-label="Inicio" className="relative h-[150vh]">
      <div className="sticky top-0 h-screen" style={{ clipPath: "inset(0 0 -200px 0)" }}>
        {/* Title block — anchored at bottom-80px */}
        <motion.div
          ref={containerRef}
          className="absolute bottom-[var(--sp-20)] left-0 right-0 pl-[200px] pr-[var(--sp-6)] max-lg:pl-[120px] max-md:pl-[var(--sp-6)]"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <h1 className="type-display text-shadow-smooth text-fg">
            <motion.span
              className="block"
              style={{ x, opacity: lineOpacity }}
            >
              <AnimatedLine
                text={LINE}
                progress={lineProgress}
                initFrac={initFrac}
                innerRef={lineRef}
              />
            </motion.span>
          </h1>
          <motion.p
            className="absolute left-0 right-0 top-[calc(100%+var(--sp-20))] max-w-[1000px] ml-auto text-right type-h3 text-fg pr-[120px] max-md:max-w-none max-md:text-left max-md:ml-0 max-md:pr-0"
            style={{ opacity: subtitleO, y: subtitleY }}
          >
            Planillas, carga manual, WhatsApp.
            <br />
            Lo reemplazamos con software a medida.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
