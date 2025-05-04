"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { type ConversionFormat, sourceFormats, targetFormatMap } from "@/lib/conversion-service"
import { ArrowRightLeft, Check, ChevronDown, FileUp } from "lucide-react"
import { useRef } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-mobile"

interface InputPanelProps {
  input: string
  sourceFormat: ConversionFormat
  targetFormat: ConversionFormat[]
  isProcessing: boolean
  progress: number
  fontSize: number
  onInputChange: (value: string) => void
  onSourceFormatChange: (value: ConversionFormat) => void
  onTargetFormatChange: (value: ConversionFormat[]) => void
  onSwapFormats: () => void
  onConvert: () => void
  onReset: () => void
  onFileUpload: (file: File) => void
}

export function InputPanel({
  input,
  sourceFormat,
  targetFormat,
  isProcessing,
  progress,
  fontSize,
  onInputChange,
  onSourceFormatChange,
  onTargetFormatChange,
  onSwapFormats,
  onConvert,
  onReset,
  onFileUpload,
}: InputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const targetOptions = targetFormatMap[sourceFormat] || []

  const handleTargetFormatToggle = (format: ConversionFormat) => {
    if (targetFormat.includes(format)) {
      onTargetFormatChange(targetFormat.filter((f) => f !== format))
    } else {
      onTargetFormatChange([...targetFormat, format])
    }
  }

  return (
    <div className={`p-4 ${isMobile ? "p-3" : "p-4"} border-r flex flex-col h-full`}>
      <div className="flex justify-between items-center mb-2">
        <Label className="uppercase font-bold">INPUT</Label>
        <div className="flex gap-2">
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          <Button variant="outline" size="sm" onClick={handleUploadClick}>
            <FileUp className="h-4 w-4 mr-2" />
            <span className="uppercase">UPLOAD</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <span className="uppercase">CLEAR</span>
          </Button>
        </div>
      </div>

      <div className={`grid grid-cols-5 gap-2 mb-2 ${isMobile ? "gap-1" : "gap-2"}`}>
        <div className="col-span-2">
          <Label className="text-xs uppercase mb-1 block">FROM</Label>
          <Select value={sourceFormat} onValueChange={onSourceFormatChange}>
            <SelectTrigger className="uppercase">
              <SelectValue placeholder="SELECT SOURCE" />
            </SelectTrigger>
            <SelectContent>
              {sourceFormats.map((option) => (
                <SelectItem key={option.value} value={option.value} className="uppercase">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end justify-center">
          <Button variant="ghost" size="icon" onClick={onSwapFormats} className="mb-1">
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="col-span-2">
          <Label className="text-xs uppercase mb-1 block">TO</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between uppercase">
                {targetFormat.length === 0
                  ? "SELECT TARGET"
                  : targetFormat.length === 1
                    ? targetFormat[0].toUpperCase()
                    : `${targetFormat.length} FORMATS`}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[var(--radix-dropdown-menu-trigger-width)]"
              align="start"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              {targetOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className="uppercase flex items-center cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault()
                    handleTargetFormatToggle(option.value as ConversionFormat)
                  }}
                >
                  <div className="flex items-center w-full">
                    <div className="w-4 mr-2">
                      {targetFormat.includes(option.value as ConversionFormat) && <Check className="h-4 w-4" />}
                    </div>
                    {option.label}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="PASTE YOUR DATA HERE..."
        className="flex-1 font-mono resize-none text-sm md:text-base"
        style={{ fontSize: isMobile ? `${fontSize - 2}px` : `${fontSize}px` }}
      />

      <div className="mt-2">
        <Button
          onClick={onConvert}
          disabled={!input || isProcessing || targetFormat.length === 0}
          className={`w-full uppercase ${input && !isProcessing ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}`}
          variant={input && !isProcessing ? "default" : "outline"}
        >
          {isProcessing ? "PROCESSING..." : "CONVERT"}
        </Button>

        {isProcessing && <Progress value={progress} className="mt-2" />}
      </div>
    </div>
  )
}
