import { NextResponse } from "next/server"

// This endpoint can be called to check for updates
export async function GET() {
  return NextResponse.json({
    updateAvailable: false,
    version: "1.2.0",
    lastChecked: new Date().toISOString(),
  })
}
