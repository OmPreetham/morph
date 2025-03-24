"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Play, Pause, Volume2, Volume1, VolumeX, Settings } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MorseCodePlayerProps {
  morseCode: string
}

export function MorseCodePlayer({ morseCode }: MorseCodePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [speed, setSpeed] = useState(1.0)
  const [dotDuration, setDotDuration] = useState(100)
  const [isMuted, setIsMuted] = useState(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  const timeoutsRef = useRef<number[]>([])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const stopPlayback = () => {
    setIsPlaying(false)
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
  }

  const playMorseCode = () => {
    if (isPlaying) {
      stopPlayback()
      return
    }

    setIsPlaying(true)

    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      const audioContext = audioContextRef.current

      // Calculate durations based on speed
      const actualDotDuration = dotDuration / speed
      const dashDuration = actualDotDuration * 3
      const symbolGap = actualDotDuration
      const letterGap = actualDotDuration * 3
      const wordGap = actualDotDuration * 7

      // Create a gain node for volume control
      const gainNode = audioContext.createGain()
      gainNode.gain.value = isMuted ? 0 : volume
      gainNode.connect(audioContext.destination)

      let currentTime = audioContext.currentTime

      // Function to play a tone
      const playTone = (duration: number, startTime: number) => {
        const oscillator = audioContext.createOscillator()
        oscillator.type = "sine"
        oscillator.frequency.value = 700
        oscillator.connect(gainNode)

        oscillator.start(startTime)
        oscillator.stop(startTime + duration / 1000)
      }

      // Parse and play the Morse code
      const chars = morseCode.split("")

      chars.forEach((char, index) => {
        if (char === ".") {
          playTone(actualDotDuration, currentTime)
          currentTime += actualDotDuration / 1000

          // Add gap after symbol if not the last character
          if (index < chars.length - 1 && chars[index + 1] !== " " && chars[index + 1] !== "/") {
            currentTime += symbolGap / 1000
          }
        } else if (char === "-") {
          playTone(dashDuration, currentTime)
          currentTime += dashDuration / 1000

          // Add gap after symbol if not the last character
          if (index < chars.length - 1 && chars[index + 1] !== " " && chars[index + 1] !== "/") {
            currentTime += symbolGap / 1000
          }
        } else if (char === " ") {
          // Space between letters
          currentTime += letterGap / 1000
        } else if (char === "/") {
          // Space between words
          currentTime += wordGap / 1000
        }
      })

      // Set a timeout to stop playing when finished
      const totalDuration = (currentTime - audioContext.currentTime) * 1000
      const timeoutId = window.setTimeout(() => {
        setIsPlaying(false)
        if (audioContextRef.current) {
          audioContextRef.current.close()
          audioContextRef.current = null
        }
      }, totalDuration)

      timeoutsRef.current.push(timeoutId)
    } catch (error) {
      console.error("Error playing Morse code:", error)
      setIsPlaying(false)
    }
  }

  // Get volume icon based on volume level
  const getVolumeIcon = () => {
    if (isMuted) return <VolumeX className="h-4 w-4" />
    if (volume < 0.5) return <Volume1 className="h-4 w-4" />
    return <Volume2 className="h-4 w-4" />
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">Morse Code Player</CardTitle>
        <CardDescription>Listen to the Morse code translation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-md font-mono text-sm overflow-x-auto">
          {morseCode || "No Morse code to play"}
        </div>

        <div className="flex items-center justify-between mb-4">
          <Button
            variant={isPlaying ? "destructive" : "default"}
            onClick={playMorseCode}
            disabled={!morseCode}
            className="w-full mr-2"
          >
            {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isPlaying ? "Stop" : "Play"}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="speed">Speed: {speed.toFixed(1)}x</Label>
                  <Slider
                    id="speed"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={[speed]}
                    onValueChange={(value) => setSpeed(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dot-duration">Dot Duration: {dotDuration}ms</Label>
                  <Slider
                    id="dot-duration"
                    min={50}
                    max={200}
                    step={10}
                    value={[dotDuration]}
                    onValueChange={(value) => setDotDuration(value[0])}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={toggleMute}>
            {getVolumeIcon()}
          </Button>
          <Slider
            id="volume"
            min={0}
            max={1}
            step={0.01}
            value={[volume]}
            onValueChange={(value) => setVolume(value[0])}
            disabled={isMuted}
            className="flex-1"
          />
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div>
          <span className="font-semibold">Legend:</span> Dot (.) = short beep, Dash (-) = long beep, Space ( ) = letter
          gap, Slash (/) = word gap
        </div>
      </CardFooter>
    </Card>
  )
}

