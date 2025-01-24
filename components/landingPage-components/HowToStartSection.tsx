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
            <div key={step.id} className="flex justify-center items-start">
              <div className="py-4 px-3 sm:px-4 border-t border-brand_secondary w-full max-w-sm">
                <span className="text-xs md:text-sm text-brand_secondary font-bold">
                  {step.StepNum}
                </span>
                <h3 className="py-2 text-lg md:text-xl lg:text-2xl text-brand_secondary font-semibold">
                  {step.Title}
                </h3>
                <p className="text-sm md:text-base text-brand_secondary/50 font-bold">
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
