"use client";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Editor } from "@tiptap/core";
import {
  Plus,
  Trash2,
  ChevronDown,
  GripVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Table as TableIcon,
  ArrowUp,
  ArrowDown,
  Palette,
} from "lucide-react";
import { Button } from "./ui/button";

interface TableControlsProps {
  editor: Editor;
}

interface ContextMenuState {
  show: boolean;
  x: number;
  y: number;
  type: "row" | "column" | "cell" | null;
  index: number;
}

const highlightColors = [
  { name: "Default", value: "" }, // clear
  { name: "Purple", value: "var(--novel-highlight-purple)" },
  { name: "Red", value: "var(--novel-highlight-red)" },
  { name: "Yellow", value: "var(--novel-highlight-yellow)" },
  { name: "Blue", value: "var(--novel-highlight-blue)" },
  { name: "Green", value: "var(--novel-highlight-green)" },
  { name: "Orange", value: "var(--novel-highlight-orange)" },
  { name: "Pink", value: "var(--novel-highlight-pink)" },
  { name: "Gray", value: "var(--novel-highlight-gray)" },
];

export const TableControls = ({ editor }: TableControlsProps) => {
  const [activeTable, setActiveTable] = useState<HTMLTableElement | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    type: null,
    index: 0,
  });
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!editor) return;

    const editorElement = editor.view.dom;
    let container = editorElement.parentElement?.querySelector(
      ".table-controls-portal",
    ) as HTMLElement;

    if (!container) {
      container = document.createElement("div");
      container.className = "table-controls-portal";
      container.style.cssText =
        "position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999;";

      if (editorElement.parentElement) {
        const parent = editorElement.parentElement;
        const currentPosition = window.getComputedStyle(parent).position;
        if (currentPosition === "static") {
          parent.style.position = "relative";
        }
        parent.appendChild(container);
      }
    }
    setPortalContainer(container);

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const th = target.closest("th");
      const firstRow = target.closest("tr:first-child");

      if ((th || firstRow) && target.closest("table")) {
        const table = target.closest("table");
        if (table && table.closest(".ProseMirror")) {
          setActiveTable(table as HTMLTableElement);
          if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const table = target.closest("table");
      if (table) {
        timeoutRef.current = window.setTimeout(() => {
          setActiveTable(null);
        }, 10);
      }
    };

    const handleClickOutside = () => {
      setContextMenu({ show: false, x: 0, y: 0, type: null, index: 0 });
    };

    editorElement.addEventListener("mousemove", handleMouseMove);
    editorElement.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("click", handleClickOutside);

    return () => {
      editorElement.removeEventListener("mousemove", handleMouseMove);
      editorElement.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("click", handleClickOutside);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [editor]);

  if (!activeTable || !portalContainer) return null;

  const rows = Array.from(activeTable.querySelectorAll("tr"));
  const firstRow = rows[0];
  const columns = Array.from(firstRow?.querySelectorAll("th, td") || []);

  const getCellPos = (cell: Element): number | null => {
    try {
      return editor.view.posAtDOM(cell, 0);
    } catch (e) {
      return null;
    }
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    type: "row" | "column",
    index: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      type,
      index,
    });
  };

  const selectRow = (rowIndex: number) => {
    const row = rows[rowIndex];
    if (!row) return;
    const cell = row.querySelector("th, td");
    if (!cell) return;
    const pos = getCellPos(cell);
    if (pos !== null) {
      editor.chain().focus().setTextSelection(pos).run();
    }
  };

  const selectColumn = (colIndex: number) => {
    const cell = activeTable.querySelector(
      `tr:first-child > *:nth-child(${colIndex + 1})`,
    );
    if (!cell) return;
    const pos = getCellPos(cell);
    if (pos !== null) {
      editor.chain().focus().setTextSelection(pos).run();
    }
  };

  const addColumnAfter = (colIndex: number) => {
    selectColumn(colIndex);
    editor.chain().focus().addColumnAfter().run();
  };

  const addColumnBefore = (colIndex: number) => {
    selectColumn(colIndex);
    editor.chain().focus().addColumnBefore().run();
  };

  const deleteColumn = (colIndex: number) => {
    if (columns.length <= 1) return;
    selectColumn(colIndex);
    editor.chain().focus().deleteColumn().run();
  };

  const duplicateColumn = (colIndex: number) => {
    selectColumn(colIndex);
    editor.chain().focus().addColumnAfter().run();
  };

  const addRowAfter = (rowIndex: number) => {
    selectRow(rowIndex);
    editor.chain().focus().addRowAfter().run();
  };

  const addRowBefore = (rowIndex: number) => {
    selectRow(rowIndex);
    editor.chain().focus().addRowBefore().run();
  };

  const deleteRow = (rowIndex: number) => {
    if (rows.length <= 1) return;
    selectRow(rowIndex);
    editor.chain().focus().deleteRow().run();
  };

  const duplicateRow = (rowIndex: number) => {
    selectRow(rowIndex);
    editor.chain().focus().addRowAfter().run();
  };

  const toggleHeaderRow = () => {
    editor.chain().focus().toggleHeaderRow().run();
  };

  const toggleHeaderColumn = () => {
    editor.chain().focus().toggleHeaderColumn().run();
  };

  const setCellBackground = (color: string) => {
    editor.chain().focus().setCellAttribute("backgroundColor", color).run();
  };
  // .setCellAttribute("backgroundColor", color || null)

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  const editorRect = editor.view.dom.parentElement?.getBoundingClientRect();
  const tableRect = activeTable.getBoundingClientRect();

  if (!editorRect) return null;

  const ContextMenuComponent = () => {
    if (!contextMenu.show) return null;

    return createPortal(
      <div
        className="fixed bg-accent border border-border rounded-lg  py-2 px-0.5 w-[260px] z-[9999] animate-in fade-in-0 zoom-in-95"
        style={{
          left: `${contextMenu.x}px`,
          top: `${contextMenu.y}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {(contextMenu.type === "row" || contextMenu.type === "column") && (
          <>
            <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {contextMenu.type === "row" ? "Row" : "Column"} Actions :
            </div>

            {contextMenu.type === "row" && (
              <>
                <Button
                  onClick={() => {
                    toggleHeaderRow();
                    setContextMenu({ ...contextMenu, show: false });
                  }}
                  variant="SidebarMenuButton"
                  className="w-full justify-start px-4 py-2 h-auto "
                >
                  <TableIcon className="w-4 h-4 mr-2" />
                  Toggle Header Row
                </Button>
                <Button
                  onClick={() => {
                    addRowBefore(contextMenu.index);
                    setContextMenu({ ...contextMenu, show: false });
                  }}
                  variant="SidebarMenuButton"
                  className="w-full justify-start px-4 py-2 h-auto"
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Insert Row Above
                </Button>
                <Button
                  onClick={() => {
                    addRowAfter(contextMenu.index);
                    setContextMenu({ ...contextMenu, show: false });
                  }}
                  variant="SidebarMenuButton"
                  className="w-full justify-start px-4 py-2 h-auto "
                >
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Insert Row Below
                </Button>
                <Button
                  onClick={() => {
                    duplicateRow(contextMenu.index);
                    setContextMenu({ ...contextMenu, show: false });
                  }}
                  variant="SidebarMenuButton"
                  className="w-full justify-start px-4 py-2 h-auto"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Row
                </Button>
              </>
            )}

            {contextMenu.type === "column" && (
              <>
                <Button
                  onClick={() => {
                    toggleHeaderColumn();
                    setContextMenu({ ...contextMenu, show: false });
                  }}
                  variant="SidebarMenuButton"
                  className="w-full justify-start px-4 py-2 h-auto"
                >
                  <TableIcon className="w-4 h-4 mr-2" />
                  Toggle Header Column
                </Button>
                <Button
                  onClick={() => {
                    addColumnBefore(contextMenu.index);
                    setContextMenu({ ...contextMenu, show: false });
                  }}
                  variant="SidebarMenuButton"
                  className="w-full justify-start px-4 py-2 h-auto"
                >
                  <ArrowUp className="w-4 h-4 mr-2 rotate-[-90deg]" />
                  Insert Column Left
                </Button>
                <Button
                  onClick={() => {
                    addColumnAfter(contextMenu.index);
                    setContextMenu({ ...contextMenu, show: false });
                  }}
                  variant="SidebarMenuButton"
                  className="w-full justify-start px-4 py-2 h-auto"
                >
                  <ArrowDown className="w-4 h-4 mr-2 rotate-[-90deg]" />
                  Insert Column Right
                </Button>
                <Button
                  onClick={() => {
                    duplicateColumn(contextMenu.index);
                    setContextMenu({ ...contextMenu, show: false });
                  }}
                  variant="SidebarMenuButton"
                  className="w-full justify-start px-4 py-2 h-auto"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Column
                </Button>
              </>
            )}

            {/* Color picker section */}
            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center">
                <Palette className="w-3 h-3 mr-1" />
                Background Color
              </div>
              <div className="grid grid-cols-9 gap-1">
                {highlightColors.map((color) => (
                  <button
                    key={color.name}
                    className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: color.value || "transparent",
                      borderColor: color.value ? "transparent" : "#888",
                    }}
                    onClick={() => {
                      if (contextMenu.type === "row")
                        selectRow(contextMenu.index);
                      if (contextMenu.type === "column")
                        selectColumn(contextMenu.index);
                      setCellBackground(color.value);
                      setContextMenu({ ...contextMenu, show: false });
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="h-px bg-border my-1" />

            {(contextMenu.type === "row"
              ? rows.length > 1
              : columns.length > 1) && (
              <Button
                onClick={() => {
                  if (contextMenu.type === "row") deleteRow(contextMenu.index);
                  if (contextMenu.type === "column")
                    deleteColumn(contextMenu.index);
                  setContextMenu({ ...contextMenu, show: false });
                }}
                variant="SidebarMenuButton_destructive"
                className="w-full justify-start px-4 py-2 h-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {contextMenu.type === "row" ? "Row" : "Column"}
              </Button>
            )}
          </>
        )}

        <div className="h-px bg-border my-1" />

        <Button
          onClick={() => {
            deleteTable();
            setContextMenu({ ...contextMenu, show: false });
          }}
          variant="SidebarMenuButton_destructive"
          className="w-full justify-start px-4 py-2 h-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Table
        </Button>
      </div>,
      document.body,
    );
  };

  const controls = (
    <div style={{ pointerEvents: "auto" }}>
      {/* Column controls */}
      {columns.map((column, colIndex) => {
        const columnRect = (column as HTMLElement).getBoundingClientRect();
        return (
          <div
            key={`col-control-${colIndex}`}
            className="absolute z-50 group"
            style={{
              left: `${columnRect.left - editorRect.left}px`,
              top: `${tableRect.top - editorRect.top - 32}px`,
              width: `${columnRect.width}px`,
            }}
          >
            <div className="flex items-center justify-center mx-auto w-fit">
              <Button
                onContextMenu={(e) => handleContextMenu(e, "column", colIndex)}
                onClick={() => addColumnAfter(colIndex)}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-md hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                onClick={(e) => handleContextMenu(e, "column", colIndex)}
                variant="ghost"
                size="sm"
                className="h-6 px-2 rounded-md hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}

      {/* Row controls */}
      {rows.map((row, rowIndex) => {
        const rowRect = (row as HTMLElement).getBoundingClientRect();
        return (
          <div
            key={`row-control-${rowIndex}`}
            className="absolute z-50 group"
            style={{
              left: `${tableRect.left - editorRect.left - 32}px`,
              top: `${rowRect.top - editorRect.top}px`,
              height: `${rowRect.height}px`,
            }}
          >
            <div className="flex flex-col items-center h-full justify-center">
              <Button
                onContextMenu={(e) => handleContextMenu(e, "row", rowIndex)}
                onClick={() => addRowAfter(rowIndex)}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-md hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                onClick={(e) => handleContextMenu(e, "row", rowIndex)}
                variant="ghost"
                size="sm"
                className="h-6 px-2 rounded-md hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity mt-1"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {createPortal(controls, portalContainer)}
      <ContextMenuComponent />
    </>
  );
};
