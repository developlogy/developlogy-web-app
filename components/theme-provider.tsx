"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      value={{
        light: "light",
        dark: "dark",
        emerald: "emerald",
        rose: "rose",
        violet: "violet",
      }}
    >
      {children}
    </NextThemesProvider>
  )
}
