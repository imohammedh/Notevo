import MaxWContainer from "@/components/ui/MaxWContainer";

export default function loading() {
  return (
    <MaxWContainer>
      <div className="flex flex-col space-y-6">
        {/* Hero Section Skeleton */}
        <div className="w-full py-10 my-5 bg-gradient-to-r from-brand_fourthary via-transparent to-brand_fourthary rounded-xl">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="h-8 w-3/4 bg-brand_tertiary/20 rounded animate-pulse mb-3"></div>
            <div className="h-4 w-1/2 bg-brand_tertiary/20 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-3 gap-4">
          <div className="h-12 bg-brand_tertiary/20 rounded animate-pulse"></div>
          <div className="h-12 bg-brand_tertiary/20 rounded animate-pulse"></div>
          <div className="h-12 bg-brand_tertiary/20 rounded animate-pulse"></div>
        </div>

        {/* Main Content Tabs Skeleton */}
        <div className="mt-8">
          <div className="bg-brand_fourthary/50 text-brand_tertiary/90 mb-6">
            <div className="h-10 w-1/4 bg-brand_tertiary/20 rounded animate-pulse mb-2"></div>
            <div className="h-10 w-1/4 bg-brand_tertiary/20 rounded animate-pulse mb-2"></div>
          </div>

          {/* Workspaces Tab Skeleton */}
          <div className="mb-4">
            <h2 className="h-6 w-1/3 bg-brand_tertiary/20 rounded animate-pulse mb-2"></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="relative group p-3.5 w-full h-40 border border-solid border-brand_tertiary/10 rounded-lg transition-all duration-300"
              >
                <div className="h-full flex flex-col justify-start items-start gap-1">
                  <div className="h-6 rounded bg-brand_tertiary/20 animate-pulse"></div>
                  <div className="flex justify-center items-center gap-1 absolute bottom-5 left-5">
                    <div className="h-4 w-32 rounded bg-brand_tertiary/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Notes Tab Skeleton */}
          <div className="mb-4">
            <h2 className="h-6 w-1/3 bg-brand_tertiary/20 rounded animate-pulse mb-2"></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="relative group p-3.5 w-full h-40 border border-solid border-brand_tertiary/10 rounded-lg transition-all duration-300"
              >
                <div className="h-full flex flex-col justify-start items-start gap-1">
                  <div className="h-6 rounded bg-brand_tertiary/20 animate-pulse"></div>
                  <div className="flex justify-center items-center gap-1 absolute bottom-5 left-5">
                    <div className="h-4 w-32 rounded bg-brand_tertiary/20 animate-pulse"></div>
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
