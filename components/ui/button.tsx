import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50 active:scale-98",
  {
    variants: {
      variant: {
        default:
          "bg-white text-[#1f4d2f] font-semibold hover:bg-white/90 shadow-sm",
        destructive:
          "bg-red-500 text-white font-semibold hover:bg-red-600 shadow-sm",
        outline:
          "border border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50",
        secondary:
          "bg-white/10 text-white backdrop-blur-sm border border-white/20 hover:bg-white/15",
        ghost: "text-white hover:bg-white/10",
        link: "text-white underline-offset-4 hover:underline hover:text-emerald-400",
        jungle:
          "relative text-white font-semibold border border-white/30 shadow-md hover:opacity-90 bg-[url('/backgrounds/jungle_background.png')] bg-cover bg-center before:absolute before:inset-0 before:bg-black/40 before:rounded-md before:-z-10",
        emerald:
          "bg-emerald-500 text-white font-semibold hover:bg-emerald-600 shadow-sm shadow-emerald-500/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="spinner" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
