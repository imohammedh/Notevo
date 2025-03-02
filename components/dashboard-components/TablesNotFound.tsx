import { NotepadText } from "lucide-react";
import CreateTableBtn from "./CreateTableBtn";
import MaxWContainer from "../ui/MaxWContainer";
interface TablesNotFoundProps {
  workingSpaceId: string | any;
}
export default function TablesNotFound({
  workingSpaceId,
}: TablesNotFoundProps) {
  return (
    <MaxWContainer>
      <div className="w-full text-center py-14">
        <div className="flex flex-col items-center justify-center gap-3">
          <NotepadText size="50" />
          <h1 className=" text-3xl font-bold text-center">
            Your working Space looks empty{" "}
          </h1>
        </div>
        <div className="w-full flex items-center justify-center mt-5">
          <CreateTableBtn workingSpaceId={workingSpaceId} />
        </div>
      </div>
    </MaxWContainer>
  );
}
