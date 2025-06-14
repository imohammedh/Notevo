"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ToggleGroup 
      type="single" 
      size="sm" 
      onValueChange={(value) => {
        if (value) {
          setTheme(value);
        }
      }} 
      value={theme}
      className="w-full justify-start"
    >
      <ToggleGroupItem 
        value="light" 
        aria-label="Light"
        className="flex-1"
      >
        <SunIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="dark" 
        aria-label="Dark"
        className="flex-1"
      >
        <MoonIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="system" 
        aria-label="System"
        className="flex-1"
      >
        <DesktopIcon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
