import {
  ArrowDownWideNarrow,
  CheckCheck,
  RefreshCcwDot,
  StepForward,
  WrapText,
} from "lucide-react";
import { getPrevText, useEditor } from "novel";
import { CommandGroup, CommandItem, CommandSeparator } from "../ui/command";

const options = [
  {
    value: "improve",
    label: "Improve writing",
    icon: RefreshCcwDot,
  },
  {
    value: "fix",
    label: "Fix grammar",
    icon: CheckCheck,
  },
  {
    value: "shorter",
    label: "Make shorter",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "longer",
    label: "Make longer",
    icon: WrapText,
  },
];

interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void;
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor();

  return (
    <>
      <CommandGroup heading="Edit or review selection" className="bg-popover">
        {options.map((option) => (
          <CommandItem
            onSelect={(value) => {
              const slice = editor?.state.selection.content();
              const text = editor?.storage.markdown.serializer.serialize(
                slice?.content,
              );
              onSelect(text, value);
            }}
            className="flex gap-2 px-4 text-foreground hover:bg-accent hover:text-accent-foreground"
            key={option.value}
            value={option.value}
          >
            <option.icon className="h-4 w-4 text-primary" />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Use AI to do more" className="text-foreground">
        <CommandItem
          onSelect={() => {
            if (editor) {
              const pos = editor.state.selection.from;
              const text = "hi there let's talk about short form videos";
              onSelect(text, "continue");
            }
          }}
          value="continue"
          className="gap-2 px-4 text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <StepForward className="h-4 w-4 text-primary" />
          Continue writing
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AISelectorCommands;
