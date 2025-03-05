import { NotepadText } from "lucide-react";
import CreateNoteBtn from "./CreateNoteBtn";
import MaxWContainer from "../ui/MaxWContainer";
interface NoteNotFoundProps {
  notesTableId: string | any;
  workingSpacesSlug: string | any;
}
export default function NoteNotFound({
  notesTableId,
  workingSpacesSlug,
}: NoteNotFoundProps) {
  return (
    <MaxWContainer>
      <div className="w-full text-center py-14">
        <div className="flex flex-col items-center justify-center gap-3">
          <NotepadText size="50" />
          <h1 className=" text-3xl font-bold text-center">
            Your table looks empty{" "}
          </h1>
        </div>
        <div className="w-full flex items-center justify-center mt-5">
          <CreateNoteBtn
            notesTableId={notesTableId}
            workingSpacesSlug={workingSpacesSlug}
          />
        </div>
      </div>
    </MaxWContainer>
  );
}
