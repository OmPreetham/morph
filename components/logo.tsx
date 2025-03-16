"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function Logo() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <div className="fixed top-5 left-5 flex flex-col items-center z-10">
      <div className="flex gap-1" role="heading" aria-label="MORPH">
        {["M", "O", "R", "P", "H"].map((letter, index) => (
          <div
            key={index}
            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-bold uppercase transition-all duration-300"
            style={{
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.7)",
              color: isDark ? "#fff" : "#000",
              backdropFilter: "blur(4px)",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
            }}
            aria-hidden="true"
          >
            {letter}
          </div>
        ))}
      </div>
      <div
        className="font-mono italic text-xs sm:text-sm mt-2 tracking-wide transition-colors duration-300"
        style={{
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        }}
        role="heading"
        aria-label="THE WRAP STATION"
      >
        THE WRAP STATION
      </div>
    </div>
  )
}

