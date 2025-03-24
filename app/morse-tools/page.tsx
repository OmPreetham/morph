"use client"

import { useState } from "react"
import { MorseCodeTranslator } from "@/components/morse-code-translator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MorseToolsPage() {
  const [activeTab, setActiveTab] = useState("translator")

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Morse Code Tools</h1>

      <Tabs
        defaultValue="translator"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-4xl mx-auto"
      >
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="translator">Translator</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
          <TabsTrigger value="about">About Morse Code</TabsTrigger>
        </TabsList>

        <TabsContent value="translator">
          <MorseCodeTranslator />
        </TabsContent>

        <TabsContent value="reference">
          <Card>
            <CardHeader>
              <CardTitle>Morse Code Reference</CardTitle>
              <CardDescription>Complete reference table for Morse code characters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="font-bold mb-2">Letters</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ["A", ".-"],
                        ["B", "-..."],
                        ["C", "-.-."],
                        ["D", "-.."],
                        ["E", "."],
                        ["F", "..-."],
                        ["G", "--."],
                        ["H", "...."],
                        ["I", ".."],
                        ["J", ".---"],
                        ["K", "-.-"],
                        ["L", ".-.."],
                        ["M", "--"],
                        ["N", "-."],
                      ].map(([char, code]) => (
                        <tr key={char} className="border-b">
                          <td className="py-1 font-mono font-bold">{char}</td>
                          <td className="py-1 font-mono">{code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="font-bold mb-2">More Letters</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ["O", "---"],
                        ["P", ".--."],
                        ["Q", "--.-"],
                        ["R", ".-."],
                        ["S", "..."],
                        ["T", "-"],
                        ["U", "..-"],
                        ["V", "...-"],
                        ["W", ".--"],
                        ["X", "-..-"],
                        ["Y", "-.--"],
                        ["Z", "--.."],
                      ].map(([char, code]) => (
                        <tr key={char} className="border-b">
                          <td className="py-1 font-mono font-bold">{char}</td>
                          <td className="py-1 font-mono">{code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Numbers</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ["0", "-----"],
                        ["1", ".----"],
                        ["2", "..---"],
                        ["3", "...--"],
                        ["4", "....-"],
                        ["5", "....."],
                        ["6", "-...."],
                        ["7", "--..."],
                        ["8", "---.."],
                        ["9", "----."],
                      ].map(([char, code]) => (
                        <tr key={char} className="border-b">
                          <td className="py-1 font-mono font-bold">{char}</td>
                          <td className="py-1 font-mono">{code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Punctuation</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        [".", ".-.-.-"],
                        [",", "--..--"],
                        ["?", "..--.."],
                        ["'", ".----."],
                        ["!", "-.-.--"],
                        ["/", "-..-."],
                        ["(", "-.--."],
                        [")", "-.--.-"],
                        ["&", ".-..."],
                        [":", "---..."],
                        [";", "-.-.-."],
                        ["=", "-...-"],
                        ["+", ".-.-."],
                        ["-", "-....-"],
                        ["_", "..--.-"],
                        ['"', ".-..-."],
                        ["$", "...-..-"],
                        ["@", ".--.-."],
                        [" ", "/"],
                      ].map(([char, code]) => (
                        <tr key={char} className="border-b">
                          <td className="py-1 font-mono font-bold">{char === " " ? "(space)" : char}</td>
                          <td className="py-1 font-mono">{code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Morse Code</CardTitle>
              <CardDescription>History and usage of Morse code</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3>History</h3>
              <p>
                Morse code was developed in the 1830s and 1840s by Samuel Morse and Alfred Vail for use with the
                electric telegraph. The original Morse code, now known as American Morse Code, was later refined into
                International Morse Code, which is the standard used today.
              </p>

              <h3>How It Works</h3>
              <p>
                Morse code represents characters as sequences of dots and dashes (or "dits" and "dahs"). The length of a
                dash is three times that of a dot. Each dot or dash is followed by a short silence equal to the dot
                duration. Letters are separated by a silence equal to three dots, and words by a silence equal to seven
                dots.
              </p>

              <h3>Timing</h3>
              <ul>
                <li>Dot (.) - 1 unit</li>
                <li>Dash (-) - 3 units</li>
                <li>Space between parts of the same letter - 1 unit</li>
                <li>Space between letters - 3 units</li>
                <li>Space between words - 7 units</li>
              </ul>

              <h3>Usage</h3>
              <p>
                Morse code was widely used for long-distance communication before the advent of voice transmission. It
                was essential in maritime communication and was the standard for international distress signals. The
                most famous Morse code message is "SOS" (... --- ...), the international distress signal.
              </p>
              <p>
                Today, Morse code is still used in amateur radio, as a navigation aid, and in some specialized fields.
                It's also valued for its simplicity and reliability in emergency situations when other forms of
                communication might fail.
              </p>

              <h3>Learning Morse Code</h3>
              <p>
                Learning Morse code involves memorizing the patterns for each letter and number. Many people find it
                helpful to use mnemonics or rhythm-based learning methods. With practice, operators can send and receive
                Morse code at speeds of 20-30 words per minute or more.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

