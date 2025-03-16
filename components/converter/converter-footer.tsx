"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ConversionFormat } from "@/lib/conversion-service"
import { History, Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface ConverterFooterProps {
  sourceFormat: ConversionFormat
  targetFormat: ConversionFormat
  theme: string
  onHistoryClick: () => void
  onThemeToggle: () => void
}

export function ConverterFooter({
  sourceFormat,
  targetFormat,
  theme,
  onHistoryClick,
  onThemeToggle,
}: ConverterFooterProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <TooltipProvider>
      <div className="border-t p-2 flex justify-between items-center transition-colors duration-300">
        <div>
          <Badge variant="outline" className="uppercase text-xs sm:text-sm transition-colors duration-300">
            {sourceFormat.toUpperCase()} TO {targetFormat.toUpperCase()}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onHistoryClick} className="transition-colors duration-300">
                <History className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="uppercase">CONVERSION HISTORY</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onThemeToggle} className="transition-colors duration-300">
                {mounted && (
                  <>
                    {theme === "system" ? (
                      <Laptop className="h-4 w-4" />
                    ) : theme === "dark" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="uppercase">CYCLE THEME: {mounted ? theme.toUpperCase() : "SYSTEM"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}

