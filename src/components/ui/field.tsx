import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return <fieldset data-slot="field-set" className={cn("flex flex-col gap-6", className)} {...props} />
}

function FieldLegend({ className, variant = "legend", ...props }: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return <legend data-slot="field-legend" data-variant={variant} className={cn("mb-3 font-medium", className)} {...props} />
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-group" className={cn("flex w-full flex-col gap-7", className)} {...props} />
}

function Field({ className, orientation = "vertical", ...props }: React.ComponentProps<"div"> & { orientation?: "vertical" | "horizontal" }) {
  return <div role="group" data-slot="field" data-orientation={orientation} className={cn("flex w-full gap-3", className)} {...props} />
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-content" className={cn("flex flex-1 flex-col gap-1.5 leading-snug", className)} {...props} />
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={cn("flex w-fit gap-2 leading-snug", className)} {...props} />
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-label" className={cn("flex w-fit items-center gap-2 text-sm leading-snug font-medium", className)} {...props} />
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="field-description" className={cn("text-muted-foreground text-sm leading-normal font-normal", className)} {...props} />
}

function FieldError({ className, children, errors, ...props }: React.ComponentProps<"div"> & { errors?: Array<{ message?: string } | undefined> }) {
  const content = useMemo(() => {
    if (children) return children
    if (!errors?.length) return null
    return errors[0]?.message || null
  }, [children, errors])
  if (!content) return null
  return <div role="alert" data-slot="field-error" className={cn("text-destructive text-sm font-normal", className)} {...props}>{content}</div>
}

export { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldLegend, FieldSeparator, FieldSet, FieldContent, FieldTitle }
