"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Chart = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: Record<string, any>
    children: React.ComponentProps<"div">["children"]
  }
>(({ children, className, config, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex aspect-video justify-center text-xs", className)}
      {...props}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: Object.entries(config)
            .map(
              ([key, value]) => `
            --color-${key}: ${value.color || value};
          `
            )
            .join(""),
        }}
      />
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-background p-2 shadow-md",
      className
    )}
    {...props}
  />
))
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    active?: boolean
    payload?: Array<any>
    label?: string
    indicator?: "line" | "dot" | "dashed"
    hideLabel?: boolean
    hideIndicator?: boolean
    formatter?: (value: any, name: any, props: any) => React.ReactNode
    labelFormatter?: (label: any, payload: any) => React.ReactNode
    nameKey?: string
    labelKey?: string
  }
>(
  (
    {
      active,
      payload,
      label,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      formatter,
      labelFormatter,
      nameKey,
      labelKey,
      className,
      ...props
    },
    ref
  ) => {
    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
        {...props}
      >
        {!hideLabel && (
          <div className="font-medium">
            {labelFormatter ? labelFormatter(label, payload) : label}
          </div>
        )}
        {payload.map((item, index) => (
          <div
            key={index}
            className="flex w-full items-center justify-between gap-2"
          >
            <div className="flex items-center gap-1.5">
              {!hideIndicator && (
                <div
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-[2px]",
                    indicator === "line" && "w-3 h-0.5",
                    indicator === "dashed" && "w-3 h-0.5 border-dashed border"
                  )}
                  style={{
                    backgroundColor: item.color,
                    borderColor: indicator === "dashed" ? item.color : undefined,
                  }}
                />
              )}
              <span className="text-muted-foreground">
                {nameKey ? item.payload[nameKey] : item.name}
              </span>
            </div>
            <span className="font-mono font-medium tabular-nums text-foreground">
              {formatter ? formatter(item.value, item.name, item) : item.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    payload?: Array<any>
    onMouseEnter?: (data: any, index: number) => void
    onMouseLeave?: (data: any, index: number) => void
    onClick?: (data: any, index: number) => void
    nameKey?: string
    formatter?: (value: any, entry: any) => React.ReactNode
  }
>(({ className, payload, onMouseEnter, onMouseLeave, onClick, nameKey, formatter, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center gap-4", className)}
    {...props}
  >
    {payload?.map((item, index) => (
      <div
        key={index}
        className={cn(
          "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
          onClick && "cursor-pointer"
        )}
        onMouseEnter={() => onMouseEnter?.(item, index)}
        onMouseLeave={() => onMouseLeave?.(item, index)}
        onClick={() => onClick?.(item, index)}
      >
        <div
          className="h-2 w-2 shrink-0 rounded-[2px]"
          style={{
            backgroundColor: item.color,
          }}
        />
        <span className="text-muted-foreground">
          {formatter ? formatter(item.value, item) : nameKey ? item[nameKey] : item.value}
        </span>
      </div>
    ))}
  </div>
))
ChartLegend.displayName = "ChartLegend"

export {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
}
