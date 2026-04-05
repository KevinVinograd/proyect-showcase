export function Footer() {
  return (
    <footer className="font-[var(--font-body)] pt-[var(--sp-10)] pb-[var(--sp-10)] text-center text-[length:var(--text-caption)] leading-[20px] text-[var(--color-fg-disabled)]">
      &copy; {new Date().getFullYear()}
    </footer>
  )
}
