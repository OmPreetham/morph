import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MORPH - The Wrap Station",
  description:
    "Convert between JSON, XML, YAML, and CSV formats with MORPH - The Wrap Station. A powerful data conversion tool for developers and data analysts.",
  keywords: [
    "data converter",
    "JSON to XML",
    "YAML converter",
    "CSV converter",
    "data transformation",
    "format converter",
    "MORPH",
    "Wrap Station",
  ],
  authors: [{ name: "MORPH Team" }],
  creator: "MORPH Team",
  publisher: "MORPH",
  manifest: "/manifest.json",
  metadataBase: new URL("https://morph.ompreetham.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://morph.ompreetham.com",
    title: "MORPH - The Wrap Station",
    description: "Convert between JSON, XML, YAML, and CSV formats with MORPH - The Wrap Station.",
    siteName: "MORPH - The Wrap Station",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "MORPH - The Wrap Station",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MORPH - The Wrap Station",
    description: "Convert between JSON, XML, YAML, and CSV formats with MORPH - The Wrap Station.",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MORPH",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  robots: "index, follow",
  applicationName: "MORPH - The Wrap Station",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* These meta tags will be overridden by the ThemeScript below for theme-aware colors */}
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/logo.jpg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />

        {/* Script to update theme-color meta tag based on theme changes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function updateThemeColor() {
                  const isDark = document.documentElement.classList.contains('dark');
                  const themeColor = isDark ? '#050505' : '#ffffff';
                  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
                  
                  if (metaThemeColor) {
                    metaThemeColor.setAttribute('content', themeColor);
                  } else {
                    const meta = document.createElement('meta');
                    meta.name = 'theme-color';
                    meta.content = themeColor;
                    document.head.appendChild(meta);
                  }
                }

                // Update on initial load
                updateThemeColor();

                // Update when theme changes
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'class') {
                      updateThemeColor();
                    }
                  });
                });

                observer.observe(document.documentElement, { attributes: true });
              })();
            `,
          }}
        />
        {/* Add PWA update check functionality */}
        {/* Add this script to the head section, right after the theme color script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // PWA update checker
              if ('serviceWorker' in navigator) {
                // Register service worker
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    
                    // Set up hourly update check
                    setInterval(function() {
                      registration.update();
                      console.log('Checking for PWA updates...');
                    }, 3600000); // 3600000 ms = 1 hour
                    
                  }).catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
