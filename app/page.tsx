"use client"

import { useState, useEffect } from "react"
import VoidSpace from "@/components/void-space"
import DataConverter from "@/components/data-converter"
import { ThemeProvider } from "@/components/theme-provider"
import Logo from "@/components/logo"

export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="h-screen w-screen overflow-hidden transition-colors duration-300">
        {mounted && (
          <>
            <VoidSpace />
            {!isFullscreen && <Logo />}
            <DataConverter onFullscreenChange={setIsFullscreen} />
          </>
        )}
      </main>
    </ThemeProvider>
  )
}

