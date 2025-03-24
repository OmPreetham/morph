"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, Github, Globe, Download, Coffee } from "lucide-react"

interface HelpDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  version: string
}

export function HelpDrawer({ open, onOpenChange, version }: HelpDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="mb-2">
          <DrawerTitle className="text-2xl flex items-center gap-2">
            <Info className="h-5 w-5" />
            MORPH - THE WRAP STATION <Badge>v{version}</Badge>
          </DrawerTitle>
          <DrawerDescription>A powerful tool for converting between different data formats</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2 max-h-[65vh] overflow-y-auto">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-4">
              <TabsTrigger value="about" className="uppercase">
                About
              </TabsTrigger>
              <TabsTrigger value="formats" className="uppercase">
                Formats
              </TabsTrigger>
              <TabsTrigger value="usage" className="uppercase">
                Usage
              </TabsTrigger>
              <TabsTrigger value="install" className="uppercase">
                Install
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-medium mb-2">About MORPH</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  MORPH is a powerful data conversion tool designed to help developers, data analysts, and IT
                  professionals transform data between different formats quickly and efficiently.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Built with modern web technologies, MORPH works entirely in your browser, ensuring your data never
                  leaves your device. No server processing, no data collection, just fast and reliable conversions.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-base md:text-lg font-medium mb-2">Key Features</h3>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>Convert between JSON, XML, YAML, and CSV formats</li>
                  <li>Multiple output formats in a single conversion</li>
                  <li>Syntax highlighting for better readability</li>
                  <li>Customizable indentation and formatting options</li>
                  <li>Dark and light themes with auto-detection</li>
                  <li>Conversion history with full data preservation</li>
                  <li>Offline support via Progressive Web App (PWA)</li>
                  <li>Responsive design for desktop and mobile devices</li>
                </ul>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Website</span>
                  </Button>
                </div>
                <Button variant="default" size="sm" className="gap-2">
                  <Coffee className="h-4 w-4" />
                  <span>Support Project</span>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="formats" className="space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-medium mb-2">Supported Formats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border p-3 rounded-sm">
                    <h4 className="font-medium mb-1">JSON</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">JavaScript Object Notation</p>
                    <p className="text-xs mt-2">
                      A lightweight data-interchange format that's easy for humans to read and write and easy for
                      machines to parse and generate.
                    </p>
                  </div>
                  <div className="border p-3 rounded-sm">
                    <h4 className="font-medium mb-1">XML</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Extensible Markup Language</p>
                    <p className="text-xs mt-2">
                      A markup language that defines a set of rules for encoding documents in a format that is both
                      human-readable and machine-readable.
                    </p>
                  </div>
                  <div className="border p-3 rounded-sm">
                    <h4 className="font-medium mb-1">YAML</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">YAML Ain't Markup Language</p>
                    <p className="text-xs mt-2">
                      A human-friendly data serialization standard for all programming languages, often used for
                      configuration files.
                    </p>
                  </div>
                  <div className="border p-3 rounded-sm">
                    <h4 className="font-medium mb-1">CSV</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Comma-Separated Values</p>
                    <p className="text-xs mt-2">
                      A simple file format used to store tabular data, such as a spreadsheet or database, where each
                      line is a data record.
                    </p>
                  </div>
                  <div className="border p-3 rounded-sm">
                    <h4 className="font-medium mb-1">Morse Code</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">International Telegraph Code</p>
                    <p className="text-xs mt-2">
                      A method of encoding text characters as standardized sequences of dots and dashes, used
                      historically for telegraph communication.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-base md:text-lg font-medium mb-2">Format Compatibility</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Source</th>
                        <th className="text-left py-2">Target</th>
                        <th className="text-left py-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">JSON</td>
                        <td className="py-2">XML, YAML, CSV</td>
                        <td className="py-2">CSV requires array of objects</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">XML</td>
                        <td className="py-2">JSON</td>
                        <td className="py-2">Preserves structure</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">YAML</td>
                        <td className="py-2">JSON</td>
                        <td className="py-2">Full compatibility</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">CSV</td>
                        <td className="py-2">JSON</td>
                        <td className="py-2">Converts to array of objects</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Plaintext</td>
                        <td className="py-2">Morse</td>
                        <td className="py-2">Character-by-character conversion</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Morse</td>
                        <td className="py-2">Plaintext</td>
                        <td className="py-2">Decodes Morse to readable text</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">JSON/XML/YAML</td>
                        <td className="py-2">Morse</td>
                        <td className="py-2">Converts to string first</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-medium mb-2">How to Use</h3>
                <ol className="space-y-2 list-decimal list-inside text-sm">
                  <li>Select your source format from the "FROM" dropdown</li>
                  <li>Select one or more target formats from the "TO" dropdown</li>
                  <li>Paste or upload your data in the input panel</li>
                  <li>Click the "CONVERT" button to transform your data</li>
                  <li>Use the tabs to switch between different output formats</li>
                  <li>Copy or download individual formats or all formats as a ZIP</li>
                </ol>
              </div>

              <Separator />

              <div>
                <h3 className="text-base md:text-lg font-medium mb-2">Keyboard Shortcuts</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="font-medium">CTRL+ENTER</div>
                  <div>Convert Data</div>
                  <div className="font-medium">CTRL+C</div>
                  <div>Copy Output</div>
                  <div className="font-medium">CTRL+S</div>
                  <div>Download Output</div>
                  <div className="font-medium">CTRL+U</div>
                  <div>Upload File</div>
                  <div className="font-medium">CTRL+H</div>
                  <div>Show History</div>
                  <div className="font-medium">CTRL+,</div>
                  <div>Open Settings</div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-base md:text-lg font-medium mb-2">Tips</h3>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>Use the swap button to quickly reverse conversion direction</li>
                  <li>Select multiple target formats to convert to several formats at once</li>
                  <li>Adjust indent size in settings for better readability</li>
                  <li>Toggle line wrapping for long content</li>
                  <li>Use fullscreen mode for larger conversions</li>
                  <li>History saves all your conversions with full data</li>
                  <li>Install as a PWA for offline use</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="install" className="space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-medium mb-2">Install as App</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                  MORPH can be installed as a Progressive Web App (PWA) on your device for offline use and a more
                  app-like experience.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-3 rounded-sm">
                    <h4 className="font-medium mb-1">Desktop</h4>
                    <ol className="space-y-1 list-decimal list-inside text-sm">
                      <li>Open Chrome or Edge browser</li>
                      <li>Click the install icon in the address bar</li>
                      <li>Follow the prompts to install</li>
                      <li>MORPH will appear in your applications</li>
                    </ol>
                  </div>

                  <div className="border p-3 rounded-sm">
                    <h4 className="font-medium mb-1">Mobile</h4>
                    <ol className="space-y-1 list-decimal list-inside text-sm">
                      <li>Open in Safari (iOS) or Chrome (Android)</li>
                      <li>Tap the share button</li>
                      <li>Select "Add to Home Screen"</li>
                      <li>MORPH will appear on your home screen</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <Button variant="default" size="lg" className="gap-2">
                  <Download className="h-4 w-4" />
                  <span>Install MORPH</span>
                </Button>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  This button will appear if installation is available on your device
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-base md:text-lg font-medium mb-2">Offline Capabilities</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Once installed, MORPH works completely offline. All conversions happen in your browser, and no
                  internet connection is required. Your data never leaves your device.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img src="/logo.jpg" alt="MORPH App Icon" className="w-16 h-16 rounded-lg border" />
                </div>
                <p className="text-xs sm:text-sm text-center text-muted-foreground mt-2">MORPH PWA Icon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DrawerFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

