import MaxWContainer from "@/components/ui/MaxWContainer";

export default function loading() {
  return (
    <MaxWContainer>
    <div className="animate-pulse my-10">
      <div className="h-6 bg-brand_tertiary/20 rounded mb-4 w-1/2"></div>
      <div className="h-4 bg-brand_tertiary/20 rounded mb-2 w-3/4"></div>
      <div className="h-32 bg-brand_tertiary/20 rounded mb-4 w-full"></div>
      <div className="h-4 bg-brand_tertiary/20 rounded mb-2 w-5/6"></div>
      <div className="h-4 bg-brand_tertiary/20 rounded mb-2 w-2/3"></div>
      <div className="h-4 bg-brand_tertiary/20 rounded mb-2 w-1/4"></div>
    </div>
    </MaxWContainer>
  );
}
