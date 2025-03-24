"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Copy, ArrowDownUp } from "lucide-react"
import { MorseCodePlayer } from "./morse-code-player"
import { textToMorse, morseToText, isValidMorse } from "@/lib/conversion-service"
import { useToast } from "@/hooks/use-toast"

export function MorseCodeTranslator() {
  const [text, setText] = useState("")
  const [morse, setMorse] = useState("")
  const [activeTab, setActiveTab] = useState<"text-to-morse" | "morse-to-text">("text-to-morse")
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [wordSeparator, setWordSeparator] = useState(" / ")
  const { toast } = useToast()

  // Auto-translate when text changes if autoTranslate is enabled
  useEffect(() => {
    if (autoTranslate) {
      handleTranslate()
    }
  }, [text, activeTab, autoTranslate, wordSeparator])

  const handleTranslate = () => {
    if (activeTab === "text-to-morse" && text) {
      setMorse(textToMorse(text, { wordSeparator }))
    } else if (activeTab === "morse-to-text" && morse) {
      if (isValidMorse(morse)) {
        setText(morseToText(morse))
      } else {
        toast({
          title: "Invalid Morse Code",
          description: "The input contains characters that are not valid Morse code.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSwap = () => {
    setActiveTab(activeTab === "text-to-morse" ? "morse-to-text" : "text-to-morse")
    // Swap the content of text and morse
    const tempText = text
    setText(morse)
    setMorse(tempText)
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Morse Code Translator</CardTitle>
        <CardDescription>Translate between text and Morse code</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "text-to-morse" | "morse-to-text")}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="text-to-morse">Text to Morse</TabsTrigger>
              <TabsTrigger value="morse-to-text">Morse to Text</TabsTrigger>
            </TabsList>

            <Button variant="outline" size="icon" onClick={handleSwap}>
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent value="text-to-morse" className="space-y-4">
            <div>
              <Label htmlFor="text-input">Text</Label>
              <div className="flex mt-1.5">
                <Textarea
                  id="text-input"
                  placeholder="Enter text to convert to Morse code..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[100px] font-mono"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 self-start"
                  onClick={() => handleCopy(text)}
                  disabled={!text}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="morse-output">Morse Code</Label>
              <div className="flex mt-1.5">
                <Textarea id="morse-output" value={morse} readOnly className="min-h-[100px] font-mono" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 self-start"
                  onClick={() => handleCopy(morse)}
                  disabled={!morse}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {morse && <MorseCodePlayer morseCode={morse} />}
          </TabsContent>

          <TabsContent value="morse-to-text" className="space-y-4">
            <div>
              <Label htmlFor="morse-input">Morse Code</Label>
              <div className="flex mt-1.5">
                <Textarea
                  id="morse-input"
                  placeholder="Enter Morse code to convert to text..."
                  value={morse}
                  onChange={(e) => setMorse(e.target.value)}
                  className="min-h-[100px] font-mono"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 self-start"
                  onClick={() => handleCopy(morse)}
                  disabled={!morse}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="text-output">Text</Label>
              <div className="flex mt-1.5">
                <Textarea id="text-output" value={text} readOnly className="min-h-[100px] font-mono" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 self-start"
                  onClick={() => handleCopy(text)}
                  disabled={!text}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {morse && <MorseCodePlayer morseCode={morse} />}
          </TabsContent>
        </Tabs>

        <div className="flex items-center space-x-2 mt-4">
          <Switch id="auto-translate" checked={autoTranslate} onCheckedChange={setAutoTranslate} />
          <Label htmlFor="auto-translate">Auto-translate</Label>

          {!autoTranslate && (
            <Button
              onClick={handleTranslate}
              className="ml-auto"
              disabled={(activeTab === "text-to-morse" && !text) || (activeTab === "morse-to-text" && !morse)}
            >
              Translate
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="text-sm text-muted-foreground mb-2">
          <strong>Morse Code Guide:</strong> Use dots (.) for short signals, dashes (-) for long signals, spaces for
          separating characters, and slashes (/) for separating words.
        </div>
        <div className="text-xs text-muted-foreground">Example: "SOS" in Morse code is "... --- ..."</div>
      </CardFooter>
    </Card>
  )
}

