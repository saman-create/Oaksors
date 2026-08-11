import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { cx } from "@/lib/utils";

const buttonStyles = cva("btn", {
  variants: {
    variant: {
      primary: "btn-primary",
      ghost: "btn-ghost",
    },
    size: {
      md: "",
      lg: "btn-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonLinkProps = AriaLinkProps &
  VariantProps<typeof buttonStyles> & {
    children: ReactNode;
  };

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <AriaLink {...props} className={cx(buttonStyles({ variant, size }), className)} />;
}

type ButtonProps = AriaButtonProps & VariantProps<typeof buttonStyles>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <AriaButton {...props} className={cx(buttonStyles({ variant, size }), className)} />;
}
