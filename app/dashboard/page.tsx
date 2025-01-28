"use client";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
export default function ProductPage() {
  const viwer = useQuery(api.users.viewer);
  return (
    <MaxWContainer>
      <div className="w-full text-center py-14 bg-brand_fourthary border border-solid border-brand_tertiary/20 rounded-xl">
      <h1 className=" text-3xl font-bold text-center">Good evening , {viwer?.name}</h1>
      </div>
    </MaxWContainer>
  );
}
