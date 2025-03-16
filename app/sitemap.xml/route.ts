import { NextResponse } from "next/server"

export async function GET() {
  // Create the sitemap XML content
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://morph.ompreetham.com</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

  // Return the sitemap as an XML response
  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}

