"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { useMediaQuery } from "@/hooks/use-mobile"
import { useTheme } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { type ConversionFormat, convertData, sourceFormats, targetFormatMap } from "@/lib/conversion-service"
import { type HistoryItem, clearHistory, deleteHistoryItem, saveToHistory } from "@/lib/history-manager"
import { ConverterHeader } from "./converter/converter-header"
import { InputPanel } from "./converter/input-panel"
import { OutputPanel } from "./converter/output-panel"
import { ConverterFooter } from "./converter/converter-footer"
import { SettingsDrawer } from "./converter/settings-drawer"
import { HelpDrawer } from "./converter/help-drawer"
import { HistoryDrawer } from "./converter/history-drawer"
import JSZip from "jszip"
import FileSaver from "file-saver"

// Add useEffect to load history from localStorage on component mount
// and update localStorage whenever history changes
// Add this after the existing imports

// Update the VERSION constant to reflect the new branding
const VERSION = "1.2.0"

export default function DataConverter({
  onFullscreenChange,
}: {
  onFullscreenChange?: (isFullscreen: boolean) => void
}) {
  const { toast } = useToast()
  const [input, setInput] = useState("")
  const [outputs, setOutputs] = useState<Record<ConversionFormat, string>>({
    json: "",
    xml: "",
    yaml: "",
    csv: "",
    tsv: "",
    sql: "",
    protobuf: "",
    avro: "",
    excel: "",
    plaintext: "",
    html: "",
    parquet: "",
    markdown: "",
    morse: "",
  })
  const [sourceFormat, setSourceFormat] = useState<ConversionFormat>("json")
  const [targetFormats, setTargetFormats] = useState<ConversionFormat[]>(["xml"])
  const [activeTargetFormat, setActiveTargetFormat] = useState<ConversionFormat>("xml")
  const [targetOptions, setTargetOptions] = useState(targetFormatMap.json)
  const [indentSize, setIndentSize] = useState(2)
  const [fontSize, setFontSize] = useState(14)
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const { theme = "system", setTheme } = useTheme()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  // Update the wrapLines state to be true by default
  const [wrapLines, setWrapLines] = useState(true)
  const [preserveCase, setPreserveCase] = useState(true)
  const [syntaxTheme, setSyntaxTheme] = useState("auto")
  const [helpOpen, setHelpOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  const containerRef = useRef(null)
  const [historyOpen, setHistoryOpen] = useState(false)

  // Update the history state initialization to load from localStorage if available
  // Replace the existing history state declaration:
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedHistory = localStorage.getItem("morph_conversion_history")
        return savedHistory ? JSON.parse(savedHistory) : []
      } catch (error) {
        console.error("Failed to load history from localStorage:", error)
        return []
      }
    }
    return []
  })

  // Resize state
  const [containerSize, setContainerSize] = useState({ width: "90%", height: "80vh" })
  const [isResizing, setIsResizing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const originalSizeRef = useRef({ width: "90%", height: "80vh" })

  // Function to copy text to clipboard
  const copyToClipboard = (format: ConversionFormat) => {
    navigator.clipboard.writeText(outputs[format] || "")
    toast({
      title: "COPIED TO CLIPBOARD",
      description: `${format.toUpperCase()} content copied`,
      variant: "default",
    })
  }

  // Update target options when source format changes
  useEffect(() => {
    setTargetOptions(targetFormatMap[sourceFormat] || [])
    if (targetFormatMap[sourceFormat]?.length > 0) {
      // Reset target formats when source format changes
      setTargetFormats([targetFormatMap[sourceFormat][0].value as ConversionFormat])
      setActiveTargetFormat(targetFormatMap[sourceFormat][0].value as ConversionFormat)
    } else {
      setTargetFormats([])
      setActiveTargetFormat("" as ConversionFormat)
    }
  }, [sourceFormat])

  // Handle resize events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const container = containerRef.current as HTMLElement
      const rect = container.getBoundingClientRect()

      // Calculate new width and height
      const newWidth = Math.max(600, e.clientX - rect.left + 10)
      const newHeight = Math.max(400, e.clientY - rect.top + 10)

      setContainerSize({
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    const newFullscreenState = !isFullscreen
    if (newFullscreenState) {
      originalSizeRef.current = containerSize
      setContainerSize({ width: "95vw", height: "95vh" })
    } else {
      setContainerSize(originalSizeRef.current)
    }
    setIsFullscreen(newFullscreenState)

    // Notify parent component about fullscreen state change
    if (onFullscreenChange) {
      onFullscreenChange(newFullscreenState)
    }
  }

  // Swap source and target formats
  const swapFormats = () => {
    // For simplicity, we'll just swap with the first selected target format
    if (targetFormats.length > 0 && sourceFormats.some((f) => f.value === targetFormats[0])) {
      const newSource = targetFormats[0]
      const newTarget = sourceFormat

      setSourceFormat(newSource)
      // Target will be updated by the useEffect

      // Clear output when swapping
      setOutputs({
        json: "",
        xml: "",
        yaml: "",
        csv: "",
        tsv: "",
        sql: "",
        protobuf: "",
        avro: "",
        excel: "",
        plaintext: "",
        html: "",
        parquet: "",
        markdown: "",
        morse: "",
      })

      toast({
        title: "FORMATS SWAPPED",
        description: `Now converting ${newSource.toUpperCase()} to ${newTarget.toUpperCase()}`,
        variant: "default",
      })
    } else {
      toast({
        title: "CANNOT SWAP FORMATS",
        description: `Selected target format cannot be used as a source format`,
        variant: "destructive",
      })
    }
  }

  const handleLoadFromHistory = (item: HistoryItem) => {
    setSourceFormat(item.sourceFormat)
    setTargetFormats(item.targetFormats)
    setActiveTargetFormat(item.targetFormats[0])
    setInput(item.input)

    // Set all outputs
    setOutputs({
      ...{
        json: "",
        xml: "",
        yaml: "",
        csv: "",
        tsv: "",
        sql: "",
        protobuf: "",
        avro: "",
        excel: "",
        plaintext: "",
        html: "",
        parquet: "",
        markdown: "",
        morse: "",
      },
      ...item.outputs,
    })

    setHistoryOpen(false)

    toast({
      title: "LOADED FROM HISTORY",
      description: `Loaded ${item.sourceFormat.toUpperCase()} conversion with ${item.targetFormats.length} format(s)`,
      variant: "default",
    })
  }

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setHistory((prev) => deleteHistoryItem(prev, id))

    toast({
      title: "HISTORY ITEM DELETED",
      variant: "default",
    })
  }

  // Update the handleClearAllHistory function to also clear localStorage
  const handleClearAllHistory = () => {
    setHistory(clearHistory())
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("morph_conversion_history")
      } catch (error) {
        console.error("Failed to clear history from localStorage:", error)
      }
    }
    toast({
      title: "HISTORY CLEARED",
      variant: "default",
    })
  }

  // Convert data based on selected format
  const handleConvertData = async () => {
    if (targetFormats.length === 0) {
      toast({
        title: "NO TARGET FORMAT SELECTED",
        description: "Please select at least one target format",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)

    // Simulate processing
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 10
      })
    }, 50)

    try {
      // Convert to all selected formats
      const newOutputs = { ...outputs }
      let conversionCount = 0

      for (const format of targetFormats) {
        const result = await convertData(input, sourceFormat, format, indentSize)

        if (result.success) {
          newOutputs[format] = result.result
          conversionCount++
        } else {
          toast({
            title: `CONVERSION TO ${format.toUpperCase()} FAILED`,
            description: result.error,
            variant: "destructive",
          })
        }
      }

      // Update outputs state
      setOutputs(newOutputs)

      // Set active target format to the first successful conversion
      const firstSuccessfulFormat = targetFormats.find((format) => newOutputs[format])
      if (firstSuccessfulFormat) {
        setActiveTargetFormat(firstSuccessfulFormat)
      }

      // Save to history with all successful conversions
      if (conversionCount > 0) {
        // Filter to only include successful target formats
        const successfulFormats = targetFormats.filter((format) => newOutputs[format])
        setHistory((prev) => saveToHistory(prev, input, newOutputs, sourceFormat, successfulFormats))
      }

      setTimeout(() => {
        setIsProcessing(false)
        setProgress(100)

        if (conversionCount > 0) {
          toast({
            title: "CONVERSION COMPLETE",
            description: `Successfully converted to ${conversionCount} format${conversionCount > 1 ? "s" : ""}`,
            variant: "default",
          })
        }
      }, 600)
    } catch (err) {
      setOutputs({
        json: "",
        xml: "",
        yaml: "",
        csv: "",
        tsv: "",
        sql: "",
        protobuf: "",
        avro: "",
        excel: "",
        plaintext: "",
        html: "",
        parquet: "",
        markdown: "",
        morse: "",
      })
      setIsProcessing(false)
      setProgress(0)
      toast({
        title: "CONVERSION FAILED",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  // Download output as file
  const downloadOutput = (format?: ConversionFormat) => {
    if (format) {
      // Download single format
      const output = outputs[format]
      if (!output) return

      // Map format to appropriate file extension
      const getFileExtension = (format: ConversionFormat) => {
        switch (format) {
          case "plaintext":
            return "txt"
          case "excel":
            return "xlsx"
          case "protobuf":
            return "proto"
          case "markdown":
            return "md"
          case "parquet":
            return "parquet"
          default:
            return format
        }
      }

      const fileExtension = getFileExtension(format)
      const element = document.createElement("a")
      const file = new Blob([output], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `converted.${fileExtension}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: "FILE DOWNLOADED",
        description: `Saved as converted.${fileExtension}`,
        variant: "default",
      })
    } else {
      // Download all formats as zip
      const zip = new JSZip()
      let hasFiles = false

      targetFormats.forEach((format) => {
        const output = outputs[format]
        if (output) {
          // Map format to appropriate file extension for zip files too
          const getFileExtension = (format: ConversionFormat) => {
            switch (format) {
              case "plaintext":
                return "txt"
              case "excel":
                return "xlsx"
              case "protobuf":
                return "proto"
              case "markdown":
                return "md"
              case "parquet":
                return "parquet"
              default:
                return format
            }
          }

          const fileExtension = getFileExtension(format)
          zip.file(`converted.${fileExtension}`, output)
          hasFiles = true
        }
      })

      if (hasFiles) {
        zip.generateAsync({ type: "blob" }).then((content) => {
          FileSaver.saveAs(content, "converted_files.zip")

          toast({
            title: "FILES DOWNLOADED",
            description: "All formats saved as ZIP archive",
            variant: "default",
          })
        })
      }
    }
  }

  // Reset all fields
  const resetAll = () => {
    setInput("")
    setOutputs({
      json: "",
      xml: "",
      yaml: "",
      csv: "",
      tsv: "",
      sql: "",
      protobuf: "",
      avro: "",
      excel: "",
      plaintext: "",
      html: "",
      parquet: "",
      markdown: "",
      morse: "",
    })
    toast({
      title: "FIELDS CLEARED",
      variant: "default",
    })
  }

  // Handle file upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setInput(event.target.result as string)
        toast({
          title: "FILE UPLOADED",
          description: file.name,
          variant: "default",
        })
      }
    }
    reader.readAsText(file)
  }

  // Toggle theme
  const toggleTheme = () => {
    const currentTheme = theme || "system"
    const nextTheme = currentTheme === "dark" ? "light" : currentTheme === "light" ? "system" : "dark"
    setTheme(nextTheme)
  }

  // Handle tab change
  const handleTabChange = (format: ConversionFormat) => {
    setActiveTargetFormat(format)
  }

  // Adjust font size based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // For mobile devices, use a smaller font size
        setFontSize((prevSize) => Math.min(prevSize, 12))
      } else {
        // Reset to default for larger screens if it was reduced
        if (fontSize < 14) {
          setFontSize(14)
        }
      }
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [fontSize])

  // Add this effect after the other useEffect hooks to save history to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined" && history.length > 0) {
      try {
        localStorage.setItem("morph_conversion_history", JSON.stringify(history))
      } catch (error) {
        console.error("Failed to save history to localStorage:", error)
        // Optionally show a toast notification about the failure
        toast({
          title: "Failed to save history",
          description: "Your conversion history couldn't be saved to local storage.",
          variant: "destructive",
        })
      }
    }
  }, [history])

  return (
    <TooltipProvider>
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <Card
          ref={containerRef}
          className={`w-full pointer-events-auto overflow-hidden relative shadow-2xl`}
          style={{
            width: containerSize.width,
            height: containerSize.height,
            maxWidth: isFullscreen ? "95vw" : isMobile ? "95%" : isTablet ? "90%" : "6xl",
            transition: "width 0.2s, height 0.2s, transform 0.3s, box-shadow 0.3s",
            borderRadius: "0px",
            transform: "translateY(-4px)",
            boxShadow: isDark
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)"
              : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Resize handle */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
            onMouseDown={() => setIsResizing(true)}
            style={{
              backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
              backgroundPosition: "bottom right",
              padding: "10px",
              transform: "translate(5px, 5px)",
            }}
          />

          <div className="flex flex-col h-full">
            {/* Header */}
            <ConverterHeader
              sourceFormat={sourceFormat}
              targetFormat={activeTargetFormat}
              version={VERSION}
              isFullscreen={isFullscreen}
              onHelpClick={() => setHelpOpen(true)}
              onSettingsClick={() => setSettingsOpen(true)}
              onFullscreenToggle={toggleFullscreen}
            />

            {/* Main Content */}
            <div className={`flex ${isMobile ? "flex-col" : "flex-row"} flex-1 overflow-hidden`}>
              {/* Left Panel - Input */}
              <div className={`${isMobile ? "w-full h-1/2" : "w-1/2 h-full"}`}>
                <InputPanel
                  input={input}
                  sourceFormat={sourceFormat}
                  targetFormat={targetFormats}
                  isProcessing={isProcessing}
                  progress={progress}
                  fontSize={fontSize}
                  onInputChange={setInput}
                  onSourceFormatChange={(value) => setSourceFormat(value as ConversionFormat)}
                  onTargetFormatChange={setTargetFormats}
                  onSwapFormats={swapFormats}
                  onConvert={handleConvertData}
                  onReset={resetAll}
                  onFileUpload={handleFileUpload}
                />
              </div>

              {/* Mobile Separator */}
              {isMobile && <div className="h-2"></div>}

              {/* Right Panel - Output */}
              <div className={`${isMobile ? "w-full h-1/2" : "w-1/2 h-full"}`}>
                <OutputPanel
                  outputs={outputs}
                  activeTargetFormat={activeTargetFormat}
                  targetFormats={targetFormats}
                  fontSize={fontSize}
                  wrapLines={wrapLines}
                  preserveCase={preserveCase}
                  syntaxTheme={syntaxTheme}
                  theme={theme}
                  onCopy={copyToClipboard}
                  onDownload={downloadOutput}
                  onTabChange={handleTabChange}
                  onWrapLinesChange={setWrapLines}
                />
              </div>
            </div>

            {/* Footer */}
            <ConverterFooter
              sourceFormat={sourceFormat}
              targetFormat={activeTargetFormat}
              theme={theme}
              onHistoryClick={() => setHistoryOpen(true)}
              onThemeToggle={toggleTheme}
            />
          </div>
        </Card>

        {/* Drawers */}
        <HelpDrawer open={helpOpen} onOpenChange={setHelpOpen} version={VERSION} />

        <SettingsDrawer
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          indentSize={indentSize}
          fontSize={fontSize}
          wrapLines={wrapLines}
          preserveCase={preserveCase}
          sourceFormat={sourceFormat}
          targetFormat={activeTargetFormat}
          theme={theme}
          syntaxTheme={syntaxTheme}
          onIndentSizeChange={setIndentSize}
          onFontSizeChange={setFontSize}
          onWrapLinesChange={setWrapLines}
          onPreserveCaseChange={setPreserveCase}
          onSourceFormatChange={(value) => setSourceFormat(value as ConversionFormat)}
          onTargetFormatChange={(value) => setTargetFormats([value as ConversionFormat])}
          onThemeChange={setTheme}
          onSyntaxThemeChange={setSyntaxTheme}
        />

        <HistoryDrawer
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          history={history}
          onLoadHistory={handleLoadFromHistory}
          onDeleteHistoryItem={handleDeleteHistoryItem}
          onClearHistory={handleClearAllHistory}
        />

        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "z-50 fixed bottom-0 left-0 right-0 mx-auto mb-4",
            style: {
              maxWidth: "90vw",
              width: "auto",
              bottom: "20px",
              position: "fixed",
            },
          }}
        />
      </div>
    </TooltipProvider>
  )
}
