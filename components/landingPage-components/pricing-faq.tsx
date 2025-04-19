"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/";

export function PricingFAQ() {
  return (
    <section className="py-16 container px-4 md:px-6 mx-auto">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-brand_tertiary/20">
            <AccordionTrigger className="text-brand_tertiary/90">
              What's included in the free plan?
            </AccordionTrigger>
            <AccordionContent className="text-brand_tertiary/70">
              The free plan includes up to 3 workspaces, basic note editing
              features, and up to 50 notes per workspace. It's perfect for
              individual users who are just getting started with Notevo.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-brand_tertiary/20">
            <AccordionTrigger className="text-brand_tertiary/90">
              Can I upgrade or downgrade my plan later?
            </AccordionTrigger>
            <AccordionContent className="text-brand_tertiary/70">
              Yes, you can upgrade to the Pro plan at any time. If you need to
              downgrade, you can switch back to the free plan at the end of your
              current billing cycle.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-brand_tertiary/20">
            <AccordionTrigger className="text-brand_tertiary/90">
              Is there a trial period for the Pro plan?
            </AccordionTrigger>
            <AccordionContent className="text-brand_tertiary/70">
              Yes, all new users get a 14-day free trial of the Pro plan
              features. No credit card is required to start your trial.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-brand_tertiary/20">
            <AccordionTrigger className="text-brand_tertiary/90">
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent className="text-brand_tertiary/70">
              We accept all major credit cards, including Visa, Mastercard, and
              American Express. We also support payment through PayPal.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-brand_tertiary/20">
            <AccordionTrigger className="text-brand_tertiary/90">
              What happens to my data if I cancel?
            </AccordionTrigger>
            <AccordionContent className="text-brand_tertiary/70">
              If you downgrade from Pro to Free, you'll retain access to all
              your data, but will be limited to the Free plan restrictions. If
              you exceed the Free plan limits, you won't be able to create new
              content until you're within the limits.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
