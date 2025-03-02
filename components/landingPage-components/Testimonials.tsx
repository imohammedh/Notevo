import { testimonials1, testimonials2 } from "@/lib/data";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import MaxWContainer from "../ui/MaxWContainer";
import Section from "../ui/Section";
import SectionHeading from "./SectionHeading";
import { FaQuoteLeft } from "react-icons/fa6";
import { FaQuoteRight } from "react-icons/fa6";

export default function Testimonials() {
  return (
    <Section sectionId="testimonials">
      <MaxWContainer className="relative px-4">
        <span className="absolute top-20 -left-8 sm:-left-16 lg:-left-24 -rotate-12 text-brand_tertiary/5 blur-md">
          <FaQuoteLeft className="size-40 sm:size-60 lg:size-80" />
        </span>
        <span className="absolute bottom-0 right-2 sm:right-3 lg:right-5 -rotate-12 text-brand_tertiary/5 blur-md hidden md:block">
          <FaQuoteRight className="size-16 sm:size-20 lg:size-24" />
        </span>
        <SectionHeading
          SectionTitle="Testimonials"
          SectionSubTitle="What our users have been saying."
        />
        <div className="h-[20rem] rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={Array.from(testimonials1)}
            direction="right"
            speed="fast"
          />
          <InfiniteMovingCards
            items={Array.from(testimonials2)}
            direction="left"
            speed="fast"
          />
        </div>
      </MaxWContainer>
    </Section>
  );
}
