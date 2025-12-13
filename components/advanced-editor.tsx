"use client";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  Placeholder,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { useState, useRef, useEffect } from "react";
import { defaultExtensions } from "./extensions";
import { slashCommand, suggestionItems } from "./slash-command";
import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { Separator } from "./ui/separator";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TextButtons } from "./selectors/text-buttons";
import { uploadFn } from "./image-upload";
import { ColorSelector } from "./selectors/color-selector";
// REMOVED: import { TableSelector } from "./selectors/table-selector";
import { TableControls } from "./table-controls";
import Highlight from "@tiptap/extension-highlight";

const placeholderExtension = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "paragraph") {
      return "Write something or Press '/' for commands";
    }
    if (node.type.name === "heading" && node.attrs.level === 1) {
      return "Header 1";
    }
    if (node.type.name === "heading" && node.attrs.level === 2) {
      return "Header 2";
    }
    if (node.type.name === "heading" && node.attrs.level === 3) {
      return "Header 3";
    }
    return "";
  },
  showOnlyWhenEditable: true,
  showOnlyCurrent: true,
  includeChildren: false,
});

const extensions = [
  placeholderExtension,
  TextStyle,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  ...defaultExtensions,
  slashCommand,
];

const TailwindAdvancedEditor = ({
  initialContent,
  onUpdate,
}: {
  initialContent: any;
  onUpdate: (editor: EditorInstance) => void;
}) => {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  // REMOVED: const [openTable, setOpenTable] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const [editorInstance, setEditorInstance] = useState<EditorInstance | null>(
    null,
  );

  return (
    <>
      <style jsx global>{`
        /* Table resize handle styling */
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1rem 0;
          overflow: hidden;
          position: relative;
        }

        .ProseMirror th,
        .ProseMirror td {
          min-width: 1em;
          border: 1px solid hsl(var(--border));
          padding: 0.75rem;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }

        .ProseMirror th {
          font-weight: 600;
          text-align: left;
          background-color: hsl(var(--muted));
        }

        /* IMPORTANT: Cell selection highlight */
        .ProseMirror .selectedCell {
          background-color: rgba(59, 130, 246, 0.1);
        }

        .ProseMirror .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: rgba(59, 130, 246, 0.15);
          pointer-events: none;
          border: 2px solid rgb(59, 130, 246);
        }

        .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: rgb(59, 130, 246);
          pointer-events: none;
          z-index: 20;
        }

        .ProseMirror.resize-cursor {
          cursor: ew-resize;
          cursor: col-resize;
        }

        /* Drag handle styling */
        .ProseMirror .drag-handle {
          position: absolute;
          opacity: 0;
          transition: opacity 0.2s;
          cursor: grab;
        }

        .ProseMirror:hover .drag-handle {
          opacity: 1;
        }

        .ProseMirror .drag-handle:hover {
          background-color: hsl(var(--muted));
        }

        .ProseMirror .drag-handle:active {
          cursor: grabbing;
        }

        /* Table hover effect */
        .ProseMirror table:hover {
          box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
        }

        /* Cell focus effect */
        .ProseMirror td:focus,
        .ProseMirror th:focus {
          outline: 2px solid rgb(59, 130, 246);
          outline-offset: -2px;
        }
      `}</style>

      <EditorRoot>
        <div className="relative w-full">
          {editorInstance && <TableControls editor={editorInstance} />}

          <EditorContent
            initialContent={initialContent}
            extensions={extensions}
            className="relative w-full bg-transparent text-foreground placeholder"
            editorProps={{
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              handlePaste: (view, event) =>
                handleImagePaste(view, event, uploadFn),
              handleDrop: (view, event, _slice, moved) =>
                handleImageDrop(view, event, moved, uploadFn),
              attributes: {
                class:
                  "text-foreground py-6 prose-stone prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none w-full",
              },
            }}
            onUpdate={({ editor }) => {
              onUpdate(editor);
              if (editor && !editorInstance) {
                setEditorInstance(editor);
              }
            }}
            slotAfter={<ImageResizer />}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-lg border border-border bg-popover px-1 py-2 transition-all scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-transparent">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                No results
              </EditorCommandEmpty>
              <EditorCommandList>
                {suggestionItems.map((item: any) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => item.command(val)}
                    className="flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
            </EditorCommand>
            <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
              <Separator orientation="vertical" />
              <NodeSelector open={openNode} onOpenChange={setOpenNode} />
              <Separator orientation="vertical" />
              <LinkSelector open={openLink} onOpenChange={setOpenLink} />
              {/* REMOVED: Table selector from bubble menu - controls now only on sides */}
              <Separator orientation="vertical" />
              <TextButtons />
              <Separator orientation="vertical" />
              <ColorSelector open={openColor} onOpenChange={setOpenColor} />
            </GenerativeMenuSwitch>
          </EditorContent>
        </div>
      </EditorRoot>
    </>
  );
};

export default TailwindAdvancedEditor;
