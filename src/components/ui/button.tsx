/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-[length:var(--text-body)] transition-opacity duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-[var(--font-body)] font-[600] rounded-[var(--radius-md)] hover:opacity-[0.88]",
        outline:
          "bg-transparent text-[var(--color-foreground-dim)] font-[var(--font-body)] font-[500] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-foreground-body)] transition-[border-color,color] duration-150",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant }),
          "px-[var(--sp-8)] py-[var(--sp-4)]",
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
