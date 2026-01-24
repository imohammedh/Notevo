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
import DragHandle from "@tiptap/extension-drag-handle-react";
// REMOVED: import { TableSelector } from "./selectors/table-selector";
import { TableControls } from "./table-controls";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { useTheme } from "next-themes";
// ── All extensions used by the editor ──
const extensions = [
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),

  // Placeholder — shows when editor is empty
  Placeholder.configure({
    placeholder: "Press '/' for commands, or start writing...",
    emptyEditorClass:
      "is-editor-empty before:content-[attr(data-placeholder)] before:float-left before:text-primary/60 before:pointer-events-none before:cursor-text before:h-0",
    showOnlyWhenEditable: true,
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
  const [dragHandleColor, setDragHandleColor] = useState<string>();
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (resolvedTheme !== "dark") {
      setDragHandleColor("#644a40");
    } else {
      setDragHandleColor("#ffe0c2");
    }
  }, [resolvedTheme]);

  return (
    <>
      <EditorRoot>
        <div className="relative ">
          {editorInstance && (
            <>
              <TableControls editor={editorInstance} />{" "}
              <DragHandle editor={editorInstance}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke={dragHandleColor}
                >
                  <path
                    d="
          M9 6
          a1.25 1.25 0 1 0 0.01 0
          M15 6
          a1.25 1.25 0 1 0 0.01 0
          M9 12
          a1.25 1.25 0 1 0 0.01 0
          M15 12
          a1.25 1.25 0 1 0 0.01 0
          M9 18
          a1.25 1.25 0 1 0 0.01 0
          M15 18
          a1.25 1.25 0 1 0 0.01 0
        "
                  />
                </svg>
              </DragHandle>
            </>
          )}
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
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-lg border border-border bg-muted px-0.5 py-2 transition-all scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                No results
              </EditorCommandEmpty>
              <EditorCommandList>
                {suggestionItems.map((item: any) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => item.command(val)}
                    className="flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left text-sm text-foreground hover:bg-primary/10 aria-selected:bg-foreground/10"
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg text-primary">
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
