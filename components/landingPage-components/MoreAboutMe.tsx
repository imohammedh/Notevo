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
    <Section sectionId="about">
      <MaxWContainer>
        <Card className="relative bg-gradient-to-br from-primary/50 via-secondary to-transparent border-border p-5 sm:p-10">
          <span className="absolute -top-8 sm:-top-10 left-0 -rotate-2 opacity-60 text-primary">
            <LiaQuoteLeftSolid className="size-14 sm:size-16 lg:size-20" />
          </span>
          <span className="absolute -top-8 sm:-top-10 left-1 -rotate-2 opacity-60 text-primary-foreground">
            <LiaQuoteLeftSolid className="size-14 sm:size-16 lg:size-20" />
          </span>
          <CardContent className="w-full flex flex-col sm:flex-row justify-between items-center">
            <div className="p-2 rounded-xl flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-xl" />
              <Image
                src={IMGSrc}
                alt="Mohammed"
                width={300}
                height={300}
                className="relative rounded-xl"
              />
            </div>
            <div className="h-full flex justify-between items-center flex-col gap-3 w-full sm:w-2/3">
              <h1 className="text-start text-lg sm:text-xl lg:text-2xl pb-3 lg:pb-5 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent sm:text-left">
                {`I've been looking for a note-taking app that's simpler than Notion but more organized than Google Keep. 
                Something clean, structured, with a rich text editor. 
                That's what Notevo's trying to be: a minimal, structured, note-taking app`}
              </h1>
              <span className="w-full flex justify-center items-start flex-col gap-2 text-muted-foreground">
                <p className="font-semibold text-base">Mohammed H</p>
                <p className="font-light text-sm">Software Dev @Notevo</p>
              </span>
            </div>
          </CardContent>
        </Card>
      </MaxWContainer>
    </Section>
  );
}
