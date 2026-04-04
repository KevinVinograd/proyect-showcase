import { Card, CardContent } from "@/components/ui/card"

const projects = [
  {
    name: "KDT Go — Gestión de envíos",
    problem:
      "Los repartidores se coordinaban por WhatsApp. No había forma de saber quién llevaba qué, ni en qué estado estaba cada entrega.",
    solution:
      "Plataforma con tracking en tiempo real, asignación automática y visibilidad completa para operaciones.",
    result:
      "+200K envíos gestionados. Operaciones dejó de llamar repartidores uno por uno para saber dónde estaba cada paquete.",
  },
  {
    name: "Vendiar — Punto de venta e inventario",
    problem:
      "El stock se controlaba en una planilla que nadie actualizaba igual. Las decisiones de compra se tomaban a ojo.",
    solution:
      "POS con inventario integrado, movimientos automáticos de stock y reportes que se generan solos.",
    result:
      "El dueño abre una pantalla y sabe qué tiene, qué vendió y qué tiene que reponer. Sin llamar a nadie, sin abrir una planilla.",
  },
  {
    name: "FitBdy — Seguimiento fitness con IA",
    problem:
      "Planes de entrenamiento que se arman una vez y no cambian. El entrenador no tiene forma de seguir a todos.",
    solution:
      "Sistema que ajusta las rutinas según el progreso real de cada usuario.",
    result:
      "Cada usuario entrena con un plan que se adapta solo. El entrenador interviene cuando tiene sentido, no por obligación.",
  },
]

function FieldLabel({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?: "default" | "result"
}) {
  return (
    <div
      className={`font-[var(--font-body)] text-[length:var(--text-label)] font-[700] uppercase tracking-[0.1em] mb-[var(--sp-3)] ${
        variant === "result"
          ? "text-[var(--color-foreground-body)]"
          : "text-[var(--color-foreground-dim)]"
      }`}
    >
      {children}
    </div>
  )
}

export function Portfolio() {
  return (
    <section
      id="portfolio"
      className="py-[var(--sp-30)] max-md:py-[var(--sp-20)] border-b border-[var(--color-border-subtle)]"
    >
      <h2 className="font-[var(--font-heading)] text-[length:var(--text-section)] max-md:text-[length:var(--text-portfolio-title)] font-[700] text-[var(--color-foreground-primary)] tracking-[0] mb-[var(--sp-12)] leading-[1.2]">
        Proyectos
      </h2>
      <div className="flex flex-col gap-[var(--sp-6)]">
        {projects.map((project) => (
          <Card
            key={project.name}
            className="py-[var(--sp-12)] px-[var(--sp-11)] max-md:p-[var(--sp-6)] bg-[var(--color-surface-1)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-none transition-[border-color] duration-200 hover:border-[var(--color-border-hover)]"
          >
            <CardContent className="p-0">
              <h3 className="font-[var(--font-heading)] text-[length:var(--text-portfolio-title)] font-[700] text-[var(--color-foreground-primary)] mb-[var(--sp-8)] tracking-[0] leading-[1.2]">
                {project.name}
              </h3>
              <div className="grid grid-portfolio gap-[var(--sp-8)] max-md:grid-cols-1 max-md:gap-[var(--sp-5)]">
                <div>
                  <FieldLabel>Problema</FieldLabel>
                  <p className="text-[length:var(--text-secondary)] text-[var(--color-foreground-body)] leading-[1.7]">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <FieldLabel>Solución</FieldLabel>
                  <p className="text-[length:var(--text-secondary)] text-[var(--color-foreground-body)] leading-[1.7]">
                    {project.solution}
                  </p>
                </div>
                <div>
                  <FieldLabel variant="result">Resultado</FieldLabel>
                  <p className="text-[length:var(--text-body)] font-[600] text-[var(--color-foreground-strong)] leading-[1.7]">
                    {project.result}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
