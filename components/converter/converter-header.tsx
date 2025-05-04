"use client"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronRight, Info, Maximize2, Minimize2, Settings } from "lucide-react"
import type { ConversionFormat } from "@/lib/conversion-service"

interface ConverterHeaderProps {
  sourceFormat: ConversionFormat
  targetFormat: ConversionFormat
  version: string
  isFullscreen: boolean
  onHelpClick: () => void
  onSettingsClick: () => void
  onFullscreenToggle: () => void
}

export function ConverterHeader({
  sourceFormat,
  targetFormat,
  version,
  isFullscreen,
  onHelpClick,
  onSettingsClick,
  onFullscreenToggle,
}: ConverterHeaderProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between p-2 border-b transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="uppercase text-xs sm:text-sm">
                  MORPH
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="uppercase text-xs sm:text-sm">
                  {sourceFormat.toUpperCase()} TO {targetFormat.toUpperCase()}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Badge variant="outline" className="uppercase text-xs sm:text-sm transition-colors duration-300 mr-1 sm:mr-0">
            v{version}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onHelpClick} className="transition-colors duration-300">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="uppercase">HELP</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onSettingsClick}
                className="transition-colors duration-300"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="uppercase">SETTINGS</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onFullscreenToggle}
                className="transition-colors duration-300"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="uppercase">{isFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
