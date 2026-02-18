import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  UnderlineIcon,
} from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";
import type { SelectorItem } from "./node-selector";

export const TextButtons = () => {
  const { editor } = useEditor();
  if (!editor) return null;

  const items: SelectorItem[] = [
    {
      name: "bold",
      isActive: (editor: any) => editor.isActive("bold"),
      command: (editor: any) => editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: (editor: any) => editor.isActive("italic"),
      command: (editor: any) => editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      isActive: (editor: any) => editor.isActive("underline"),
      command: (editor: any) => editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      isActive: (editor: any) => editor.isActive("strike"),
      command: (editor: any) => editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      isActive: (editor: any) => editor.isActive("code"),
      command: (editor: any) => editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ];

  const tooltipLabels: Record<string, string> = {
    bold: "Bold",
    italic: "Italic",
    underline: "Underline",
    strike: "Strikethrough",
    code: "Inline Code",
  };

  const alignItems = [
    {
      name: "alignLeft",
      align: "left",
      label: "Align Left",
      isActive: (editor: any) => editor.isActive({ textAlign: "left" }),
      icon: AlignLeftIcon,
    },
    {
      name: "alignCenter",
      align: "center",
      label: "Align Center",
      isActive: (editor: any) => editor.isActive({ textAlign: "center" }),
      icon: AlignCenterIcon,
    },
    {
      name: "alignRight",
      align: "right",
      label: "Align Right",
      isActive: (editor: any) => editor.isActive({ textAlign: "right" }),
      icon: AlignRightIcon,
    },
  ];

  return (
    <TooltipProvider delayDuration={300} disableHoverableContent>
      <div className="flex">
        {items.map((item) => (
          <EditorBubbleItem
            key={item.name}
            onSelect={(editor) => {
              item.command(editor);
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  className="border-none px-2 h-8"
                  variant="SidebarMenuButton"
                  type="button"
                >
                  <item.icon
                    className={cn("h-4 w-4", {
                      "text-primary": item.isActive(editor),
                      "text-foreground": !item.isActive(editor),
                    })}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className=" text-xs px-1 py-1"
                side="top"
                sideOffset={6}
              >
                <p>{tooltipLabels[item.name]}</p>
              </TooltipContent>
            </Tooltip>
          </EditorBubbleItem>
        ))}

        {alignItems.map((item) => (
          <Tooltip key={item.name}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                className="border-none px-2 h-8"
                variant="SidebarMenuButton"
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  (editor.commands as any).setTextAlign(item.align);
                }}
              >
                <item.icon
                  className={cn("h-4 w-4", {
                    "text-primary": item.isActive(editor),
                    "text-foreground": !item.isActive(editor),
                  })}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className=" text-xs px-1 py-1"
              side="top"
              sideOffset={6}
            >
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
