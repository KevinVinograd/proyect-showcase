import { useRef, useState, useLayoutEffect } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion"

const LINE_1 = "Las operaciones manuales no fallan de golpe."
const LINE_2 = "Se rompen de a poco."

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
  const line1WrapRef = useRef<HTMLSpanElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const [travel1, setTravel1] = useState(0)
  const [travel2, setTravel2] = useState(0)
  const [initFrac1, setInitFrac1] = useState(0)
  const [line2H, setLine2H] = useState(0)

  useLayoutEffect(() => {
    function measure() {
      const c = containerRef.current
      if (!c) return
      const paddingLeft = parseFloat(getComputedStyle(c).paddingLeft)
      const visibleWidth = window.innerWidth - paddingLeft

      if (line1Ref.current) {
        const w = line1Ref.current.offsetWidth
        setTravel1(Math.max(0, w - visibleWidth + 120))
        setInitFrac1(Math.min(1, visibleWidth / w))
      }
      if (line2Ref.current) {
        const w = line2Ref.current.offsetWidth
        setTravel2(Math.max(0, w - visibleWidth + 120))
      }
      if (line1WrapRef.current) {
        setLine2H(c.offsetHeight - line1WrapRef.current.offsetHeight)
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

  // — Line 1: horizontal scroll + letter reveal [0, 50%], fade when line 2 finishes [80%, 82%] —
  const x1 = useTransform(scrollYProgress, [0, 0.50], [0, -travel1])
  const line1Progress = useTransform(scrollYProgress, [0, 0.50], [0, 1])
  const line1Opacity = useTransform(scrollYProgress, [0.80, 0.82], [1, 0.4])

  // — Content slides up: line 2 [50%,58%], holds for subtitle, exits [90%,95%] —
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.50, 0.58, 0.90, 0.95],
    [line2H, line2H, 0, 0, -700],
  )
  const contentOpacity = useTransform(scrollYProgress, [0.88, 0.95], [1, 0])

  // — Line 2: horizontal scroll + letter reveal [58%, 80%], fade [80%, 82%] —
  const x2 = useTransform(scrollYProgress, [0.58, 0.80], [0, -travel2])
  const line2Progress = useTransform(scrollYProgress, [0.58, 0.80], [0, 1])
  const line2Opacity = useTransform(scrollYProgress, [0.80, 0.82], [1, 0.5])

  // — Subtitle: appears when line 2 finishes —
  const [showSubtitle, setShowSubtitle] = useState(false)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setShowSubtitle(v >= 0.78)
  })

  return (
    <section ref={sectionRef} id="hero" className="relative h-[600vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Title block — anchored at bottom-80px, slides up via contentY */}
        <motion.div
          ref={containerRef}
          className="absolute bottom-[80px] left-0 right-0 pl-[200px] pr-[var(--sp-6)] max-lg:pl-[120px] max-md:pl-[var(--sp-6)]"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <h1 className="type-display text-shadow-smooth text-fg">
            <motion.span
              ref={line1WrapRef}
              className="block"
              style={{ x: x1, opacity: line1Opacity }}
            >
              <AnimatedLine
                text={LINE_1}
                progress={line1Progress}
                initFrac={initFrac1}
                innerRef={line1Ref}
              />
            </motion.span>
            <motion.span
              className="block"
              style={{ x: x2, opacity: line2Opacity }}
            >
              <AnimatedLine
                text={LINE_2}
                progress={line2Progress}
                initFrac={0}
                innerRef={line2Ref}
              />
            </motion.span>
          </h1>
          <motion.p
            className="max-w-[1000px] ml-auto text-right type-h3 text-fg mt-[80px] pr-[120px] max-md:max-w-none max-md:text-left max-md:ml-0 max-md:pr-0"
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
