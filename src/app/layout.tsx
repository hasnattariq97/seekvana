import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SearchProvider } from "@/context/search-context";
import { Navbar } from "@/components/layout/navbar";
import { SearchModalServer } from "@/components/search/search-modal-server";
import "./globals.css";
import 'katex/dist/katex.min.css'

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://seekvana.com"),
  title: {
    default: "Seekvana — Learn AI, clearly",
    template: "%s — Seekvana",
  },
  description:
    "Learn Agentic AI and all things AI — clear, well-sourced articles for everyone from beginners to advanced builders.",
  openGraph: {
    type: "website",
    siteName: "Seekvana",
    title: "Seekvana — Learn AI, clearly",
    description:
      "Learn Agentic AI and all things AI — clear, well-sourced articles for everyone from beginners to advanced builders.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seekvana — Learn AI, clearly",
    description:
      "Learn Agentic AI and all things AI — clear, well-sourced articles for everyone from beginners to advanced builders.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-canvas min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SearchProvider>
            <Navbar />
            <main>{children}</main>
            <SearchModalServer />
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
