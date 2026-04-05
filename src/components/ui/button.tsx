/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-[length:var(--text-button-lg)] font-bold tracking-[-0.01em] leading-[32px] transition-opacity duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-[var(--font-body)] font-[600] rounded-full hover:bg-[rgba(255,255,255,0.85)]",
        outline:
          "bg-transparent text-[var(--color-fg-disabled)] font-[var(--font-body)] font-[500] border border-[var(--color-border)] rounded-full hover:bg-[rgba(255,255,255,0.08)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-fg-subtle)] transition-[border-color,color,background-color] duration-150",
      },
      size: {
        md: "px-[var(--sp-8)] py-[var(--sp-4)]",
        xl: "px-[var(--sp-12)] py-[var(--sp-5)] text-[length:22px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

/* ─── Living glow: static ambient + perimeter wave (default variant only) ─── */

function GlowLayers({ reducedMotion }: { reducedMotion: boolean | null }) {
  return (
    <>
      {/* Static ambient — soft white halo, no animation */}
      <span
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{ inset: "-14px", background: "white", filter: "blur(18px)", opacity: 0.14 }}
      />
      {/* Perimeter wave — sole source of motion (CSS rotation) */}
      {reducedMotion ? (
        <span
          aria-hidden
          className="btn-wave pointer-events-none absolute rounded-full"
          style={{ inset: "-5px", padding: "3px", filter: "blur(1px)" }}
        />
      ) : (
        <motion.span
          aria-hidden
          className="btn-wave pointer-events-none absolute rounded-full"
          style={{ inset: "-5px", padding: "3px", filter: "blur(1px)", opacity: 0.9 }}
          variants={{
            hover: { opacity: 1 },
            tap: { opacity: 0.3 },
          }}
        />
      )}
    </>
  )
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDefault = (variant ?? "default") === "default"
    const reducedMotion = useReducedMotion()

    if (isDefault) {
      return (
        <motion.span
          className="relative inline-flex overflow-visible"
          whileHover="hover"
          whileTap="tap"
        >
          <GlowLayers reducedMotion={reducedMotion} />
          <Comp
            className={cn(
              buttonVariants({ variant, size }),
              "relative z-10",
              className
            )}
            ref={ref}
            {...props}
          />
        </motion.span>
      )
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
