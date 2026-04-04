export function Footer() {
  return (
    <footer className="font-[var(--font-body)] py-[var(--sp-12)] text-center text-[length:var(--text-caption)] text-[var(--color-foreground-dim)]">
      &copy; {new Date().getFullYear()}
    </footer>
  )
}
