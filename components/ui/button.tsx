import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium  transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          " border bg-brand_secondary text-base text-brand_primary hover:bg-brand_secondary/80",
        destructive:
          "bg-red-900 text-brand_tertiary hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "border border-solid border-brand_tertiary/20 hover:bg-brand_tertiary/10",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost:
          "bg-none border border-solid border-brand_tertiary/50 text-brand_secondary transition-all hover:opacity-80 hover:border-brand_tertiary",
        Trigger: "bg-none text-brand_secondary/70 hover:text-brand_secondary",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
        SidebarMenuButton:
          "flex justify-start items-center gap-2 bg-none w-full text-brand_secondary hover:bg-brand_secondary/10",
        SidebarMenuButton_destructive:
          "flex justify-start items-center gap-2 bg-none w-full text-red-600 hover:bg-red-600/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
