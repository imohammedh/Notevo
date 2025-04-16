"use client";

import { Calendar, FileText, LayoutGrid, List, Search } from "lucide-react";
import MaxWContainer from "@/components/ui/MaxWContainer";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function WorkingSpaceSkeleton() {
  return (
    <MaxWContainer className="mb-20">
      {/* Header */}
      <header className="py-6">
        <div className="w-full p-6 bg-gradient-to-r from-brand_fourthary via-transparent via-15% to-brand_fourthary rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-48 bg-brand_tertiary/10 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-32 bg-brand_tertiary/10 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2 self-end md:self-auto">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-brand_tertiary/30" />
                <div className="h-9 w-[200px] bg-brand_tertiary/10 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center border border-brand_tertiary/20 rounded-md overflow-hidden">
                <Button
                  variant="Trigger"
                  size="icon"
                  className="h-9 w-9 rounded-none bg-brand_tertiary/10"
                  disabled
                >
                  <LayoutGrid className="h-4 w-4 text-brand_tertiary/30" />
                </Button>
                <Button
                  variant="Trigger"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  disabled
                >
                  <List className="h-4 w-4 text-brand_tertiary/30" />
                </Button>
              </div>
              <div className="h-9 w-9 bg-brand_tertiary/10 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <Tabs defaultValue="tab1" className="mt-4">
        <div className="overflow-x-auto py-1">
          <TabsList className="bg-brand_fourthary/50 text-brand_tertiary/90 mb-6 justify-start w-fit flex-wrap h-fit gap-3 px-3 py-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 h-9 px-4 bg-brand_tertiary/5 rounded animate-pulse"
              >
                <div className="h-4 w-16 bg-brand_tertiary/10 rounded"></div>
                <Badge
                  variant="secondary"
                  className="ml-1 bg-brand_tertiary/5 text-brand_tertiary/30"
                >
                  {i}
                </Badge>
              </div>
            ))}
          </TabsList>
        </div>

        <TabsContent value="tab1">
          <div className="py-2">
            <div className="w-full flex items-center justify-between border-b border-solid border-brand_tertiary/10 py-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-brand_tertiary/10 rounded-full animate-pulse"></div>
                <div className="h-7 w-32 bg-brand_tertiary/10 rounded animate-pulse"></div>
              </div>
              <div className="h-9 w-28 bg-brand_tertiary/10 rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card
                  key={index}
                  className="bg-brand_fourthary/30 border-brand_tertiary/20"
                >
                  <CardHeader className="pb-2 relative">
                    <div className="h-6 w-3/4 bg-brand_tertiary/10 rounded animate-pulse"></div>
                    <div className="absolute top-3 right-3 h-5 w-5 bg-brand_tertiary/10 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="pb-2 h-16">
                    <div className="h-4 w-full bg-brand_tertiary/10 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-2/3 bg-brand_tertiary/10 rounded animate-pulse"></div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-brand_tertiary/20" />
                      <div className="h-3.5 w-20 bg-brand_tertiary/10 rounded animate-pulse"></div>
                    </div>
                    <div className="h-7 w-14 bg-brand_tertiary/10 rounded animate-pulse"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* List View Skeleton (Hidden by default) */}
      <div className="hidden">
        <div className="flex flex-col gap-3 mt-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-brand_fourthary/30 border border-brand_tertiary/20 rounded-lg"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-brand_tertiary/5 flex-shrink-0">
                <FileText className="h-5 w-5 text-brand_tertiary/30" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="h-5 w-3/4 bg-brand_tertiary/10 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-4/5 bg-brand_tertiary/10 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-xs text-brand_tertiary/50 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-brand_tertiary/20" />
                  <div className="h-3.5 w-20 bg-brand_tertiary/10 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-16 bg-brand_tertiary/10 rounded animate-pulse"></div>
                  <div className="h-7 w-7 bg-brand_tertiary/10 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MaxWContainer>
  );
}
