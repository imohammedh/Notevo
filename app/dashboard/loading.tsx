import MaxWContainer from "@/components/ui/MaxWContainer";

export default function loading() {
  return (
    <MaxWContainer>
    <div className="flex animate-pulse space-x-4">
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 rounded bg-brand_tertiary/20"></div>
        <div className="space-y-3">
        </div>
      </div>
    </div>
      <div className="flex flex-col space-y-6">
        <div className="w-full text-center py-14 my-5 bg-gradient-to-r from-brand_fourthary via-transparent to-brand_fourthary rounded-lg">
          <div className="h-8 rounded bg-brand_tertiary/20 animate-pulse"></div>
        </div>
        <h2 className="text-brand_tertiary/50 text-sm font-medium pb-2 pt-5 px-1">
          Recent Workspaces
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="relative group p-3.5 w-full h-40 border border-solid border-brand_tertiary/10 rounded-lg transition-all duration-300">
              <div className="h-full flex flex-col justify-start items-start gap-1">
                <div className="h-6 rounded bg-brand_tertiary/20 animate-pulse"></div>
                <div className="flex justify-center items-center gap-1 absolute bottom-5 left-5">
                  <div className="w-10 h-10 rounded bg-brand_tertiary/20 animate-pulse"></div>
                  <div className="h-4 w-24 rounded bg-brand_tertiary/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
          <div className="p-3.5 w-full h-40 group flex justify-center items-center border border-dashed border-brand_tertiary/10 rounded-lg transition-all duration-300">
            <div className="h-10 w-10 rounded bg-brand_tertiary/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </MaxWContainer>
  );
}
