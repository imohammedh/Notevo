import MaxWContainer from "@/components/ui/MaxWContainer";

export default function loading() {
  return (
    <MaxWContainer>
      <div className="relative mb-20">
        {/* Skeleton for tables */}
        <div className="py-5">
          <div className="animate-pulse w-full flex items-center justify-between border-b border-solid border-brand_tertiary/10 py-5 mb-5">
            <div className="skeleton w-1/2 h-6 bg-brand_tertiary/20 rounded"></div>
            <div className="skeleton w-14 h-9 bg-brand_tertiary/20 rounded"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <div className="animate-pulse relative group p-3.5 w-full h-40 border border-solid border-brand_tertiary/10 rounded-lg transition-all duration-300">
                  <div className="skeleton w-32 h-6 bg-brand_tertiary/20 rounded mb-2"></div>
                  <div className="skeleton w-28 h-4 bg-brand_tertiary/20 rounded mb-1"></div>
                  <div className="skeleton w-10 h-8 absolute top-3 right-2 bg-brand_tertiary/20 rounded"></div>
                  <div className="flex justify-center items-center gap-1 absolute bottom-5 left-5">
                    <div className="skeleton w-10 h-4 bg-brand_tertiary/20 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MaxWContainer>
  );
}
