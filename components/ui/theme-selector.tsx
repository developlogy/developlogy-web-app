"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const themes = ["light", "dark", "emerald", "rose", "violet"]

export function ThemeSelector() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex flex-wrap gap-2">
      {themes.map((t) => (
        <Button
          key={t}
          variant={theme === t ? "default" : "outline"}
          onClick={() => setTheme(t)}
          className="capitalize"
        >
          {t}
        </Button>
      ))}
    </div>
  )
}
