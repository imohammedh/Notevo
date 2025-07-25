import { Check, ChevronDown } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
export interface BubbleColorMenuItem {
  name: string;
  color: string;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "var(--novel-white)",
  },
  {
    name: "Purple",
    color: "#9333EA",
  },
  {
    name: "Red",
    color: "#E00000",
  },
  {
    name: "Yellow",
    color: "#EAB308",
  },
  {
    name: "Blue",
    color: "#2563EB",
  },
  {
    name: "Green",
    color: "#008A00",
  },
  {
    name: "Orange",
    color: "#FFA500",
  },
  {
    name: "Pink",
    color: "#BA4081",
  },
  {
    name: "Gray",
    color: "#A8A29E",
  },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "var(--novel-highlight-default)",
  },
  {
    name: "Purple",
    color: "var(--novel-highlight-purple)",
  },
  {
    name: "Red",
    color: "var(--novel-highlight-red)",
  },
  {
    name: "Yellow",
    color: "var(--novel-highlight-yellow)",
  },
  {
    name: "Blue",
    color: "var(--novel-highlight-blue)",
  },
  {
    name: "Green",
    color: "var(--novel-highlight-green)",
  },
  {
    name: "Orange",
    color: "var(--novel-highlight-orange)",
  },
  {
    name: "Pink",
    color: "var(--novel-highlight-pink)",
  },
  {
    name: "Gray",
    color: "var(--novel-highlight-gray)",
  },
];

interface ColorSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ColorSelector = ({ open, onOpenChange }: ColorSelectorProps) => {
  const { editor } = useEditor();

  if (!editor) return null;
  const activeColorItem = TEXT_COLORS.find(({ color }) =>
    editor.isActive("textStyle", { color }),
  );

  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
    editor.isActive("highlight", { color }),
  );

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          className="gap-2 rounded-none border-none"
          variant="ghost"
        >
          <span
            className="rounded-sm px-1"
            style={{
              color: activeColorItem?.color,
              backgroundColor: activeHighlightItem?.color,
            }}
          >
            A
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={5}
        className="my-1 rounded-lg border border-border bg-popover px-1 py-2 transition-all scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto p-1 shadow-xl"
        align="start"
      >
        <div className="flex flex-col">
          <div className="my-1 px-2 text-sm font-semibold text-foreground">
            Color
          </div>
          <div className="w-full flex flex-wrap flex-1 flex-grow flex-row items-center justify-start">
            {TEXT_COLORS.map(({ name, color }) => (
              <EditorBubbleItem
                key={name}
                onSelect={() => {
                  editor.commands.setColor(color);
                  onOpenChange(false);
                }}
                className="cursor-pointer flex items-center justify-center px-2 py-1 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground"
              >
                <div
                  className="rounded-sm border text-base border-border px-2 py-px font-medium"
                  style={{ color }}
                >
                  A
                </div>
              </EditorBubbleItem>
            ))}
          </div>
        </div>
        <div>
          <div className="my-1 px-2 text-sm font-semibold text-foreground">
            Background
          </div>
          <div className="w-full flex flex-wrap flex-1 flex-grow flex-row items-center justify-start">
            {HIGHLIGHT_COLORS.map(({ name, color }) => (
              <EditorBubbleItem
                key={name}
                onSelect={() => {
                  editor.commands.setHighlight({ color });
                }}
                className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground"
              >
                <div
                  className="rounded-sm border text-base border-border px-2 py-px font-medium"
                  style={{backgroundColor: color}}
                >
                  A
                </div>
              </EditorBubbleItem>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};