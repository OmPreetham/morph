"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function VoidSpace() {
  const gridRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme, resolvedTheme } = useTheme()

  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let touchStartX = 0
    let touchStartY = 0
    let isDragging = false

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth
      mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight

      // Calculate target position with increased movement range
      targetX = mouseX * 400
      targetY = mouseY * 400
    }

    // Handle touch events
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      isDragging = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return

      const touchX = e.touches[0].clientX
      const touchY = e.touches[0].clientY

      const deltaX = (touchX - touchStartX) / window.innerWidth
      const deltaY = (touchY - touchStartY) / window.innerHeight

      targetX += deltaX * 400
      targetY += deltaY * 400

      touchStartX = touchX
      touchStartY = touchY

      e.preventDefault()
    }

    const handleTouchEnd = () => {
      isDragging = false
    }

    // Smooth animation loop
    function animate() {
      // Smooth interpolation
      currentX += (targetX - currentX) * 0.05
      currentY += (targetY - currentY) * 0.05

      // Apply transform with perspective effect
      if (grid) {
        grid.style.transform = `translate(-50%, -50%) 
                              translate3d(${currentX}px, ${currentY}px, 0)
                              rotateX(${-mouseY * 3}deg) 
                              rotateY(${mouseX * 3}deg)`
      }

      requestAnimationFrame(animate)
    }

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    // Start animation
    animate()

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])

  return (
    <div
      className="fixed w-screen h-screen overflow-hidden z-[-1] cursor-grab active:cursor-grabbing transition-colors duration-300"
      style={{
        perspective: "1000px",
        backgroundColor: isDark ? "#050505" : "#ffffff",
      }}
      ref={containerRef}
    >
      <div
        ref={gridRef}
        className="absolute top-1/2 left-1/2 w-[1000vw] h-[1000vh] transition-all duration-300"
        style={{
          transformStyle: "preserve-3d",
          backgroundImage: `
radial-gradient(circle at 0 0, ${isDark ? "rgba(128, 128, 128, 0.1)" : "rgba(200, 200, 200, 0.5)"} 1px, transparent 1px),
linear-gradient(${isDark ? "rgba(128, 128, 128, 0.1)" : "rgba(200, 200, 200, 0.5)"} 1px, transparent 1px),
linear-gradient(90deg, ${isDark ? "rgba(128, 128, 128, 0.1)" : "rgba(200, 200, 200, 0.5)"} 1px, transparent 1px)
`,
          backgroundSize: "100px 100px, 100px 100px, 100px 100px",
          backgroundPosition: "0 0, 0 0, 0 0",
          transform: "translate(-50%, -50%)",
        }}
      ></div>
    </div>
  )
}
