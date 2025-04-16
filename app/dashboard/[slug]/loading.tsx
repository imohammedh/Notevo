import MaxWContainer from "@/components/ui/MaxWContainer";

export default function loading() {
  return (
    <MaxWContainer>
      <div className="animate-pulse relative mb-20">
        {/* Skeleton for header */}
        <div className="py-6">
          <div className="w-full p-6 bg-gradient-to-r from-brand_fourthary via-transparent via-15% to-brand_fourthary rounded-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="skeleton w-1/2 h-8 bg-brand_tertiary/20 rounded"></div>
                </div>
                <div className="skeleton w-1/3 h-4 bg-brand_tertiary/20 rounded"></div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-auto">
                <div className="relative w-full md:w-auto">
                  <div className="skeleton w-full h-9 bg-brand_fourthary/30 border-brand_tertiary/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Skeleton for tables */}
        <div className="py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <div className="relative group p-3.5 w-full h-40 border border-solid border-brand_tertiary/10 rounded-lg transition-all duration-300">
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
