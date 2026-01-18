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
      className="w-full border border-primary/20 bg-primary/10 rounded-lg justify-center items-center flex-1 gap-1"
      variant="SidebarMenuButton"
    >
      <ToggleGroupItem value="light" aria-label="Light" className="flex-1 px-2">
        <SunIcon className="h-4 w-4 text-primary" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark" className="flex-1 px-2 ">
        <MoonIcon className="h-4 w-4 text-primary" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="system"
        aria-label="System"
        className="flex-1 px-2"
      >
        <DesktopIcon className="h-4 w-4 text-primary" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
