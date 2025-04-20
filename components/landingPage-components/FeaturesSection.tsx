import MaxWContainer from "../ui/MaxWContainer";
import SectionHeading from "./SectionHeading";
import { features } from "@/lib/data";
import Section from "../ui/Section";
import Image from "next/image";
import { WobbleCard } from "../ui/wobble-card";
import AIPoweredimg from "@/public/AI-Powered.svg";
import RichTextEditorimg from "@/public/Rich Text Editor.svg";
import Organize from "@/public/Organize.svg";
import Activities from "@/public/Activities.svg";

export default function FeaturesSection() {
  return (
    <Section
      sectionId="features"
      className="relative px-0 sm:px-0 md:px-0 pt-2 sm:pt-2 md:pt-2 lg:pt-2 bg-gradient-to-t from-transparent from-15% via-purple-900/20 to-brand_fourthary"
    >
      <svg
        viewBox="0 0 1440 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="100hv"
        className="absolute top-0 bg-transparent"
      >
        <path
          d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
          fill="#0a0a0a"
        ></path>
      </svg>
      <MaxWContainer>
        <SectionHeading
          SectionTitle="Features"
          SectionSubTitle="Dive deeper into how our AI-powered note-taking platform can revolutionize your productivity and idea management."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
          <WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full bg-gradient-to-br from-brand_fourthary from-15% via-purple-600/10 to-brand_tertiary/20 min-h-[500px] lg:min-h-[300px]">
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
          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-brand_fourthary from-15% to-brand_tertiary/20">
            <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-brand_tertiary">
              Sync Across Devices
            </h2>
            <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
              Access your notes from anywhere with seamless syncing across all
              your devices.
            </p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-gradient-to-br from-brand_fourthary from-15% via-green-600/10 to-brand_tertiary/20 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
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
          <WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full bg-gradient-to-br from-brand_fourthary from-15% to-brand_tertiary/20 min-h-[500px] lg:min-h-[300px]">
            <div className="max-w-xs">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-brand_tertiary">
                Organize your thoughts
              </h2>
              <p className="mt-4 text-left  text-base/6 text-neutral-200">
                manage your workspaces, and boost your productivity with Notevo.
              </p>
            </div>
            <Image
              src={Organize}
              width={500}
              height={500}
              alt="linear demo image"
              className="absolute -right-4 lg:-right-[20%] grayscale filter -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-brand_fourthary from-15% via-purple-600/10 to-brand_tertiary/20">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-brand_tertiary">
                Track Daily Activities
              </h2>
            </div>
            <Image
              src={Activities}
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
