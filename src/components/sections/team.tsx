const members = [
  {
    name: "Ian",
    role: "Diseño de sistemas y experiencia",
    description:
      "Entiende el problema, define la solución y estructura cómo se usa.",
  },
  {
    name: "Kevin",
    role: "Desarrollo y arquitectura",
    description: "Construye el sistema. Backend, lógica, escalabilidad.",
  },
  {
    name: "Juan Cruz",
    role: "Operación y negocio",
    description:
      "Trae el contexto real. Asegura que lo que se construye funcione en la práctica.",
  },
]

export function Team() {
  return (
    <section className="py-[var(--sp-30)] max-md:py-[var(--sp-20)] border-b border-[var(--color-border-subtle)]">
      <h2 className="font-[var(--font-heading)] text-[length:var(--text-section)] max-md:text-[length:var(--text-portfolio-title)] font-[700] text-[var(--color-foreground-primary)] tracking-[0] mb-[var(--sp-12)] leading-[1.2]">
        Quiénes somos
      </h2>
      <p className="font-[var(--font-body)] text-[length:var(--text-body)] text-[var(--color-foreground-dim)] mt-[calc(var(--sp-12)*-1+var(--sp-3))] mb-[var(--sp-12)] leading-[1.7]">
        Tres perfiles que cubren diseño, desarrollo y operación. Sin
        intermediarios.
      </p>
      <div className="grid grid-cols-3 gap-[var(--sp-10)] max-md:grid-cols-1 max-md:gap-[var(--sp-6)]">
        {members.map((member) => (
          <div key={member.name}>
            <h3 className="font-[var(--font-heading)] text-[length:var(--text-subheadline)] font-[700] text-[var(--color-foreground-primary)] mb-[var(--sp-1)] leading-[1.2] tracking-[0]">
              {member.name}
            </h3>
            <div className="font-[var(--font-body)] text-[length:var(--text-caption)] font-[600] text-[var(--color-foreground-dim)] uppercase tracking-[0.06em] mb-[var(--sp-3)]">
              {member.role}
            </div>
            <p className="font-[var(--font-body)] text-[length:var(--text-secondary)] text-[var(--color-foreground-body)] leading-[1.7]">
              {member.description}
            </p>
          </div>
        ))}
      </div>
      <p className="font-[var(--font-heading)] text-[length:var(--text-portfolio-title)] font-[700] text-[var(--color-foreground-strong)] mt-[var(--sp-12)] pt-[var(--sp-8)] border-t border-[var(--color-border)] leading-[1.35] tracking-[0]">
        Cada decisión pasa por los tres. No hay handoffs, no hay teléfono
        descompuesto.
      </p>
    </section>
  )
}
