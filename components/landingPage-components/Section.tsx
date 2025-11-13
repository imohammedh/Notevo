interface SectionProps {
  children: React.ReactNode;
  sectionId?: string;
  className?: string;
}

export default function Section({
  children,
  sectionId,
  className,
}: SectionProps) {
  return (
    <section
      id={sectionId}
      className={`w-full py-12 md:py-24 lg:py-32 bg-background ${className || ""}`}
    >
      {children}
    </section>
  );
}
