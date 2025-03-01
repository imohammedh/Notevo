import MaxWContainer from "@/components/ui/MaxWContainer";

export default function loading() {
  return (
    <MaxWContainer>
    <div className="animate-pulse">
      <div className="h-6 bg-brand_tertiary/20 rounded mb-4"></div>
      <div className="h-32 bg-brand_tertiary/20 rounded mb-4"></div>
      <div className="h-4 bg-brand_tertiary/20 rounded mb-2"></div>
      <div className="h-4 bg-brand_tertiary/20 rounded mb-2"></div>
      <div className="h-4 bg-brand_tertiary/20 rounded mb-2"></div>
    </div>
    </MaxWContainer>
  );
}
