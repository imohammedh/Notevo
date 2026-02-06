"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FaEllipsisVertical, FaEllipsis, FaRegTrashCan } from "react-icons/fa6";
import {
  Pin,
  ChevronsLeftRightEllipsis,
  ChevronsRightLeft,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { useQuery } from "@/cache/useQuery";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { generateSlug } from "@/lib/generateSlug";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "../ui/label";
import { useNoteWidth } from "@/hooks/useNoteWidth";

// Tiptap imports
import { generateHTML, generateText } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

// DOCX libraries (with aliases to avoid name conflicts)
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table as DocxTable,
  TableRow as DocxTableRow,
  TableCell as DocxTableCell,
  ShadingType,
  BorderStyle,
} from "docx";
import TurndownService from "turndown";
import { saveAs } from "file-saver";

interface NoteSettingsProps {
  noteId: Id<"notes">;
  noteTitle: string | any;
  IconVariant: "vertical_icon" | "horizontal_icon";
  BtnClassName?: string;
  ShowWidthOp: Boolean;
  DropdownMenuContentAlign: "end" | "start";
  TooltipContentAlign: "end" | "start";
  onDelete?: (noteId: Id<"notes">) => void;
}

export default function NoteSettings({
  noteId,
  noteTitle,
  IconVariant,
  BtnClassName,
  DropdownMenuContentAlign,
  TooltipContentAlign,
  ShowWidthOp,
  onDelete,
}: NoteSettingsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(noteTitle);
  const [open, setOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const { noteWidth, toggleWidth } = useNoteWidth();

  const updateNote = useMutation(api.notes.updateNote).withOptimisticUpdate(
    (local, args) => {
      const { _id, title, body, favorite } = args;
      const note = local.getQuery(api.notes.getNoteById, { _id });
      if (note) {
        local.setQuery(
          api.notes.getNoteById,
          { _id },
          {
            ...note,
            title: title ?? note.title,
            body: body ?? note.body,
            favorite: favorite !== undefined ? favorite : note.favorite,
            updatedAt: Date.now(),
          },
        );
      }
    },
  );

  const deleteNote = useMutation(api.notes.deleteNote);
  const getNote = useQuery(api.notes.getNoteById, { _id: noteId });
  const inputRef = useRef<HTMLInputElement>(null);

  const currentNoteId = searchParams.get("id");
  const isViewingThisNote = currentNoteId === noteId;

  useEffect(() => {
    setInputValue(noteTitle);
  }, [noteTitle]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 10);
    }
  }, [open]);

  if (!getNote) return null;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleBlur();
      setOpen(false);
    }
  };

  const handleBlur = async () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && trimmedValue !== noteTitle && getNote) {
      await updateNote({ _id: noteId, title: trimmedValue });

      if (isViewingThisNote) {
        const newSlug = generateSlug(trimmedValue);
        const pathSegments = pathname.split("/");
        pathSegments[pathSegments.length - 1] = newSlug;
        const newPath = pathSegments.join("/");
        router.replace(`${newPath}?id=${noteId}`);
      }
    }
  };

  const initiateDelete = () => {
    setOpen(false);
    setIsAlertOpen(true);
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!getNote) return;

    if (onDelete) onDelete(noteId);
    setIsAlertOpen(false);

    if (isViewingThisNote) {
      router.push(`/home/${getNote.workingSpaceId}`);
    }

    try {
      await deleteNote({ _id: noteId });
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleFavoritePin = async () => {
    if (!getNote) return;
    await updateNote({
      _id: noteId,
      favorite: !getNote.favorite,
    });
  };

  const handleDownload = async (
    format: "json" | "markdown" | "docx" | "pdf",
  ) => {
    if (!getNote?.body) {
      alert("No content available to download.");
      return;
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(getNote.body);
    } catch (err) {
      console.error("Failed to parse note body:", err);
      alert("Cannot export: note content appears to be corrupted.");
      return;
    }

    const extensions = [
      StarterKit,
      TextStyle,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: { class: "pb-6" },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: { class: "rounded-lg border border-muted" },
      }),
      Link.configure({
        HTMLAttributes: {
          class:
            "text-blue-200 underline underline-offset-[3px] hover:text-blue-800 transition-colors cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: { class: "border-collapse table-auto w-full my-4" },
      }),
      TableRow.configure({
        HTMLAttributes: { class: "border-t border-border" },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class:
            "border border-border bg-muted font-semibold text-left p-3 min-w-[100px]",
        },
      }),
      TableCell,
    ];

    let content: Blob | string;
    let type!: string;
    let ext!: string;
    const filename = `${noteTitle || "note"}`;

    // PDF Helper (unchanged)
    const createReadableExportElement = () => {
      const tempDiv = document.createElement("div");

      tempDiv.style.color = "#000000";
      tempDiv.style.backgroundColor = "#ffffff";
      tempDiv.style.padding = "10px";
      tempDiv.style.fontFamily = "Arial, Helvetica, sans-serif";
      tempDiv.style.lineHeight = "1.8";
      tempDiv.style.fontSize = "16px";
      tempDiv.style.maxWidth = "100%";
      tempDiv.style.margin = "0 ";

      const style = document.createElement("style");
      style.textContent = `
      * { color: #000000 !important; background: #ffffff !important; box-sizing: border-box; }
      hr { display: none !important; }
      a { color: #0066cc !important; text-decoration: underline !important; }
      pre, code {
        background: #f8f9fa !important;
        color: #000000 !important;
        font-family: Consolas, Monaco, monospace !important;
        font-size: 0.95rem !important;
        padding: 1.2rem !important;
        border: 1px solid #ddd !important;
        border-radius: 6px !important;
        overflow-x: auto !important;
        margin: 1.6rem 0 !important;
        white-space: pre-wrap !important;
      }
      blockquote {
        border-left: 4px solid #ccc !important;
        margin: 1.5rem 0 !important;
        padding-left: 1rem !important;
        font-style: italic !important;
        color: #444 !important;
      }
      ul, ol {
        margin: 1rem 0 1.5rem 2rem !important;
        padding-left: 0 !important;
      }
      li { margin-bottom: 0.6rem !important; }
      table, th, td {
        border: 1px solid #444 !important;
        border-collapse: collapse !important;
        color: #000000 !important;
        padding: 8px !important;
      }
      th { background-color: #f0f0f0 !important; font-weight: bold !important; }
      img {
        display: block !important;
        max-width: 100% !important;
        height: auto !important;
      }
      img[alt*="could not be loaded"],
      img:not([src]),
      img[src=""] {
        display: none !important;
      }
    `;
      tempDiv.appendChild(style);

      const html = generateHTML(parsedBody, extensions);

      const htmlWithPlaceholder = html.replace(
        /<img[^>]*>/g,
        `<div style="background:#f0f0f0; padding:16px; text-align:start; border:1px solid #ccc; margin:1.5rem 0; font-style:italic; color:#555;">
        [Image could not be loaded]
      </div>`,
      );

      let styledHtml = htmlWithPlaceholder
        .replace(
          /<h1/g,
          '<h1 style="font-size:2.8rem; font-weight:700; margin:0 0 2rem 0; text-align:start; line-height:1.2;"',
        )
        .replace(
          /<h2/g,
          '<h2 style="font-size:2.2rem; font-weight:600; margin:3rem 0 1.2rem 0;"',
        )
        .replace(
          /<h3/g,
          '<h3 style="font-size:1.8rem; font-weight:600; margin:2.5rem 0 1rem 0;"',
        )
        .replace(
          /<h4/g,
          '<h4 style="font-size:1.5rem; font-weight:600; margin:2rem 0 0.8rem 0;"',
        )
        .replace(
          /<h5/g,
          '<h5 style="font-size:1.3rem; font-weight:600; margin:1.8rem 0 0.6rem 0;"',
        )
        .replace(
          /<h6/g,
          '<h6 style="font-size:1.1rem; font-weight:600; margin:1.8rem 0 0.6rem 0;"',
        );

      tempDiv.innerHTML = styledHtml;

      return tempDiv;
    };

    switch (format) {
      case "json":
        content = JSON.stringify(parsedBody, null, 2);
        type = "application/json";
        ext = "json";
        break;

      case "markdown":
        try {
          const html = generateHTML(parsedBody, extensions);
          const turndown = new TurndownService();
          turndown
            .addRule("image", {
              filter: "img",
              replacement: (c: any, node: any) => {
                const src = (node as HTMLElement).getAttribute("src") || "";
                const alt = (node as HTMLElement).getAttribute("alt") || "";
                return `\n\n![${alt}](${src})\n\n`;
              },
            })
            .addRule("highlight", {
              filter: ["mark"],
              replacement: (c: any) => `==${c}==`,
            });
          content = turndown.turndown(html);
          type = "text/markdown";
          ext = "md";
        } catch (err) {
          console.warn("Markdown failed:", err);
          content = generateText(parsedBody, extensions);
          ext = "txt";
        }
        break;

      case "docx":
        try {
          const doc = new Document({
            sections: [
              {
                properties: {},
                children: parseTiptapToDocx(parsedBody.content || []),
              },
            ],
          });

          const blob = await Packer.toBlob(doc);
          saveAs(blob, `${filename}.docx`);
          return;
        } catch (err) {
          console.error("DOCX generation failed:", err);
          alert("DOCX export failed falling back to text.");
          content = generateText(parsedBody, extensions);
          type = "text/plain";
          ext = "txt";
        }
        break;

      case "pdf":
        try {
          const html2pdfModule = await import("html2pdf.js");
          const html2pdf = html2pdfModule.default;

          const element = createReadableExportElement();

          const opt = {
            margin: 1,
            filename: `${filename}.pdf`,
            image: { type: "jpeg" as const, quality: 0.98 },
            html2canvas: { scale: 1.5 },
            jsPDF: {
              unit: "in" as const,
              format: "letter" as const,
              orientation: "portrait" as const,
            },
          };

          await html2pdf().set(opt).from(element).save();
          return;
        } catch (err) {
          console.error("PDF generation failed:", err);
          alert("PDF export failed try simpler content or check console.");
          return;
        }
    }

    // Fallback download
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ────────────────────────────────────────────────
  // Parse Tiptap JSON → docx children (headings, bold, lists, etc.)
  // ────────────────────────────────────────────────
  function parseTiptapToDocx(nodes: any[]): (Paragraph | any)[] {
    const children: (Paragraph | any)[] = [];

    for (const node of nodes || []) {
      if (!node) continue;

      switch (node.type) {
        case "paragraph":
          children.push(
            new Paragraph({
              children: parseTextWithMarks(node.content || []),
            }),
          );
          break;

        case "heading":
          const level = node.attrs?.level || 1;
          children.push(
            new Paragraph({
              heading:
                HeadingLevel[`HEADING_${level}` as keyof typeof HeadingLevel],
              children: parseTextWithMarks(node.content || []),
            }),
          );
          break;

        case "bulletList":
          children.push(...parseList(node.content || [], false));
          break;

        case "orderedList":
          children.push(...parseList(node.content || [], true));
          break;

        case "codeBlock":
          const codeText = node.content?.[0]?.text || "";
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: codeText,
                  font: { name: "Consolas" },
                  size: 22,
                  shading: { fill: "f8f9fa", type: ShadingType.SOLID },
                }),
              ],
              spacing: { before: 200, after: 200 },
            }),
          );
          break;

        case "blockquote":
          children.push(
            new Paragraph({
              children: parseTextWithMarks(node.content || []),
              indent: { left: 360 },
            }),
          );
          break;

        case "table":
          const rows =
            node.content?.map((rowNode: any) => {
              const cells =
                rowNode.content?.map((cellNode: any) => {
                  return new DocxTableCell({
                    children: [
                      new Paragraph({
                        children: parseTextWithMarks(cellNode.content || []),
                      }),
                    ],
                  });
                }) || [];
              return new DocxTableRow({ children: cells });
            }) || [];

          children.push(
            new DocxTable({
              rows,
              width: { size: 100, type: "pct" },
            }),
          );
          break;

        default:
          if (node.content) {
            children.push(...parseTiptapToDocx(node.content));
          }
          break;
      }
    }

    return children;
  }

  function parseTextWithMarks(textNodes: any[]): TextRun[] {
    const runs: TextRun[] = [];

    for (const node of textNodes || []) {
      if (node.type !== "text" || !node.text) continue;

      const options: any = {
        text: node.text,
        color: "000000",
      };

      if (node.marks) {
        for (const mark of node.marks) {
          switch (mark.type) {
            case "bold":
              options.bold = true;
              break;
            case "italic":
              options.italics = true;
              break;
            case "code":
              options.font = { name: "Consolas" };
              options.size = 22;
              options.shading = { fill: "f8f9fa", type: ShadingType.SOLID };
              break;
            case "highlight":
              options.shading = { fill: "ffff99", type: ShadingType.SOLID };
              break;
            case "link":
              if (mark.attrs?.href) {
                options.link = { href: mark.attrs.href };
              }
              break;
          }
        }
      }

      runs.push(new TextRun(options));
    }

    return runs;
  }

  function parseList(listItems: any[], isOrdered: boolean): Paragraph[] {
    const listItemsParsed: Paragraph[] = [];

    listItems.forEach((itemNode) => {
      if (itemNode.type === "listItem") {
        const itemChildren = parseTextWithMarks(
          itemNode.content?.[0]?.content || [],
        );

        listItemsParsed.push(
          new Paragraph({
            children: itemChildren,
            bullet: isOrdered ? undefined : { level: 0 },
            numbering: isOrdered
              ? { reference: "ordered", level: 0 }
              : undefined,
          }),
        );

        if (itemNode.content?.length > 1) {
          listItemsParsed.push(...parseTiptapToDocx(itemNode.content.slice(1)));
        }
      }
    });

    return listItemsParsed;
  }
  const handleTooltipMouseEnter = () => setIsTooltipOpen(true);
  const handleTooltipMouseLeave = () => setIsTooltipOpen(false);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip open={isTooltipOpen}>
            <DropdownMenuTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant="Trigger"
                  className={cn("px-0.5 h-8 mt-0.5", BtnClassName)}
                  onMouseEnter={handleTooltipMouseEnter}
                  onMouseLeave={handleTooltipMouseLeave}
                >
                  {IconVariant === "vertical_icon" ? (
                    <FaEllipsisVertical
                      size={18}
                      className="text-muted-foreground"
                    />
                  ) : (
                    <FaEllipsis size={22} className="text-muted-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
            </DropdownMenuTrigger>
            <TooltipContent
              side="bottom"
              alignOffset={1}
              align={TooltipContentAlign}
            >
              Rename, Pin, Download, Delete{ShowWidthOp && "..."}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent
          side="bottom"
          align={DropdownMenuContentAlign}
          alignOffset={1}
          className="w-48 pb-1.5 px-1.5 pt-0 space-y-4 text-muted-foreground"
        >
          <DropdownMenuGroup className="relative">
            <Label>Rename :</Label>
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="Rename your note"
              className="text-foreground h-9"
              ref={inputRef}
            />
          </DropdownMenuGroup>

          <DropdownMenuGroup>
            <Button
              variant="SidebarMenuButton"
              className="w-full h-8 px-2 text-sm"
              onClick={handleFavoritePin}
            >
              <Pin size={14} className="text-primary" />
              {getNote?.favorite ? "Unpin Note" : "Pin Note"}
            </Button>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="w-full h-8 px-2 text-sm flex items-center gap-2 text-foreground hover:bg-primary/10">
                <Download size={14} className="text-primary" />
                Download
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                <DropdownMenuItem
                  className="text-sm cursor-pointer"
                  onClick={() => handleDownload("markdown")}
                >
                  Markdown (.md)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-sm cursor-pointer"
                  onClick={() => handleDownload("json")}
                >
                  JSON
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-sm cursor-pointer"
                  onClick={() => handleDownload("docx")}
                >
                  Word (.docx)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-sm cursor-pointer"
                  onClick={() => handleDownload("pdf")}
                >
                  PDF
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {ShowWidthOp && (
              <>
                <Button
                  variant="SidebarMenuButton"
                  className="w-full h-8 px-2 text-sm"
                  onClick={toggleWidth}
                >
                  {noteWidth === "false" ? (
                    <>
                      <ChevronsLeftRightEllipsis
                        size={14}
                        className="text-primary"
                      />
                      Full width
                    </>
                  ) : (
                    <>
                      <ChevronsRightLeft size={14} className="text-primary" />
                      Max width
                    </>
                  )}
                </Button>
                <DropdownMenuSeparator />
              </>
            )}

            <Button
              variant="SidebarMenuButton_destructive"
              className="w-full h-8 px-2 text-sm"
              onClick={initiateDelete}
            >
              <FaRegTrashCan size={14} className="text-primary" />
              Delete
            </Button>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-card border border-border text-card-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Note Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this note? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-border hover:bg-accent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
