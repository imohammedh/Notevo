import MaxWContainer from "../ui/MaxWContainer";
import Section from "../ui/Section";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import IMGSrc from "@/public/picofme.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LiaQuoteLeftSolid } from "react-icons/lia";
export default function MoreAboutMe() {
  return (
    <Section sectionId="more-about-me">
      <MaxWContainer>
        <Card className="relative bg-gradient-to-br from-brand_fourthary from-15% via-purple-600/10 to-transparent border-brand_tertiary/5 p-5 sm:p-10">
          <span className=" absolute -top-10 left-1 -rotate-2 opacity-60 text-purple-600">
            <LiaQuoteLeftSolid className="size-14 sm:size-16 lg:size-20" />
          </span>
          <span className=" absolute -top-10 left-0 -rotate-2 opacity-60 text-purple-950">
            <LiaQuoteLeftSolid className="size-14 sm:size-16 lg:size-20" />
          </span>
          <CardContent className=" w-full flex flex-col sm:flex-row justify-between items-center">
            <div className=" p-2 rounded-xl flex-shrink-0">
              <Image
                src={IMGSrc}
                alt="Mohammed"
                width={300}
                height={300}
                className="mask-image-gradient rounded-xl"
              />
            </div>
            <div className=" h-full flex justify-between items-center flex-col gap-4 w-full sm:w-2/3">
              <h1 className=" text-start text-lg sm:text-xl lg:text-2xl pb-3 lg:pb-5 bg-gradient-to-b from-brand_secondary from-15% to-transparent bg-clip-text text-transparent sm:text-left">
                {`Hi everyone, I’ve been looking for a note-taking app that’s simpler than Notion but more organized than Google Keep. 
                Something clean, structured, with a rich text editor—and a little AI to help. 
                That’s what Notevo is: a minimal, structured, AI-powered note-taking app`}
              </h1>
              <span className=" w-full flex justify-center items-start flex-col text-brand_tertiary/50">
                <p>- Mohammed H </p>
              </span>
            </div>
          </CardContent>
        </Card>
      </MaxWContainer>
    </Section>
  );
}
