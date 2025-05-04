"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { HistoryItem } from "@/lib/history-manager"
import { RotateCcw, Trash2 } from "lucide-react"

interface HistoryDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  history: HistoryItem[]
  onLoadHistory: (item: HistoryItem) => void
  onDeleteHistoryItem: (id: string, e: React.MouseEvent) => void
  onClearHistory: () => void
}

export function HistoryDrawer({
  open,
  onOpenChange,
  history,
  onLoadHistory,
  onDeleteHistoryItem,
  onClearHistory,
}: HistoryDrawerProps) {
  // Function to truncate text for display with responsive length
  const truncateText = (text: string, maxLength = window.innerWidth < 768 ? 300 : 500) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="uppercase">CONVERSION HISTORY</DrawerTitle>
          <DrawerDescription className="uppercase">CLICK ON AN ITEM TO LOAD IT</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-2 max-h-[60vh] overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="uppercase">NO HISTORY ITEMS YET</p>
              <p className="text-xs mt-2 uppercase">SUCCESSFUL CONVERSIONS WILL BE SAVED HERE</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="border p-3 rounded-sm cursor-pointer hover:bg-accent"
                  onClick={() => onLoadHistory(item)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className="uppercase">
                      {item.sourceFormat.toUpperCase()} TO{" "}
                      {item.targetFormats.length > 1
                        ? `${item.targetFormats.length} FORMATS`
                        : item.targetFormats[0]?.toUpperCase()}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => onDeleteHistoryItem(item.id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onLoadHistory(item)}>
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{new Date(item.timestamp).toLocaleString()}</div>

                  <div className="grid grid-cols-1 gap-2 mb-2">
                    <div>
                      <Label className="text-xs uppercase mb-1 block">INPUT</Label>
                      <div className="text-xs border p-2 bg-muted/50 h-20 overflow-hidden text-ellipsis whitespace-nowrap">
                        {truncateText(item.input)}
                      </div>
                    </div>
                  </div>

                  {item.targetFormats.length > 1 ? (
                    <div>
                      <Label className="text-xs uppercase mb-1 block">OUTPUTS</Label>
                      <Tabs defaultValue={item.targetFormats[0]} className="w-full">
                        <TabsList className="w-full mb-2">
                          {item.targetFormats.map((format) => (
                            <TabsTrigger key={format} value={format} className="uppercase text-xs">
                              {format}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {item.targetFormats.map((format) => (
                          <TabsContent key={format} value={format}>
                            <div className="text-xs border p-2 bg-muted/50 h-20 overflow-hidden text-ellipsis whitespace-nowrap">
                              {truncateText(item.outputs[format] || "")}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  ) : (
                    <div>
                      <Label className="text-xs uppercase mb-1 block">OUTPUT</Label>
                      <div className="text-xs border p-2 bg-muted/50 h-20 overflow-hidden text-ellipsis whitespace-nowrap">
                        {truncateText(item.outputs[item.targetFormats[0]] || "")}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <DrawerFooter className="flex flex-row justify-between items-center">
          <Button variant="destructive" onClick={onClearHistory} disabled={history.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            CLEAR ALL
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">CLOSE</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
