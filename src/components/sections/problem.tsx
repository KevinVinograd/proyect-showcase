const bullets = [
  "Alguien actualiza una planilla a mano y el resto trabaja con datos de ayer.",
  "La misma información se carga tres veces en tres lugares distintos.",
  "Un error en un paso manual se detecta recién cuando el cliente reclama.",
  "El que sabe cómo funciona todo se fue de vacaciones y nadie puede cubrir.",
]

export function Problem() {
  return (
    <section className="py-[var(--sp-30)] border-b border-[var(--color-border-subtle)]">
      <h2 className="font-[var(--font-heading)] text-[length:var(--text-section)] font-[700] text-[var(--color-foreground-primary)] tracking-[0] mb-[var(--sp-12)] leading-[1.2]">
        Esto pasa todos los días en equipos que operan sin sistema
      </h2>
      <ul className="list-none flex flex-col gap-[var(--sp-2)]">
        {bullets.map((text, i) => (
          <li
            key={i}
            className="text-[length:var(--text-body)] text-[var(--color-foreground-body)] py-[var(--sp-3)] pl-[var(--sp-5)] border-l border-[var(--color-border)] leading-[1.7]"
          >
            {text}
          </li>
        ))}
      </ul>
      <p className="font-[var(--font-heading)] text-[length:var(--text-portfolio-title)] font-[700] text-[var(--color-foreground-strong)] mt-[var(--sp-12)] pt-[var(--sp-8)] border-t border-[var(--color-border)] leading-[1.35] tracking-[0]">
        El problema no es tu equipo. Es que el proceso depende de personas
        haciendo trabajo de máquina.
      </p>
    </section>
  )
}
