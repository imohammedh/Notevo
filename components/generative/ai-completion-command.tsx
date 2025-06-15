import { CommandGroup, CommandItem, CommandSeparator } from "../ui/command";
import { useEditor } from "novel";
import { Check, TextQuote, TrashIcon } from "lucide-react";

const AICompletionCommands = ({
  completion,
  onDiscard,
}: {
  completion: string;
  onDiscard: () => void;
}) => {
  const { editor } = useEditor();
  return (
    <>
      <CommandGroup className="bg-popover">
        <CommandItem
          className="gap-2 px-4 text-foreground hover:bg-accent hover:text-accent-foreground"
          value="replace"
          onSelect={() => {
            const selection = editor?.view.state.selection;

            editor
              ?.chain()
              .focus()
              .insertContentAt(
                {
                  from: selection?.from || 0,
                  to: selection?.to || 0,
                },
                completion,
              )
              .run();
          }}
        >
          <Check className="h-4 w-4 text-primary" />
          Replace selection
        </CommandItem>
        <CommandItem
          className="gap-2 px-4 text-foreground hover:bg-accent hover:text-accent-foreground"
          value="insert"
          onSelect={() => {
            const selection = editor?.view.state.selection;
            if (selection) {
              editor
                ?.chain()
                .focus()
                .insertContentAt(selection.to + 1, completion)
                .run();
            }
          }}
        >
          <TextQuote className="h-4 w-4 text-primary" />
          Insert below
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />

      <CommandGroup>
        <CommandItem onSelect={onDiscard} value="thrash" className="gap-2 px-4 text-destructive hover:bg-destructive/10">
          <TrashIcon className="h-4 w-4" />
          Discard
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AICompletionCommands;
