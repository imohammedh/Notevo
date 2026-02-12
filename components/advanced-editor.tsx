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
import { useState, useEffect } from "react";
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
import { TableControls } from "./table-controls";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { useTheme } from "next-themes";
import {
  getHierarchicalIndexes,
  TableOfContents,
} from "@tiptap/extension-table-of-contents";
import { CompactFloatingToC } from "./ToC";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [openAI, setOpenAI] = useState(false);
  const [editorInstance, setEditorInstance] = useState<EditorInstance | null>(
    null,
  );
  const [items, setItems] = useState<any[]>([]);
  const [dragHandleColor, setDragHandleColor] = useState<string>();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme !== "dark") {
      setDragHandleColor("#644a40");
    } else {
      setDragHandleColor("#ffe0c2");
    }
  }, [resolvedTheme]);

  useEffect(() => {
    if (!editorInstance) return;

    const syncToC = () => {
      // Force ToC update by dispatching a transaction
      editorInstance.view.dispatch(editorInstance.state.tr);
    };

    // Listen to all relevant events
    editorInstance.on("create", syncToC);
    editorInstance.on("update", syncToC);
    editorInstance.on("selectionUpdate", syncToC);
    editorInstance.on("focus", syncToC);

    // Initial sync
    syncToC();

    return () => {
      editorInstance.off("create", syncToC);
      editorInstance.off("update", syncToC);
      editorInstance.off("selectionUpdate", syncToC);
      editorInstance.off("focus", syncToC);
    };
  }, [editorInstance]);

  // Create extensions array with ToC configuration
  const extensions = [
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TableOfContents.configure({
      getIndex: getHierarchicalIndexes,
      onUpdate(content) {
        setItems(content);
      },
    }),
    Placeholder.configure({
      placeholder: "Press '/' for commands, or start writing...",
      emptyEditorClass:
        "is-editor-empty before:content-[attr(data-placeholder)] before:float-left before:text-primary/60 before:pointer-events-none before:cursor-text before:h-0",
      showOnlyWhenEditable: true,
      includeChildren: true,
    }),
    ...defaultExtensions,
    slashCommand,
  ];

  // Handler for adding new block below current position
  const handleAddBlock = () => {
    if (!editorInstance) return;

    const { state } = editorInstance;
    const { selection } = state;
    const { $from } = selection;

    // Find the end of the current block
    const endPos = $from.end();

    // Insert a new paragraph after the current block
    editorInstance
      .chain()
      .focus()
      .insertContentAt(endPos, { type: "paragraph" })
      .setTextSelection(endPos + 1)
      .run();
  };

  return (
    <>
      <EditorRoot>
        <div className="relative">
          {editorInstance && (
            <>
              <TableControls editor={editorInstance} />
              <DragHandle
                editor={editorInstance}
                tippyOptions={{
                  zIndex: 9999,
                  duration: 300,
                  animation: "shift-toward-subtle",
                  moveTransition: "transform 0.15s ease-out",
                }}
              >
                <div className="flex justify-center items-center gap-1">
                  {/* Add Block Button */}
                  <Button
                    onClick={handleAddBlock}
                    variant="Trigger"
                    size="icon"
                    className="h-4 w-4 p-0 rounded mt-0.5"
                  >
                    <Plus stroke={dragHandleColor} strokeWidth={3} />
                  </Button>

                  {/* Drag Handle Icon */}
                  <div className="cursor-grab active:cursor-grabbing">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="3"
                      stroke={dragHandleColor}
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
                  </div>
                </div>
              </DragHandle>
            </>
          )}
          <EditorContent
            initialContent={initialContent}
            autofocus={true}
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
            onCreate={({ editor }) => {
              setEditorInstance(editor);
              onUpdate(editor);
            }}
            onUpdate={({ editor }) => {
              onUpdate(editor);
            }}
            slotAfter={<ImageResizer />}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-lg border border-border bg-muted px-0.5 py-2 transition-all scroll-smooth scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                No results
              </EditorCommandEmpty>
              <EditorCommandList>
                {suggestionItems.map((item: any) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => item.command(val)}
                    className="flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left text-sm text-foreground hover:bg-primary/10 aria-selected:bg-primary/10"
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
              <Separator orientation="vertical" />
              <TextButtons />
              <Separator orientation="vertical" />
              <ColorSelector open={openColor} onOpenChange={setOpenColor} />
            </GenerativeMenuSwitch>
          </EditorContent>
        </div>
      </EditorRoot>

      {/* Compact Floating ToC */}
      <CompactFloatingToC items={items} editor={editorInstance} />
    </>
  );
};

export default TailwindAdvancedEditor;
