import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const blocks = [
  {
    title: "Lo que se repite, se ejecuta solo",
    body: "Si tu equipo carga datos, cruza información o arma reportes todos los días, eso deja de existir como tarea. Se convierte en algo que pasa.",
    focal: false,
  },
  {
    title: "Lo que está disperso, aparece en un lugar",
    body: "Nada más de buscar en una planilla, preguntar por WhatsApp y esperar que alguien conteste. El estado real de la operación está visible para todos, siempre.",
    focal: true,
  },
  {
    title: "Lo que ya funciona, no se toca",
    body: "No reemplazamos todo. Si hay herramientas que sirven, las conectamos. Construimos lo que falta, no lo que queda bien en un pitch.",
    focal: false,
  },
]

export function WhatWeBuild() {
  return (
    <section className="py-[var(--sp-30)] border-b border-[var(--color-border-subtle)]">
      <h2 className="font-[var(--font-heading)] text-[length:var(--text-section)] font-[700] text-[var(--color-foreground-primary)] tracking-[0] mb-[var(--sp-12)] leading-[1.2]">
        Lo que cambia cuando dejás de operar a mano
      </h2>
      <div className="grid grid-cols-3 gap-[var(--sp-5)] max-md:grid-cols-1">
        {blocks.map((block) => (
          <Card
            key={block.title}
            className={cn(
              "py-[var(--sp-8)] px-[var(--sp-6)] rounded-[var(--radius-lg)] border transition-[border-color] duration-200 shadow-none",
              block.focal
                ? "bg-[var(--color-surface-2)] border-[var(--color-border-hover)]"
                : "bg-[var(--color-surface-1)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
            )}
          >
            <CardContent className="p-0">
              <h3
                className={cn(
                  "font-[var(--font-heading)] text-[length:var(--text-card-title)] font-[700] mb-[var(--sp-3)] leading-[1.25] tracking-[0]",
                  block.focal
                    ? "text-[var(--color-foreground-primary)]"
                    : "text-[var(--color-foreground-strong)]"
                )}
              >
                {block.title}
              </h3>
              <p className="text-[length:var(--text-secondary)] text-[var(--color-foreground-body)] leading-[1.7]">
                {block.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
