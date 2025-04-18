"use client";
import { HowToStartSteps } from "../../lib/data";
import SectionHeading from "./SectionHeading";
import MaxWContainer from "../ui/MaxWContainer";
import Section from "../ui/Section";

export default function HowToStartSection() {
  return (
    <Section sectionId="How_To_Start">
      <MaxWContainer>
        <SectionHeading
          SectionTitle="How To Start ?"
          SectionSubTitle="it has never been easier"
        />
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {HowToStartSteps.map((step) => (
            <div
              key={step.id}
              className="relative flex justify-center items-start group hover:scale-105 transition-all duration-300"
            >
              <div className="absolute -top-5 left-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-brand_tertiary/10 rounded-xl flex items-center justify-center group-hover:bg-brand_tertiary/30 transition-all duration-300">
                  <span className="text-brand_tertiary/50 group-hover:text-brand_tertiary">
                    {" "}
                    {step.StepNum}
                    <div className="absolute top-0 left-0 w-2 h-2 bg-purple-900 rounded-full group-hover:scale-150 group-hover:bg-purple-400 transition-all duration-300" />
                  </span>
                </div>
              </div>
              <div className="py-4 px-3 sm:px-4 w-full max-w-sm transition-all ease-in-out duration-300 group-hover:border-brand_tertiary">
                <h3 className="py-2 text-lg md:text-xl lg:text-2xl text-brand_tertiary font-semibold group-hover:text-brand_tertiary/90">
                  {step.Title}
                </h3>
                <p className="text-sm md:text-base text-brand_tertiary/50 font-bold group-hover:text-brand_tertiary/70">
                  {step.Body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </MaxWContainer>
    </Section>
  );
}
