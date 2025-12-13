"use client";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Editor } from "@tiptap/core";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
interface TableControlsProps {
  editor: Editor;
}

export const TableControls = ({ editor }: TableControlsProps) => {
  const [activeTable, setActiveTable] = useState<HTMLTableElement | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const timeoutRef = useRef<number>(10);

  useEffect(() => {
    if (!editor) return;

    const editorElement = editor.view.dom;

    // Find or create portal container
    let container = editorElement.parentElement?.querySelector(
      ".table-controls-portal",
    ) as HTMLElement;
    if (!container) {
      container = document.createElement("div");
      container.className = "table-controls-portal";
      container.style.cssText =
        "position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999;";

      // Make parent relative
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

    // Only detect hover over table headers (th elements)
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if hovering over a th element or the first row
      const th = target.closest("th");
      const firstRow = target.closest("tr:first-child");

      if ((th || firstRow) && target.closest("table")) {
        const table = target.closest("table");
        if (table && table.closest(".ProseMirror")) {
          setActiveTable(table as HTMLTableElement);

          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
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

    editorElement.addEventListener("mousemove", handleMouseMove);
    editorElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      editorElement.removeEventListener("mousemove", handleMouseMove);
      editorElement.removeEventListener("mouseleave", handleMouseLeave);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [editor]);

  if (!activeTable || !portalContainer) return null;

  const handleControlsMouseEnter = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  };

  const handleControlsMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setActiveTable(null);
    }, 10);
  };

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
  //<button onClick={() => editor.chain().focus().deleteTable().run()}>Delete table</button> {from tiptap doc's}

  const addColumnAfter = (colIndex: number) => {
    const cell = activeTable.querySelector(
      `tr:first-child > *:nth-child(${colIndex + 1})`,
    );
    if (!cell) return;

    const pos = getCellPos(cell);
    if (pos !== null) {
      editor.chain().focus().setTextSelection(pos).addColumnAfter().run();
    }
  };
  const deleteTable = () => editor.chain().focus().deleteTable().run();

  const deleteColumn = (colIndex: number) => {
    if (columns.length <= 1) return;

    const cell = activeTable.querySelector(
      `tr:first-child > *:nth-child(${colIndex + 1})`,
    );
    if (!cell) return;

    const pos = getCellPos(cell);
    if (pos !== null) {
      editor.chain().focus().setTextSelection(pos).deleteColumn().run();
    }
  };

  const addRowAfter = (rowIndex: number) => {
    const row = rows[rowIndex];
    if (!row) return;

    const cell = row.querySelector("th, td");
    if (!cell) return;

    const pos = getCellPos(cell);
    if (pos !== null) {
      editor.chain().focus().setTextSelection(pos).addRowAfter().run();
    }
  };

  const deleteRow = (rowIndex: number) => {
    if (rows.length <= 1) return;

    const row = rows[rowIndex];
    if (!row) return;

    const cell = row.querySelector("th, td");
    if (!cell) return;

    const pos = getCellPos(cell);
    if (pos !== null) {
      editor.chain().focus().setTextSelection(pos).deleteRow().run();
    }
  };

  const editorRect = editor.view.dom.parentElement?.getBoundingClientRect();
  const tableRect = activeTable.getBoundingClientRect();

  if (!editorRect) return null;

  const controls = (
    <div
      onMouseEnter={handleControlsMouseEnter}
      onMouseLeave={handleControlsMouseLeave}
      style={{ pointerEvents: "auto" }}
    >
      {/* Column controls */}
      {columns.map((column, colIndex) => {
        const columnRect = (column as HTMLElement).getBoundingClientRect();

        return (
          <div
            key={`col-control-${colIndex}`}
            className="absolute z-50"
            style={{
              left: `${columnRect.left - editorRect.left}px`,
              top: `${tableRect.top - editorRect.top - 36}px`,
              width: `${columnRect.width}px`,
            }}
          >
            <div className="flex items-center justify-center mx-auto w-fit bg-accent/50 backdrop-blur-sm border border-border rounded-lg shadow-lg">
              <Button
                onClick={() => addColumnAfter(colIndex)}
                variant="SidebarMenuButton"
              >
                <Plus className="w-4 h-4 text-foreground" />
              </Button>

              {columns.length > 1 && (
                <Button
                  onClick={() => deleteColumn(colIndex)}
                  variant="SidebarMenuButton"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
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
            className="absolute z-50"
            style={{
              left: `${tableRect.left - editorRect.left - 43}px`,
              top: `${rowRect.top - editorRect.top + 10}px`,
              height: `${rowRect.height}px`,
            }}
          >
            <div className="flex flex-col items-center justify-center mx-auto w-full bg-accent/50 backdrop-blur-sm border border-border rounded-lg shadow-lg">
              <Button
                onClick={() => addRowAfter(rowIndex)}
                variant="SidebarMenuButton"
              >
                <Plus className="w-4 h-4 text-foreground" />
              </Button>

              {rows.length > 1 && (
                <Button
                  onClick={() => deleteRow(rowIndex)}
                  variant="SidebarMenuButton"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return createPortal(controls, portalContainer);
};
