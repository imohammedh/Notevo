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
import Highlight from "@tiptap/extension-highlight";

// Enhanced placeholder with more detailed instructions
const placeholderExtension = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "paragraph") {
      return "Write something or Press '/' for commands";
    }
    return "";
  },
  showOnlyWhenEditable: true,
  showOnlyCurrent: true,
  includeChildren: false,
});

// Simple component for the drag handle
const DragHandleIndicator = ({ editor }: { editor: EditorInstance }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dragRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editor) return;

    const editorElement = editor.view.dom;

    const handleMouseMove = (e: MouseEvent) => {
      // Skip if inside drag handle itself
      if (
        dragRef.current &&
        e.target instanceof Node &&
        dragRef.current.contains(e.target)
      ) {
        return;
      }

      // Find the closest paragraph, heading, or list item node
      let targetElement = e.target as HTMLElement | null;
      let nodeElement: HTMLElement | null = null;

      while (targetElement && targetElement !== editorElement) {
        if (
          targetElement.tagName === "P" ||
          targetElement.tagName.match(/^H[1-6]$/) ||
          targetElement.tagName === "LI"
        ) {
          nodeElement = targetElement;
          break;
        }
        targetElement = targetElement.parentElement;
      }

      if (nodeElement) {
        // Get position for the drag handle
        const rect = nodeElement.getBoundingClientRect();
        const editorRect = editorElement.getBoundingClientRect();

        setPosition({
          top: rect.top - editorRect.top, // Center vertically
          left: editorRect.left - 90, // Position to the left of the node
        });

        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const handleMouseLeave = () => {
      if (
        !dragRef.current ||
        !(document.activeElement instanceof Node) ||
        !dragRef.current.contains(document.activeElement)
      ) {
        setVisible(false);
      }
    };

    editorElement.addEventListener("mousemove", handleMouseMove);
    editorElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      editorElement.removeEventListener("mousemove", handleMouseMove);
      editorElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [editor]);

  if (!visible || !editor) return null;

  return (
    <div
      ref={dragRef}
      className="absolute z-50"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div
        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 cursor-grab"
        title="Drag to move"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="7" r="1"></circle>
          <circle cx="9" cy="12" r="1"></circle>
          <circle cx="9" cy="17" r="1"></circle>
          <circle cx="15" cy="7" r="1"></circle>
          <circle cx="15" cy="12" r="1"></circle>
          <circle cx="15" cy="17" r="1"></circle>
        </svg>
      </div>
    </div>
  );
};

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
  const [openAI, setOpenAI] = useState(false);
  const [editorInstance, setEditorInstance] = useState<EditorInstance | null>(
    null,
  );

  return (
    <EditorRoot>
      <div className="relative w-full">
        {editorInstance && <DragHandleIndicator editor={editorInstance} />}

        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="relative w-full bg-brand_primary text-brand_secondary placeholder"
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
                "text-brand_secondary py-10 prose-stone prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none w-full",
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
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-brand_tertiary/20 bg-brand_fourthary px-1 py-2 transition-all scrollbar-thin scrollbar-thumb-brand_tertiary scrollbar-track-brand_fourthary">
            <EditorCommandEmpty className="px-2 text-brand_tertiary">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item: any) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-brand_tertiary/5 aria-selected:bg-brand_tertiary/5"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-brand_tertiary/20 bg-brand_fourthary">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-brand_tertiary/50">
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
  );
};

export default TailwindAdvancedEditor;
