"use client";
import { HowToStartSteps } from "../../lib/data"
import SectionHeading from "./SectionHeading"
import MaxWContainer from "../ui/MaxWContainer"
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
          {HowToStartSteps.map(step => (
            <div key={step.id} className="relative flex justify-center items-start group">
              <span className=" absolute -top-5 left-0 text-sm md:text-sm text-brand_tertiary/20 font-bold transition-all ease-in-out duration-300 group-hover:rotate-45 group-hover:scale-125  group-hover:text-brand_tertiary">
                {step.StepNum}
              </span>
              <div className="py-4 px-3 sm:px-4 border-t border-brand_tertiary/20 w-full max-w-sm transition-all ease-in-out duration-300 group-hover:border-brand_tertiary">
                <h3 className="py-2 text-lg md:text-xl lg:text-2xl text-brand_tertiary font-semibold">
                  {step.Title}
                </h3>
                <p className="text-sm md:text-base text-brand_tertiary/50 font-bold">
                  {step.Body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </MaxWContainer>
    </Section>
  )
}
