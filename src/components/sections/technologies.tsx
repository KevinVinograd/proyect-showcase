import { Badge } from "@/components/ui/badge"

const categories = [
  { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { label: "Backend", items: ["Node.js", "Python", "PostgreSQL", "Redis"] },
  { label: "Infraestructura", items: ["AWS", "Docker", "CI/CD"] },
]

export function Technologies() {
  return (
    <section className="py-[var(--sp-20)] border-b border-[var(--color-border-subtle)]">
      <h2 className="font-[var(--font-heading)] text-[length:var(--text-portfolio-title)] font-[700] text-[var(--color-foreground-strong)] tracking-[0] mb-[var(--sp-3)] leading-[1.2]">
        Stack técnico
      </h2>
      <p className="font-[var(--font-body)] text-[length:var(--text-secondary)] text-[var(--color-foreground-dim)] mb-[var(--sp-8)] leading-[1.7]">
        La tecnología es una herramienta, no un argumento de venta. Elegimos la
        que resuelve el problema, no la que está de moda.
      </p>
      {categories.map((cat, i) => (
        <div
          key={cat.label}
          className={i < categories.length - 1 ? "mb-[var(--sp-5)]" : ""}
        >
          <div className="font-[var(--font-body)] text-[length:var(--text-label)] font-[700] uppercase tracking-[0.1em] text-[var(--color-foreground-dim)] mb-[var(--sp-3)]">
            {cat.label}
          </div>
          <div className="flex flex-wrap gap-[var(--sp-2)]">
            {cat.items.map((item) => (
              <Badge
                key={item}
                variant="outline"
                className="font-[var(--font-body)] text-[length:var(--text-badge)] font-[500] px-[var(--badge-px)] py-[var(--badge-py)] bg-[var(--color-surface-1)] border-[var(--color-border)] text-[var(--color-foreground-dim)] rounded-[var(--radius-sm)] shadow-none transition-[border-color] duration-150 hover:border-[var(--color-border-hover)]"
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
