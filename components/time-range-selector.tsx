"use client"

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

interface TimeRangeSelectorProps {
  currentRange: string
  basePath: string
}

export function TimeRangeSelector({ currentRange, basePath }: TimeRangeSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const ranges = [
    { value: "short_term", label: "Last 4 Weeks" },
    { value: "medium_term", label: "Last 6 Months" },
    { value: "long_term", label: "All Time" },
  ]

  const handleRangeChange = (range: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("range", range)
    router.push(`${basePath}?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={currentRange === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleRangeChange(range.value)}
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
}
