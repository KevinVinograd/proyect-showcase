import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.3"],
  })

  const headingOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const headingY = useTransform(scrollYProgress, [0, 0.5], [40, 0])
  const bodyOpacity = useTransform(scrollYProgress, [0.3, 0.7], [0, 1])
  const bodyY = useTransform(scrollYProgress, [0.3, 0.7], [30, 0])
  const ctaOpacity = useTransform(scrollYProgress, [0.5, 0.9], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.5, 0.9], [20, 0])

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className="relative z-20 pt-[160px] pb-[40px] max-md:pt-[100px]"
    >
      <div className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)]">
        <motion.p
          className="type-overline text-shadow-smooth mb-[var(--sp-3)]"
          style={{ opacity: headingOpacity, y: headingY }}
        >
          Contacto
        </motion.p>
        <motion.h2
          className="type-display text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.5)] text-shadow-smooth max-md:text-[length:var(--text-h1)] max-md:leading-[1.1] max-md:tracking-[-0.03em] max-w-[900px] mb-[var(--sp-8)]"
          style={{ opacity: headingOpacity, y: headingY }}
        >
          Si todos los días repetís algo que debería estar automatizado,
          escribinos.
        </motion.h2>
        <motion.p
          className="font-[var(--font-body)] text-[length:var(--text-body-lg)] text-[var(--color-fg-subtle)] leading-[1.7] max-w-[var(--container-contact-sub)]"
          style={{ opacity: bodyOpacity, y: bodyY }}
        >
          La primera conversación es para entender el problema.
          <br />
          Sin compromiso, sin presentación de 40 slides.
        </motion.p>
        <motion.div
          className="flex gap-[var(--sp-4)] mt-[var(--sp-10)] max-md:flex-col max-md:items-stretch"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <Button asChild>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribinos por LinkedIn
            </a>
          </Button>
        </motion.div>
        <motion.p
          className="mt-[var(--sp-20)] text-[length:var(--text-caption)] text-[var(--color-fg-disabled)]"
          style={{ opacity: ctaOpacity }}
        >
          &copy; {new Date().getFullYear()}
        </motion.p>
      </div>
    </section>
  )
}
