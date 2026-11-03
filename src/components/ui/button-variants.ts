import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/60 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-warm text-ink hover:bg-gold-soft rounded-full",
        gold: "bg-gold text-ink hover:bg-gold-soft rounded-full",
        outline:
          "border border-warm/25 text-warm hover:border-gold hover:text-gold rounded-full bg-transparent",
        ghost: "text-warm/80 hover:text-warm rounded-full",
        link: "text-warm underline-offset-4 hover:text-gold",
      },
      size: {
        sm: "h-10 px-5 text-sm",
        md: "h-12 px-7 text-sm tracking-wide",
        lg: "h-14 px-9 text-[0.95rem] tracking-wide",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
