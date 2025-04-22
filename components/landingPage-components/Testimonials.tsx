import { testimonials1, testimonials2 } from "@/lib/data";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import MaxWContainer from "../ui/MaxWContainer";
import Section from "../ui/Section";
import SectionHeading from "./SectionHeading";
import { LiaQuoteLeftSolid } from "react-icons/lia";
import { LiaQuoteRightSolid } from "react-icons/lia";

export default function Testimonials() {
  return (
    <Section sectionId="testimonials">
      <MaxWContainer className="relative px-4">
        <SectionHeading
          SectionTitle="Testimonials"
          SectionSubTitle="What our users have been saying."
        />
        <div className="h-[20rem] rounded-lg flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden">
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
