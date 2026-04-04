const steps = [
  {
    number: 1,
    title: "Primero entendemos cómo trabajan hoy",
    body: "Nos sentamos con el equipo que opera, no con un brief. Si no vemos dónde está la fricción real, lo que construyamos no va a resolver nada.",
  },
  {
    number: 2,
    title: "Separamos lo que necesita software de lo que no",
    body: "No todo se resuelve con código. A veces el problema es un proceso mal definido. Distinguir eso al principio ahorra meses de desarrollo al pedo.",
  },
  {
    number: 3,
    title: "Construimos en partes que se pueden usar",
    body: "Cada entrega funciona. Si a las dos semanas lo primero que entregamos no sirve, lo sabemos antes de construir todo lo demás.",
  },
  {
    number: 4,
    title: "Ajustamos con uso real",
    body: "Cuando el equipo usa el sistema aparecen cosas que nadie anticipó. Iteramos con lo que pasa, no con lo que se supone que iba a pasar.",
  },
]

export function Process() {
  return (
    <section className="py-[var(--sp-30)] border-b border-[var(--color-border-subtle)]">
      <h2 className="font-[var(--font-heading)] text-[length:var(--text-section)] font-[700] text-[var(--color-foreground-primary)] tracking-[0] mb-[var(--sp-12)] leading-[1.2]">
        Cómo trabajamos
      </h2>
      <div className="flex flex-col">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={`grid grid-cols-[var(--grid-step)_1fr] gap-[var(--sp-6)] py-[var(--sp-9)] items-start ${
              i < steps.length - 1
                ? "border-b border-[var(--color-border-subtle)]"
                : ""
            }`}
          >
            <div className="w-[var(--step-number-size)] h-[var(--step-number-size)] flex items-center justify-center font-[var(--font-heading)] text-[length:var(--text-body)] font-[700] text-[var(--color-foreground-dim)] border-2 border-[var(--color-border-hover)] rounded-full shrink-0">
              {step.number}
            </div>
            <div>
              <h3 className="font-[var(--font-heading)] text-[length:var(--text-step-title)] font-[700] text-[var(--color-foreground-primary)] mb-[var(--sp-2)] tracking-[0] leading-[1.25]">
                {step.title}
              </h3>
              <p className="text-[length:var(--text-body)] text-[var(--color-foreground-body)] leading-[1.7]">
                {step.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
