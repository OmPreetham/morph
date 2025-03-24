"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import type { ConversionFormat } from "@/lib/conversion-service"
import { Check, ChevronDown, Copy, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow, prism, vs } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useRef, useState, useEffect } from "react"

// Add onWrapLinesChange to the interface
interface OutputPanelProps {
  outputs: Record<ConversionFormat, string>
  activeTargetFormat: ConversionFormat
  targetFormats: ConversionFormat[]
  fontSize: number
  wrapLines: boolean
  preserveCase: boolean
  syntaxTheme: "auto" | "light" | "dark" | "vs"
  theme: string
  onCopy: (format: ConversionFormat) => void
  onDownload: (format?: ConversionFormat) => void
  onTabChange: (format: ConversionFormat) => void
  onWrapLinesChange: (value: boolean) => void
}

// Add onWrapLinesChange to the destructured props
export function OutputPanel({
  outputs,
  activeTargetFormat,
  targetFormats,
  fontSize,
  wrapLines,
  preserveCase,
  syntaxTheme,
  theme,
  onCopy,
  onDownload,
  onTabChange,
  onWrapLinesChange,
}: OutputPanelProps) {
  const { resolvedTheme } = useTheme()
  const tabsListRef = useRef<HTMLDivElement>(null)
  const [showNavControls, setShowNavControls] = useState(false)

  // Check if tabs overflow and need navigation controls
  useEffect(() => {
    const checkOverflow = () => {
      if (tabsListRef.current) {
        const { scrollWidth, clientWidth } = tabsListRef.current
        setShowNavControls(scrollWidth > clientWidth && targetFormats.length > 2)
      }
    }

    checkOverflow()
    window.addEventListener("resize", checkOverflow)
    return () => window.removeEventListener("resize", checkOverflow)
  }, [targetFormats])

  // Scroll tabs left or right
  const scrollTabs = (direction: "left" | "right") => {
    if (tabsListRef.current) {
      const container = tabsListRef.current
      const scrollAmount = container.clientWidth / 2
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Get the appropriate language for syntax highlighting
  const getSyntaxLanguage = (format: ConversionFormat) => {
    switch (format) {
      case "json":
        return "json"
      case "xml":
        return "markup"
      case "yaml":
        return "yaml"
      case "csv":
        return "text"
      case "tsv":
        return "text"
      case "sql":
        return "sql"
      case "protobuf":
        return "protobuf"
      case "avro":
        return "json"
      case "excel":
        return "text"
      case "plaintext":
        return "text"
      case "html":
        return "markup"
      case "parquet":
        return "text"
      case "markdown":
        return "markdown"
      case "morse":
        return "text"
      default:
        return "text"
    }
  }

  // Get the current syntax highlighting theme
  const getCurrentSyntaxTheme = () => {
    if (syntaxTheme === "light") return prism
    if (syntaxTheme === "dark") return tomorrow
    if (syntaxTheme === "vs") return vs
    // Auto - based on system theme, with fallback
    return resolvedTheme === "dark" ? tomorrow : prism
  }

  // Format the output text based on user preferences
  const getFormattedOutput = (output: string) => {
    if (!preserveCase) {
      return output.toUpperCase()
    }
    return output
  }

  // Get background color based on theme
  const getOutputBackground = () => {
    if (resolvedTheme === "dark") {
      return "#1e1e1e"
    }
    return "#f5f5f5"
  }

  // Check if there's any output
  const hasOutput = Object.values(outputs).some((output) => output.length > 0)
  const currentOutput = outputs[activeTargetFormat] || ""

  return (
    <TooltipProvider>
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <Label className="uppercase font-bold">OUTPUT</Label>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => onWrapLinesChange(!wrapLines)}>
                  {wrapLines ? (
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2"
                      >
                        <polyline points="3 7 9 7 9 13 3 13 3 7"></polyline>
                        <polyline points="21 7 15 7 15 13 21 13 21 7"></polyline>
                        <line x1="9" y1="10" x2="15" y2="10"></line>
                      </svg>
                      <span className="hidden sm:inline-block uppercase">UNWRAP</span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2"
                      >
                        <polyline points="3 7 9 7 9 13 3 13 3 7"></polyline>
                        <polyline points="21 7 15 7 15 13 21 13 21 7"></polyline>
                        <line x1="9" y1="10" x2="15" y2="10"></line>
                      </svg>
                      <span className="hidden sm:inline-block uppercase">WRAP</span>
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="uppercase">{wrapLines ? "DISABLE LINE WRAPPING" : "ENABLE LINE WRAPPING"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCopy(activeTargetFormat)}
                  disabled={!currentOutput}
                >
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline-block ml-2 uppercase">COPY</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="uppercase">COPY TO CLIPBOARD</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={!hasOutput}>
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline-block ml-2 uppercase">DOWNLOAD</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="uppercase cursor-pointer" onClick={() => onDownload()}>
                  DOWNLOAD ALL
                </DropdownMenuItem>

                {/* Add a separator between "Download All" and individual formats */}
                <DropdownMenuSeparator />

                {targetFormats.map((format) => (
                  <DropdownMenuItem
                    key={format}
                    className="uppercase cursor-pointer"
                    disabled={!outputs[format]}
                    onClick={() => onDownload(format)}
                  >
                    <div className="flex items-center w-full">
                      <div className="w-4 mr-2">{format === activeTargetFormat && <Check className="h-4 w-4" />}</div>
                      {format.toUpperCase()}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="relative mb-2">
          <Tabs value={activeTargetFormat} onValueChange={(value) => onTabChange(value as ConversionFormat)}>
            <div className="flex items-stretch">
              {showNavControls && (
                <button
                  onClick={() => scrollTabs("left")}
                  className="flex-shrink-0 z-10 bg-background/80 backdrop-blur-sm rounded-l-md px-1 border flex items-center"
                  aria-label="Scroll tabs left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}

              <TabsList
                ref={tabsListRef}
                className="w-full overflow-x-auto scrollbar-hide flex"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {targetFormats.map((format) => (
                  <TabsTrigger
                    key={format}
                    value={format}
                    className="uppercase flex-shrink-0"
                    disabled={!outputs[format]}
                  >
                    {format.toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>

              {showNavControls && (
                <button
                  onClick={() => scrollTabs("right")}
                  className="flex-shrink-0 z-10 bg-background/80 backdrop-blur-sm rounded-r-md px-1 border flex items-center"
                  aria-label="Scroll tabs right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </Tabs>
        </div>

        <ScrollArea className="flex-1 border rounded-none" type="scroll" scrollHideDelay={0}>
          <div className={wrapLines ? "w-full" : "min-w-full"}>
            {currentOutput ? (
              <SyntaxHighlighter
                language={getSyntaxLanguage(activeTargetFormat)}
                style={getCurrentSyntaxTheme()}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  minHeight: "100%",
                  backgroundColor: getOutputBackground(),
                  fontSize: window.innerWidth < 768 ? `${fontSize - 2}px` : `${fontSize}px`,
                  whiteSpace: wrapLines ? "pre-wrap" : "pre",
                  wordBreak: wrapLines ? "break-word" : "normal",
                  overflowX: wrapLines ? "hidden" : "auto",
                }}
                wrapLines={wrapLines}
                wrapLongLines={wrapLines}
                codeTagProps={{
                  style: {
                    whiteSpace: wrapLines ? "pre-wrap" : "pre",
                    wordBreak: wrapLines ? "break-word" : "normal",
                  },
                }}
              >
                {getFormattedOutput(currentOutput)}
              </SyntaxHighlighter>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground uppercase italic">
                <div className="text-center mt-8">
                  <p className="text-xs sm:text-sm">CONVERTED OUTPUT WILL APPEAR HERE</p>
                  <p className="text-xs mt-2">SELECT SOURCE AND TARGET FORMATS ABOVE</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  )
}

