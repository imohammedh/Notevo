import Link from "next/link";
import { Button } from "@/components/ui/button";
import imgsrc from "../public/Notevo-logo.svg";
import Image from "next/image";
import Section from "@/components/ui/Section";
import MaxWContainer from "@/components/ui/MaxWContainer";
export default function NotFound() {
  return (
    <Section>
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
        <div className=" absolute -z-20 bg-gradient-to-t from-purple-900/30 from-15% to-brand_fourthary left-0 top-5 sm:top-16 h-[20rem] w-full rounded-xl blur-[6rem]" />
      </MaxWContainer>
    </Section>
  );
}
