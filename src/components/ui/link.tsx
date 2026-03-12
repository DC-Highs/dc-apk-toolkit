"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Link as RouterLink } from "react-router-dom"
import { ExternalLink, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import * as React from "react"

const linkVariants = cva(
    "inline-flex items-center gap-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
    {
        variants: {
            variant: {
                default: "text-blue-500 hover:text-blue-500/80",
                destructive: "text-destructive hover:text-destructive/80",
                secondary:
                    "text-secondary-foreground hover:text-secondary-foreground/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                underline: "text-foreground underline-offset-4 hover:underline",
            },
            size: {
                default: "",
                base: "text-base",
                sm: "text-sm",
                lg: "text-lg",
                xs: "text-xs",
            },
            underline: {
                always: "underline underline-offset-4",
                hover: "no-underline hover:underline hover:underline-offset-4",
                none: "no-underline",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            underline: "hover",
        },
    },
)

export interface LinkProps
    extends
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        VariantProps<typeof linkVariants> {
    href: string
    showExternalIcon?: boolean
    asChild?: boolean
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
    (
        {
            className,
            variant,
            size,
            underline,
            href,
            showExternalIcon = true,
            children,
            ...props
        },
        ref,
    ) => {
        const isExternal =
            href.startsWith("http") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:")

        const content = (
            <>
                {children}
                {isExternal && showExternalIcon && href.includes("mailto:") ? (
                    <Mail className="size-3.5" />
                ) : (
                    <ExternalLink className="size-3.5" />
                )}
            </>
        )

        if (isExternal) {
            return (
                <a
                    ref={ref}
                    href={href}
                    className={cn(
                        linkVariants({ variant, size, underline, className }),
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                >
                    {content}
                </a>
            )
        }

        return (
            <RouterLink
                ref={ref}
                to={href}
                className={cn(
                    linkVariants({ variant, size, underline, className }),
                )}
                {...props}
            >
                {content}
            </RouterLink>
        )
    },
)

Link.displayName = "Link"

export { Link, linkVariants }
