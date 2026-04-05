export function Footer() {
  return (
    <footer className="font-[var(--font-body)] pt-[40px] pb-[40px] text-center text-[length:var(--text-caption)] leading-[20px] text-[var(--color-fg-disabled)]">
      &copy; {new Date().getFullYear()}
    </footer>
  )
}
