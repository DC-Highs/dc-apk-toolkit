import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import type React from "react"

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode
    className?: string
}

const H1 = forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <h1
            ref={ref}
            className={cn(
                "scroll-m-20 text-2xl font-semibold tracking-tight lg:text-3xl",
                className,
            )}
            {...props}
        >
            {children}
        </h1>
    ),
)

H1.displayName = "H1"

const H2 = forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <h2
            ref={ref}
            className={cn(
                "scroll-m-20 text-xl font-medium tracking-tight first:mt-0",
                className,
            )}
            {...props}
        >
            {children}
        </h2>
    ),
)

H2.displayName = "H2"

const H3 = forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn(
                "scroll-m-20 text-lg font-medium tracking-tight",
                className,
            )}
            {...props}
        >
            {children}
        </h3>
    ),
)

H3.displayName = "H3"

const H4 = forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <h4
            ref={ref}
            className={cn(
                "scroll-m-20 text-base font-medium tracking-tight",
                className,
            )}
            {...props}
        >
            {children}
        </h4>
    ),
)

H4.displayName = "H4"

const H5 = forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <h5
            ref={ref}
            className={cn(
                "scroll-m-20 text-sm font-medium tracking-tight",
                className,
            )}
            {...props}
        >
            {children}
        </h5>
    ),
)

H5.displayName = "H5"

const H6 = forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <h6
            ref={ref}
            className={cn(
                "scroll-m-20 text-xs font-medium tracking-tight",
                className,
            )}
            {...props}
        >
            {children}
        </h6>
    ),
)

H6.displayName = "H6"

const P = forwardRef<HTMLParagraphElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <p
            ref={ref}
            className={cn(
                "text-sm leading-6 [&:not(:first-child)]:mt-4",
                className,
            )}
            {...props}
        >
            {children}
        </p>
    ),
)

P.displayName = "P"

const Lead = forwardRef<HTMLParagraphElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <p
            ref={ref}
            className={cn(
                "text-base text-muted-foreground font-normal",
                className,
            )}
            {...props}
        >
            {children}
        </p>
    ),
)

Lead.displayName = "Lead"

const Large = forwardRef<HTMLDivElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("text-base font-medium", className)}
            {...props}
        >
            {children}
        </div>
    ),
)

Large.displayName = "Large"

const Small = forwardRef<HTMLElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <small
            ref={ref}
            className={cn("text-xs font-normal leading-none", className)}
            {...props}
        >
            {children}
        </small>
    ),
)

Small.displayName = "Small"

const Muted = forwardRef<HTMLParagraphElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <p
            ref={ref}
            className={cn("text-xs text-muted-foreground", className)}
            {...props}
        >
            {children}
        </p>
    ),
)

Muted.displayName = "Muted"

const Code = forwardRef<HTMLElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <code
            ref={ref}
            className={cn(
                "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-normal",
                className,
            )}
            {...props}
        >
            {children}
        </code>
    ),
)

Code.displayName = "Code"

const Blockquote = forwardRef<HTMLQuoteElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <blockquote
            ref={ref}
            className={cn("mt-6 border-l-2 pl-6 italic", className)}
            {...props}
        >
            {children}
        </blockquote>
    ),
)

Blockquote.displayName = "Blockquote"

const List = forwardRef<HTMLUListElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <ul
            ref={ref}
            className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
            {...props}
        >
            {children}
        </ul>
    ),
)

List.displayName = "List"

const OrderedList = forwardRef<HTMLOListElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <ol
            ref={ref}
            className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)}
            {...props}
        >
            {children}
        </ol>
    ),
)

OrderedList.displayName = "OrderedList"

const ListItem = forwardRef<HTMLLIElement, TypographyProps>(
    ({ className, children, ...props }, ref) => (
        <li ref={ref} className={cn("", className)} {...props}>
            {children}
        </li>
    ),
)

ListItem.displayName = "ListItem"

export const Typography = {
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    P,
    Lead,
    Large,
    Small,
    Muted,
    Code,
    Blockquote,
    List,
    OrderedList,
    ListItem,
}

export {
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    P,
    Lead,
    Large,
    Small,
    Muted,
    Code,
    Blockquote,
    List,
    OrderedList,
    ListItem,
}
