import { testimonials } from "../../lib/data"
import MaxWContainer from "../ui/MaxWContainer"
import Section from "../ui/Section"
import SectionHeading from "./SectionHeading"
import { FaQuoteLeft } from "react-icons/fa6";
import { FaQuoteRight } from "react-icons/fa6";

export default function Testimonials() {
  return (
    <Section sectionId="testimonials">
        <MaxWContainer className="relative px-4">
            <span className="absolute top-20 -left-8 sm:-left-16 lg:-left-24 -rotate-12 text-brand_tertiary/10 blur-md">
                <FaQuoteLeft className="size-40 sm:size-60 lg:size-80"/>
            </span>
            <span className="absolute bottom-0 right-2 sm:right-3 lg:right-5 -rotate-12 text-brand_tertiary/10 blur-md hidden md:block">
                <FaQuoteRight className="size-16 sm:size-20 lg:size-24"/>
            </span>
            <SectionHeading
                SectionTitle="Testimonials"
                SectionSubTitle="What our users have been saying."
            />
            <div className="relative py-5">
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                    {testimonials.map(item => (
                        <div 
                            key={item.id} 
                            className={`z-20 h-full bg-transparent border border-solid border-brand_tertiary/10 rounded-xl p-4 bg-${item.Color} transition-transform hover:scale-[1.02] hover:border-brand_tertiary/50`}
                        >
                            <p className="text-brand_tertiary text-sm sm:text-base font-medium">{`"${item.Body}"`}</p>
                        </div>
                    ))}
                </div>
            </div>
        </MaxWContainer>
    </Section>
  )
}
