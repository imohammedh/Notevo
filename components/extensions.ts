import {
  AIHighlight,
  CharacterCount,
  Color,
  CustomKeymap,
  GlobalDragHandle,
  HighlightExtension,
  HorizontalRule,
  Mathematics,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  Twitter,
  UpdatedImage,
  Youtube,
} from "novel";
import { UploadImagesPlugin } from "novel";
import { cx } from "class-variance-authority";
import { common, createLowlight } from "lowlight";
import typescript from "highlight.js/lib/languages/typescript";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

const aiHighlight = AIHighlight;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      "text-blue-700 underline underline-offset-[3px] hover:text-blue-800 transition-colors cursor-pointer",
    ),
  },
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx("opacity-40 rounded-lg border border-stone-200"),
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
});
const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx("rounded-lg"),
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {},
});

const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-4"),
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-muted-foreground"),
  },
});

const starterKit = StarterKit.configure({
  codeBlock: false,
  bulletList: {
    HTMLAttributes: {
      lass: cx("list-disc list-outside leading-3 -mt-2"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-outside leading-3 -mt-2"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-normal -mb-2"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx("border-l-4 border-primary"),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx(
        "rounded-lg bg-brand_fourthary text-brand_tertiary px-1.5 py-1 font-mono font-medium",
      ),
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  gapcursor: false,
});

const lowlight = createLowlight(common);
lowlight.register("typescript", typescript);

const customCodeBlock = CodeBlockLowlight.configure({
  lowlight,
  HTMLAttributes: {
    class: "code-block-wrapper",
  },
});

const youtube = Youtube.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted my-4"),
  },
  inline: false,
  width: 640,
  height: 480,
});

// Table Extensions with proper styling
const table = Table.configure({
  resizable: true,
  lastColumnResizable: true,
  allowTableNodeSelection: true,
  HTMLAttributes: {
    class: cx("border-collapse table-auto w-full my-4"),
  },
});

const tableRow = TableRow.configure({
  HTMLAttributes: {
    class: cx("border-t border-border"),
  },
});

const tableHeader = TableHeader.configure({
  HTMLAttributes: {
    class: cx(
      "border border-border bg-muted font-semibold text-left p-3 min-w-[100px]",
    ),
  },
});

const tableCell = TableCell.configure({
  HTMLAttributes: {
    class: cx("border border-border p-3 min-w-[100px] relative"),
  },
});

export const defaultExtensions = [
  starterKit,
  GlobalDragHandle,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  aiHighlight,
  customCodeBlock,
  youtube,
  table,
  tableRow,
  tableHeader,
  tableCell,
];
