import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:scale-105 shadow-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-sky-400",
        destructive:
          "bg-destructive text-white hover:bg-rose-500 focus-visible:ring-destructive/30",
        outline:
          "border-2 border-primary bg-white text-primary hover:bg-sky-50",
        secondary:
          "bg-secondary text-white hover:bg-blue-400",
        ghost:
          "hover:bg-sky-100 text-primary",
        link: "text-primary underline-offset-4 hover:underline hover:text-sky-600",
      },
      size: {
        default: "h-9 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-full gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-11 rounded-full px-7 has-[>svg]:px-5",
        icon: "size-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
