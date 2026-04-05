import { useRef, useState, useLayoutEffect } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion"

const LINE = "Si es repetitivo, no deberías hacerlo."

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
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const [travel, setTravel] = useState(0)
  const [initFrac, setInitFrac] = useState(0)

  useLayoutEffect(() => {
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
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // — Line: horizontal scroll + letter reveal [0, 30%], fade [52%, 55%] —
  const x = useTransform(scrollYProgress, [0, 0.30], [0, -travel])
  const lineProgress = useTransform(scrollYProgress, [0, 0.30], [0, 1])
  const lineOpacity = useTransform(scrollYProgress, [0.52, 0.55], [1, 0.4])

  // — Content holds, then exits [58%, 68%] — must finish before Problem enters at ~71% —
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.58, 0.68],
    [0, 0, -200],
  )
  const contentOpacity = useTransform(scrollYProgress, [0.60, 0.68], [1, 0])

  // — Subtitle: appears right after line finishes —
  const [showSubtitle, setShowSubtitle] = useState(false)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setShowSubtitle(v >= 0.28)
  })

  return (
    <section ref={sectionRef} id="hero" className="relative h-[350vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Title block — anchored at bottom-80px */}
        <motion.div
          ref={containerRef}
          className="absolute bottom-[80px] left-0 right-0 pl-[200px] pr-[var(--sp-6)] max-lg:pl-[120px] max-md:pl-[var(--sp-6)]"
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
            className="absolute left-0 right-0 top-[calc(100%+80px)] max-w-[1000px] ml-auto text-right type-h3 text-fg pr-[120px] max-md:max-w-none max-md:text-left max-md:ml-0 max-md:pr-0"
            animate={showSubtitle ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Errores, retrabajo y dependencia humana.
            <br />
            Lo convertimos en sistema.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
