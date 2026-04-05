import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function Contact() {
  return (
    <section
      id="contacto"
      className="relative z-20 bg-white pt-[120px] pb-[40px] max-md:pt-[80px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center px-[var(--sp-10)] max-w-[700px] max-md:max-w-[90vw] mx-auto"
      >
        <p className="type-overline text-black/50 mb-[var(--sp-3)]">Contacto</p>
        <h2 className="font-[var(--font-heading)] text-[length:var(--text-h2)] max-md:text-[length:var(--text-h3)] font-[800] text-black tracking-[-0.02em] leading-[60px] max-md:leading-[52px] max-w-[var(--container-contact-title)] mx-auto mb-[var(--sp-5)]">
          Si todos los días repetís algo que debería estar automatizado,
          escribinos.
        </h2>
        <p className="font-[var(--font-body)] text-[length:var(--text-body-lg)] text-black/60 leading-[1.7] max-w-[var(--container-contact-sub)] mx-auto">
          La primera conversación es para entender el problema.
          <br />
          Sin compromiso, sin presentación de 40 slides.
        </p>
        <div className="flex gap-[var(--sp-4)] mt-[var(--sp-10)] justify-center max-md:flex-col max-md:items-stretch">
          <Button asChild className="bg-black text-white hover:bg-black/90 border-black">
            <a href="mailto:contacto@example.com">Escribinos</a>
          </Button>
          <Button variant="outline" asChild className="border-black/20 text-black hover:bg-black/5">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </Button>
        </div>
        <p className="mt-[var(--sp-20)] text-[length:var(--text-caption)] text-black/50">
          &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </section>
  )
}
