import MaxWContainer from "@/components/ui/MaxWContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, FileText } from "lucide-react";

export default function NoteDetailSkeleton() {
  return (
    <MaxWContainer className="relative mb-20">
      {/* Hero Section */}
      <div className="w-full py-10 my-5 bg-gradient-to-r from-brand_fourthary via-transparent to-brand_fourthary rounded-xl">
        <header className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
            <div className="h-8 bg-brand_tertiary/10 rounded animate-pulse w-3/4"></div>
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <div className="h-4 bg-brand_tertiary/10 rounded animate-pulse w-32"></div>
          </div>
        </header>
      </div>

      {/* Content Section */}
      <Card className="mt-8 bg-brand_fourthary/30 border-brand_tertiary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand_tertiary/20" />
            <div className="h-6 bg-brand_tertiary/10 rounded animate-pulse w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-brand_tertiary/10 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-brand_tertiary/10 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-brand_tertiary/10 rounded animate-pulse w-2/3"></div>
            <div className="h-32 bg-brand_tertiary/10 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-brand_tertiary/10 rounded animate-pulse w-4/5"></div>
            <div className="h-4 bg-brand_tertiary/10 rounded animate-pulse w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    </MaxWContainer>
  );
}