import { motion, useScroll, useTransform, useSpring, useReducedMotion, type MotionValue } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { SCROLL_SPRING, useScrollFadeIn } from "@/lib/motion"

const bullets = [
  {
    left: "Alguien actualiza una planilla a mano y",
    right: "el resto trabaja con datos de ayer.",
  },
  {
    left: "La misma información se carga tres veces",
    right: "en tres lugares distintos.",
  },
  {
    left: "Un error en un paso manual",
    right: "se detecta recién cuando el cliente reclama.",
  },
  {
    left: "El proceso depende de una persona",
    right: "y cuando no está, todo se frena.",
  },
]

const CARD_COUNT = bullets.length

/* Each post-it gets a unique rotation for a natural, hand-placed feel */
const ROTATIONS = [-3, 2.5, -1.5, 3]
const X_OFFSETS = [-30, 25, -15, 35]


/* ─── Individual post-it with scroll-driven reveal ─── */
function PostIt({
  item,
  index,
  scrollYProgress,
}: {
  item: (typeof bullets)[number]
  index: number
  scrollYProgress: MotionValue<number>
}) {
  // Cards begin shortly after the section pins — minimal heading-only wait
  const FIRST_CARD = 0.12
  const perCard = (0.82 - FIRST_CARD) / CARD_COUNT
  const segStart = FIRST_CARD + index * perCard
  const segEnd = segStart + perCard * 0.5

  const STEP = 70
  const finalY = index * STEP

  const opacity = useSpring(useTransform(scrollYProgress, [segStart, segEnd], [0, 1]), SCROLL_SPRING)
  const scale = useSpring(useTransform(scrollYProgress, [segStart, segEnd], [1.1, 1]), SCROLL_SPRING)
  const rotate = useSpring(useTransform(scrollYProgress, [segStart, segEnd], [ROTATIONS[index] + 5, ROTATIONS[index]]), SCROLL_SPRING)
  const finalX = X_OFFSETS[index]
  const y = useSpring(useTransform(scrollYProgress, [segStart, segEnd], [finalY - 40, finalY]), SCROLL_SPRING)
  const x = useSpring(useTransform(scrollYProgress, [segStart, segEnd], [finalX - 20, finalX]), SCROLL_SPRING)

  return (
    <motion.div
      className="absolute left-0 top-0 w-full h-[320px]"
      style={{
        opacity,
        scale,
        rotate,
        y,
        x,
        zIndex: index,
      }}
    >
      <div className="w-full h-full rounded-sm p-[var(--sp-6)] flex flex-col justify-end bg-[var(--color-surface-flat)] shadow-[var(--shadow-soft)]">
        <p className="type-h4 text-left text-[var(--color-fg-reverse)]">
          {item.left} {item.right}
        </p>
      </div>
    </motion.div>
  )
}

const CIRCLE_PATH = "M420 8 C550 3, 720 25, 770 70 C810 110, 790 160, 720 185 C640 205, 480 198, 380 195 C250 190, 80 180, 30 135 C-10 95, 20 35, 120 15 C210 0, 340 5, 440 12"

function ClosingText({ isMobile }: { isMobile: boolean }) {
  const reducedMotion = useReducedMotion()
  const closingRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: closingProgress } = useScroll({
    target: closingRef,
    offset: ["start end", "start start"],
  })
  const { opacity: closingO, y: closingY } = useScrollFadeIn(closingProgress, [0.3, 0.6])
  // Circle draws after text is visible — scroll-driven, not whileInView,
  // because the parent starts at opacity 0 and whileInView would fire too early.
  const circleDraw = useSpring(useTransform(closingProgress, [0.55, 0.85], [0, 1]), SCROLL_SPRING)

  const content = (
    <div className="relative inline-block">
      <p className="type-h3 text-[var(--color-fg-subtle)] text-shadow-smooth">
        El problema no es tu equipo.
      </p>
      <p className="type-h3 text-[var(--color-fg)] text-shadow-smooth">
        Es que el proceso depende de personas haciendo tareas que un sistema debería resolver.
      </p>
      {/* Hand-drawn circle highlight — hidden on mobile */}
      <svg
        className="absolute -inset-[40px] w-[calc(100%+80px)] h-[calc(100%+80px)] max-md:hidden pointer-events-none overflow-visible"
        viewBox="-20 -5 840 215"
        fill="none"
      >
        {reducedMotion ? (
          <path
            d={CIRCLE_PATH}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <motion.path
            d={CIRCLE_PATH}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ pathLength: circleDraw }}
          />
        )}
      </svg>
    </div>
  )

  if (isMobile) {
    return (
      <div className="relative max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)] py-[var(--sp-20)] text-center overflow-clip">
        {content}
      </div>
    )
  }

  return (
    <motion.div
      ref={closingRef}
      className="relative max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)] py-[200px] max-md:py-[var(--sp-20)] text-center"
      style={{ opacity: closingO, y: closingY }}
    >
      {content}
    </motion.div>
  )
}

export function Problem() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // Approach phase: tracks from "section top at viewport bottom" to "section top at viewport top"
  const { scrollYProgress: approachProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  })

  // Heading fades in during approach — visible before the section pins
  const { opacity: headingOpacity, y: headingY } = useScrollFadeIn(approachProgress, [0.4, 0.7])

  /* ─── Mobile: 3 strongest bullets, full-width cards, no rotation ─── */
  if (isMobile) {
    const mobileBullets = bullets.slice(0, 3)
    return (
      <>
        <section id="problems" className="pt-[var(--sp-20)]">
          <div className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)]">
            <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">El problema</p>
            <h2 className="type-h3 text-[var(--color-fg)] text-shadow-smooth mb-[var(--sp-8)]">
              Esto pasa todos los días
            </h2>
            <div className="flex flex-col gap-[var(--sp-4)]">
              {mobileBullets.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg p-[var(--sp-6)] bg-[var(--color-surface-flat)] shadow-[var(--shadow-soft)]"
                >
                  <p className="type-h5 text-left text-[var(--color-fg-reverse)]">
                    {item.left} {item.right}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <ClosingText isMobile />
      </>
    )
  }

  /* ─── Desktop + reduced motion: static fan layout ─── */
  if (reducedMotion) {
    return (
      <>
        <section id="problems" className="pt-[var(--sp-30)]">
          <div className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)] text-center">
            <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">El problema</p>
            <h2 className="type-h2 text-fg text-shadow-smooth mb-[var(--sp-10)]">
              Esto pasa todos los días en equipos que operan sin sistema
            </h2>
          </div>
          <div className="flex gap-[var(--sp-6)] justify-center flex-wrap px-[var(--sp-6)]">
            {bullets.map((item, i) => (
              <div
                key={i}
                className="w-[280px] h-[280px] rounded-sm p-[var(--sp-6)] flex flex-col justify-end bg-[var(--color-surface-flat)] shadow-[var(--shadow-soft)]"
                style={{ transform: `rotate(${ROTATIONS[i]}deg)` }}
              >
                <p className="type-h4 text-left text-[var(--color-fg-reverse)]">
                  {item.left} {item.right}
                </p>
              </div>
            ))}
          </div>
        </section>
        <ClosingText isMobile={false} />
      </>
    )
  }

  /* ─── Desktop: post-it stack with scroll-driven reveal ─── */
  return (
    <>
      <section ref={sectionRef} id="problems" className="h-[220vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
          <motion.div
            className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)] w-full text-center mb-[var(--sp-20)]"
            style={{ opacity: headingOpacity, y: headingY }}
          >
            <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">El problema</p>
            <h2 className="type-h2 text-fg text-shadow-smooth">
              Esto pasa todos los días en equipos que operan sin sistema
            </h2>
          </motion.div>

          {/* Post-it stack — square cards stacked with rotation */}
          {/* 320px card + 3 × 70px steps = 530px */}
          <div className="relative w-[320px]" style={{ height: 320 + (CARD_COUNT - 1) * 70 }}>
            {bullets.map((item, i) => (
              <PostIt
                key={i}
                item={item}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </section>
      <ClosingText isMobile={false} />
    </>
  )
}
