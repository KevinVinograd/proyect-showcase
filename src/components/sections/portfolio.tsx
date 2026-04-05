import { useRef } from "react"
import { motion, useScroll, useReducedMotion } from "framer-motion"
import { useScrollFadeIn, VIEWPORT_MARGIN, CARD_TWEEN } from "@/lib/motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const projects = [
  {
    name: "KDT Go",
    type: "Sistema de gestión de envíos",
    problem:
      "Coordinación de entregas por WhatsApp. Sin visibilidad del estado de cada envío.",
    solution:
      "Tracking en tiempo real, asignación automática de repartidores y notificaciones al cliente.",
    result:
      "+200K envíos gestionados sin coordinación manual.",
  },
  {
    name: "Vendiar",
    type: "Punto de venta con inventario integrado",
    problem:
      "Stock controlado en planillas. Decisiones de compra basadas en intuición.",
    solution:
      "POS con control de inventario en tiempo real y reportes de reposición automáticos.",
    result:
      "Stock, ventas y reposición unificados en una sola pantalla.",
  },
  {
    name: "FitBdy",
    type: "Plataforma de entrenamiento adaptativo con IA",
    problem:
      "Planes de entrenamiento estáticos que no se ajustan al progreso real del usuario.",
    solution:
      "Rutinas generadas por IA que se adaptan según el avance, la carga y la adherencia.",
    result:
      "Entrenamiento personalizado sin intervención manual del entrenador.",
  },
]


function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-[var(--font-body)] text-[length:var(--text-label)] font-[800] uppercase tracking-[0.1em] mb-[4px] text-[var(--color-fg-reverse-subtle)]">
      {children}
    </div>
  )
}

export function Portfolio() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  })
  const { opacity: headingO, y: headingY } = useScrollFadeIn(scrollYProgress, [0.3, 0.6])

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="pt-[var(--sp-12)] pb-[var(--sp-30)] max-md:pt-[var(--sp-8)] max-md:pb-[var(--sp-20)]"
    >
      <motion.div className="mb-[var(--sp-12)]" style={{ opacity: headingO, y: headingY }}>
        <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">Casos reales</p>
        <h2 className="font-[var(--font-heading)] text-[length:var(--text-h2)] max-md:text-[length:var(--text-h3)] font-[800] text-[var(--color-fg)] tracking-[-0.02em] leading-[60px] max-md:leading-[52px] text-shadow-smooth">
          Proyectos que ya operan sin intervención manual
        </h2>
      </motion.div>
      <div className="flex flex-col gap-[var(--sp-6)]">
        {projects.map((project, i) => (
          <motion.div
            key={project.name}
            initial={reducedMotion ? false : { opacity: 0, y: 40, rotate: 5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: VIEWPORT_MARGIN.content }}
            transition={{ ...CARD_TWEEN, delay: i * 0.1 }}
          >
            <Card className="rounded-sm p-[var(--sp-6)] bg-[var(--color-surface-flat)] shadow-[var(--shadow-soft)] border-none">
              <CardContent className="p-0 grid grid-cols-2 gap-[var(--sp-8)] max-md:grid-cols-1 max-md:gap-[var(--sp-6)]">
                <div className="flex flex-col justify-between max-md:gap-[var(--sp-4)]">
                  <div>
                    <p className="type-overline !text-[var(--color-fg-reverse-subtle)] mb-[var(--sp-2)]">
                      {project.type}
                    </p>
                    <h3 className="type-h3 text-[var(--color-fg-reverse)]">
                      {project.name}
                    </h3>
                  </div>
                  <Button variant="outline" className="w-fit text-[var(--color-fg-reverse)] border-[var(--color-fg-reverse-disabled)] hover:bg-[rgba(0,0,0,0.06)] hover:border-[var(--color-fg-reverse-subtle)] hover:text-[var(--color-fg-reverse)] max-md:mt-auto">
                    Ver caso
                  </Button>
                </div>
                <div className="flex flex-col gap-[var(--sp-6)]">
                  <div className="grid grid-cols-2 gap-[var(--sp-8)] max-md:grid-cols-1 max-md:gap-[var(--sp-5)]">
                    <div>
                      <FieldLabel>Problema</FieldLabel>
                      <p className="text-[length:var(--text-body-xl)] text-[var(--color-fg-reverse)] leading-[1.5]">
                        {project.problem}
                      </p>
                    </div>
                    <div>
                      <FieldLabel>Solución</FieldLabel>
                      <p className="text-[length:var(--text-body-xl)] text-[var(--color-fg-reverse)] leading-[1.5]">
                        {project.solution}
                      </p>
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Resultado</FieldLabel>
                    <p className="type-h5 font-[600] text-[var(--color-fg-reverse)] leading-[1.4]">
                      {project.result}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
