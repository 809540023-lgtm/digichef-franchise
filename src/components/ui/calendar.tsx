"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("bg-background group/calendar p-3", className)}
      captionLayout={captionLayout}
      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === "left") return <ChevronLeftIcon className="size-4" {...props} />
          if (orientation === "right") return <ChevronRightIcon className="size-4" {...props} />
          return <ChevronDownIcon className="size-4" {...props} />
        },
        ...components,
      }}
      {...props}
    />
  )
}

export { Calendar }
