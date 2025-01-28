"use client";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import ADiv from "@/components/dashboard-components/ADiv";
export default function ProductPage() {
  const viwer = useQuery(api.users.viewer);
  return (
    <MaxWContainer>
      <ADiv className="w-full text-center py-14 bg-gradient-to-r from-transparent via-brand_fourthary to-transparent">
        <h1 className=" text-3xl font-bold text-center">Good evening , {viwer?viwer.name:"User Not Found"}</h1>
      </ADiv>
    </MaxWContainer>
  );
}
