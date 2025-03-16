"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type ConversionFormat, sourceFormats, targetFormatMap } from "@/lib/conversion-service"

interface SettingsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  indentSize: number
  fontSize: number
  wrapLines: boolean
  preserveCase: boolean
  sourceFormat: ConversionFormat
  targetFormat: ConversionFormat
  theme: string
  syntaxTheme: string
  onIndentSizeChange: (value: number) => void
  onFontSizeChange: (value: number) => void
  onWrapLinesChange: (value: boolean) => void
  onPreserveCaseChange: (value: boolean) => void
  onSourceFormatChange: (value: ConversionFormat) => void
  onTargetFormatChange: (value: ConversionFormat) => void
  onThemeChange: (value: string) => void
  onSyntaxThemeChange: (value: string) => void
}

export function SettingsDrawer({
  open,
  onOpenChange,
  indentSize,
  fontSize,
  wrapLines,
  preserveCase,
  sourceFormat,
  targetFormat,
  theme,
  syntaxTheme,
  onIndentSizeChange,
  onFontSizeChange,
  onWrapLinesChange,
  onPreserveCaseChange,
  onSourceFormatChange,
  onTargetFormatChange,
  onThemeChange,
  onSyntaxThemeChange,
}: SettingsDrawerProps) {
  const targetOptions = targetFormatMap[sourceFormat] || []

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="uppercase">SETTINGS</DrawerTitle>
          <DrawerDescription className="uppercase">CUSTOMIZE YOUR CONVERSION OPTIONS</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-2 max-h-[60vh] overflow-y-auto">
          <Tabs defaultValue="format" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="format" className="uppercase">
                FORMAT
              </TabsTrigger>
              <TabsTrigger value="appearance" className="uppercase">
                APPEARANCE
              </TabsTrigger>
              <TabsTrigger value="theme" className="uppercase">
                THEME
              </TabsTrigger>
            </TabsList>

            <TabsContent value="format" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="indent-size" className="uppercase">
                  INDENT SIZE: {indentSize}
                </Label>
                <Slider
                  id="indent-size"
                  min={0}
                  max={8}
                  step={1}
                  value={[indentSize]}
                  onValueChange={(value) => onIndentSizeChange(value[0])}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="uppercase">SOURCE FORMAT</Label>
                <RadioGroup value={sourceFormat} onValueChange={onSourceFormatChange}>
                  {sourceFormats.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`source-${option.value}`} />
                      <Label htmlFor={`source-${option.value}`} className="uppercase">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="uppercase">TARGET FORMAT</Label>
                <RadioGroup value={targetFormat} onValueChange={onTargetFormatChange}>
                  {targetOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`target-${option.value}`} />
                      <Label htmlFor={`target-${option.value}`} className="uppercase">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="font-size" className="uppercase">
                  FONT SIZE: {fontSize}px
                </Label>
                <Slider
                  id="font-size"
                  min={10}
                  max={24}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => onFontSizeChange(value[0])}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="wrap-lines" checked={wrapLines} onCheckedChange={onWrapLinesChange} />
                <Label htmlFor="wrap-lines" className="uppercase">
                  WRAP LINES
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="preserve-case" checked={preserveCase} onCheckedChange={onPreserveCaseChange} />
                <Label htmlFor="preserve-case" className="uppercase">
                  PRESERVE CASE IN CODE
                </Label>
              </div>
            </TabsContent>

            <TabsContent value="theme" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="uppercase">APPLICATION THEME</Label>
                <RadioGroup value={theme} onValueChange={onThemeChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light-theme" />
                    <Label htmlFor="light-theme" className="uppercase">
                      LIGHT
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark-theme" />
                    <Label htmlFor="dark-theme" className="uppercase">
                      DARK
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system-theme" />
                    <Label htmlFor="system-theme" className="uppercase">
                      SYSTEM
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="uppercase">SYNTAX HIGHLIGHTING THEME</Label>
                <RadioGroup value={syntaxTheme} onValueChange={onSyntaxThemeChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="auto" id="auto-syntax" />
                    <Label htmlFor="auto-syntax" className="uppercase">
                      AUTO (MATCH SYSTEM)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light-syntax" />
                    <Label htmlFor="light-syntax" className="uppercase">
                      LIGHT
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark-syntax" />
                    <Label htmlFor="dark-syntax" className="uppercase">
                      DARK
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vs" id="vs-syntax" />
                    <Label htmlFor="vs-syntax" className="uppercase">
                      VISUAL STUDIO
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Save</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

