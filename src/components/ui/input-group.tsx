"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-group" role="group" className={cn("border-input relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none h-9", className)} {...props} />
  )
}

function InputGroupAddon({ className, align = "inline-start", ...props }: React.ComponentProps<"div"> & { align?: string }) {
  return (
    <div data-slot="input-group-addon" data-align={align} className={cn("text-muted-foreground flex h-auto items-center justify-center gap-2 text-sm", className)} {...props} />
  )
}

function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return <Input data-slot="input-group-control" className={cn("flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0", className)} {...props} />
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("text-muted-foreground flex items-center gap-2 text-sm", className)} {...props} />
}

export { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText }
