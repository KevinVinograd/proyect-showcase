import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section
      className="pt-[var(--sp-45)] pb-[var(--sp-35)] border-b border-[var(--color-border-subtle)]"
    >
      <div className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)]">
        <h1
          className="font-[var(--font-heading)] text-[length:var(--text-hero)] font-[800] leading-[1.1] tracking-[-0.01em] text-[var(--color-foreground-primary)] mb-[var(--sp-6)]"
        >
          Si tu operación funciona porque alguien se acuerda de hacer las cosas,
          es cuestión de tiempo
        </h1>
        <p
          className="font-[var(--font-body)] text-[length:var(--text-subheadline)] text-[var(--color-foreground-body)] leading-[1.7] max-w-[var(--container-subheadline)]"
        >
          Construimos software a medida para que tu equipo deje de ser el
          sistema.
        </p>
        <div className="flex gap-[var(--sp-4)] mt-[var(--sp-10)] items-center">
          <Button asChild>
            <a href="#contacto">Hablemos</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#portfolio">Ver proyectos</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
