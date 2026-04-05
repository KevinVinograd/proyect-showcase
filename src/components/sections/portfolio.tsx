import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const projects = [
  {
    name: "KDT Go",
    type: "Gestión de envíos",
    problem:
      "Coordinación por WhatsApp sin visibilidad del estado de cada entrega.",
    solution:
      "Tracking en tiempo real con asignación automática.",
    result:
      "+200K envíos gestionados. Visibilidad total sin llamadas manuales.",
  },
  {
    name: "Vendiar",
    type: "Punto de venta e inventario",
    problem:
      "Stock en planillas desactualizadas. Decisiones de compra a ojo.",
    solution:
      "POS con inventario integrado y reportes automáticos.",
    result:
      "Control total de stock, ventas y reposición en una sola pantalla.",
  },
  {
    name: "FitBdy",
    type: "Seguimiento fitness con IA",
    problem:
      "Planes de entrenamiento estáticos que no se adaptan al progreso.",
    solution:
      "Rutinas que se ajustan según el avance real de cada usuario.",
    result:
      "Entrenamiento personalizado y adaptativo sin intervención constante.",
  },
]

const ROTATIONS = [-2, 3, -4] // alternating slight rotations per card

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-[var(--font-body)] text-[length:var(--text-label)] font-[800] uppercase tracking-[0.1em] mb-[4px] text-[var(--color-fg-reverse-subtle)]">
      {children}
    </div>
  )
}

export function Portfolio() {
  return (
    <section
      id="portfolio"
      className="pt-[var(--sp-12)] pb-[var(--sp-30)] max-md:pt-[var(--sp-8)] max-md:pb-[var(--sp-20)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-[var(--sp-12)]"
      >
        <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">Casos reales</p>
        <h2 className="font-[var(--font-heading)] text-[length:var(--text-h2)] max-md:text-[length:var(--text-h3)] font-[800] text-[var(--color-fg)] tracking-[-0.02em] leading-[60px] max-md:leading-[52px] text-shadow-smooth">
          Proyectos
        </h2>
      </motion.div>
      <div className="flex flex-col gap-[24px]">
        {projects.map((project, i) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 40, scale: 1.08, rotate: ROTATIONS[i % ROTATIONS.length] + 4 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            viewport={{ margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
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
