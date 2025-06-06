import Link from "next/link";
import { Button } from "@/components/ui/button";
import imgsrc from "../public/Notevo-logo.svg";
import Image from "next/image";
import Section from "@/components/ui/Section";
import MaxWContainer from "@/components/ui/MaxWContainer";
export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-start bg-gradient-to-br from-brand_fourthary via-purple-600/10 to-brand_primary p-6 md:p-10">
      <MaxWContainer className="flex flex-col items-center justify-center gap-4 *:text-center relative px-4 sm:px-6 lg:px-8">
        <div className=" w-full flex justify-center items-center py-5">
          <Image
            src={imgsrc}
            alt="NoteWise Logo"
            priority
            width={20}
            height={20}
          />
          <p className=" text-brand_secondary/70 text-xs  font-medium px-2">
            {` ! Hi this is Notevo team we're really soory for this `}
          </p>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-7xl pb-3 lg:pb-5 bg-gradient-to-b from-brand_secondary to-transparent bg-clip-text text-transparent font-semibold">
          404 Not Found
        </h2>
        <p className=" text-brand_secondary/70 text-sm sm:text-lg lg:text-xl font-medium lg:font-medium px-2">
          Could not find requested resource
        </p>
        <Button className="w-full sm:w-auto">
          <Link href="/">Return Home</Link>
        </Button>
      </MaxWContainer>
    </section>
  );
}
