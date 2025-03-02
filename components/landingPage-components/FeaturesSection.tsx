import MaxWContainer from "../ui/MaxWContainer";
import SectionHeading from "./SectionHeading";
import { features } from "@/lib/data";
import Section from "../ui/Section";
import Image from "next/image";
import { WobbleCard } from "../ui/wobble-card";
import AIPoweredimg from "@/public/AI-Powered.svg";
import RichTextEditorimg from "@/public/Rich Text Editor.svg";

export default function FeaturesSection() {
  return (
    <Section sectionId="features">
      <MaxWContainer>
        <SectionHeading
          SectionTitle="Features"
          SectionSubTitle="Dive deeper into how our AI-powered note-taking platform can revolutionize your productivity and idea management."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-gradient-to-br from-brand_fourthary from-15% to-transparent min-h-[500px] lg:min-h-[300px]"
            className=""
          >
            <div className="max-w-xs">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-brand_tertiary">
                AI-Powered
              </h2>
              <p className="mt-4 text-left  text-base/6 text-neutral-200">
                Our advanced AI allows you to interact with your notes
                naturally, Ask questions, get summaries, and explore insights
                seamlessly.
              </p>
            </div>
            <Image
              src={AIPoweredimg}
              width={500}
              height={500}
              alt="linear demo image"
              className="absolute -right-4 lg:-right-[20%] grayscale filter -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-brand_fourthary from-15% to-transparent">
            <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-brand_tertiary">
              Sync Across Devices
            </h2>
            <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
              Access your notes from anywhere with seamless syncing across all
              your devices.
            </p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-gradient-to-br from-brand_fourthary from-15% to-transparent min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-brand_tertiary">
                Rich Text Editor
              </h2>
              <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                Create and edit notes with a Notion-style WYSIWYG editor,
                powered by Novel. Enjoy AI-powered autocompletion and rich text
                formatting.
              </p>
            </div>
            <Image
              src={RichTextEditorimg}
              width={500}
              height={500}
              alt="linear demo image"
              className="absolute right-10 md:-right-[40%] lg:-right-[10%] -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>
        </div>
      </MaxWContainer>
    </Section>
  );
}
