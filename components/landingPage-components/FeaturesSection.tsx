import MaxWContainer from "../ui/MaxWContainer"
import SectionHeading from "./SectionHeading"
import { features } from "@/lib/data"
import Section from "../ui/Section"
export default function FeaturesSection() {
  return (
    <Section 
      sectionId="features" 
      className="bg-gradient-to-r from-transparent to-brand_tertiary/5 rounded-e-badge px-4 sm:px-6"
    >
      <MaxWContainer>
        <SectionHeading
          SectionTitle="Features"
          SectionSubTitle="Dive deeper into how our AI-powered note-taking platform can revolutionize your productivity and idea management."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {features.map(item => (
            <div key={item.id} className="w-full">
              <div className="space-y-2 md:space-y-3 p-4 md:p-5 lg:p-6 
                bg-brand_secondary/70 backdrop-blur-2xl 
                border border-solid border-brand_primary/50 rounded-xl 
                w-full h-full transition-all duration-300 hover:scale-[1.02]">
                <h3 className="text-base md:text-lg lg:text-xl text-brand_primary font-bold">
                  {item.Title}
                </h3>
                <p className="text-sm md:text-base text-brand_primary/70 font-medium">
                  {item.Body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </MaxWContainer>
    </Section>
  )
}
