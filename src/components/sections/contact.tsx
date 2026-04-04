import { Button } from "@/components/ui/button"

export function Contact() {
  return (
    <section
      id="contacto"
      className="text-center pt-[var(--sp-35)] pb-[var(--sp-30)] max-md:pt-[var(--sp-25)]"
    >
      <h2 className="font-[var(--font-heading)] text-[length:var(--text-contact)] max-md:text-[length:var(--text-section)] font-[700] text-[var(--color-foreground-primary)] tracking-[0] leading-[1.2] max-w-[var(--container-contact-title)] mx-auto mb-[var(--sp-5)]">
        Si todos los días repetís algo que debería estar automatizado,
        escribinos.
      </h2>
      <p className="font-[var(--font-body)] text-[length:var(--text-body)] text-[var(--color-foreground-body)] leading-[1.7] max-w-[var(--container-contact-sub)] mx-auto">
        La primera conversación es para entender el problema. Sin compromiso,
        sin presentación de 40 slides.
      </p>
      <div className="flex gap-[var(--sp-4)] mt-[var(--sp-10)] justify-center max-md:flex-col max-md:items-stretch">
        <Button asChild className="px-[var(--sp-12)]">
          <a href="mailto:contacto@example.com">Escribinos</a>
        </Button>
        <Button variant="outline" asChild>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </Button>
      </div>
    </section>
  )
}
