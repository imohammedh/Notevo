"use client";
import { Clock, Plus } from "lucide-react";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import ADiv from "@/components/dashboard-components/ADiv";
import { useRouter } from "next/navigation";
import WorkingSpaceSettings from "@/components/dashboard-components/WorkingSpaceSettings";
import WorkingSpaceNotFound from "@/components/dashboard-components/WorkingSpaceNotFound";
import { useState } from "react";
import FloatingNavbar from "@/components/dashboard-components/FloatingNavbar";
export default function ProductPage() {
  const viwer = useQuery(api.users.viewer);
  const recentWorkspaces = useQuery(api.mutations.workingSpaces.getRecentWorkingSpaces);
  const createWorkingSpace = useMutation(api.mutations.workingSpaces.createWorkingSpace);
  const [loading, setLoading] = useState(false);

    const handleCreateWorkingSpace = async () => {
      setLoading(true);
      await createWorkingSpace({ name: "Untitled" });
      setLoading(false);
    }
  const router = useRouter()
  const handleRouting = (slug: string,workingSpaceid:any)=>{
    router.push(`/dashboard/${slug}?id=${workingSpaceid}`);
  }
  return (
    <MaxWContainer className=" relative mb-20">
      <ADiv>
        <div className="w-full text-center py-14 my-5 bg-gradient-to-r from-brand_fourthary via-transparent to-brand_fourthary rounded-lg">
        <h1 className=" text-xl sm:text-3xl font-bold text-center">
          Good evening, {viwer?.name ? `${viwer.name.split(" ")[0].length > 10 ? `${viwer.name.split(" ")[0].substring(0, 10)}...` : viwer.name.split(" ")[0]} ${viwer.name.split(" ")[1]?.charAt(0)}.` : "User Not Found"}
        </h1>
        </div>
          <h2 className=" text-brand_tertiary/50 text-sm font-medium pb-2 pt-5 px-1">Recent Workspaces </h2>
          {
            recentWorkspaces?.length!==0?     
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              { 
                recentWorkspaces?.map((orkspaces) => (
                  <div key={orkspaces._id}>
                    {
                      (
                        <div className=" relative group p-3.5 w-full h-40 border border-solid border-brand_tertiary/10 rounded-lg transition-all duration-300 hover:border-brand_tertiary/30 hover:scale-y-105" >
                          <button onClick={()=>orkspaces.slug&&handleRouting(orkspaces.slug,orkspaces._id)} className=" w-full h-full flex flex-col flex-shrink-0 flex-grow-0 justify-start items-start gap-1">
                            <h1 className="text-lg font-medium text-nowrap">
                              {orkspaces.name.length > 20 ? `${orkspaces.name.substring(0, 20)}...` : orkspaces.name}
                            </h1>
                          </button>
                          <span className="w-10 h-10 absolute top-3 right-0 transition-all duration-200 ease-in-out opacity-10 group-hover:opacity-80">
                            <WorkingSpaceSettings workingSpaceId={orkspaces._id}/>  
                          </span>
                          <span className="flex justify-center items-center gap-1 absolute bottom-5 left-5 transition-all duration-200 ease-in-out opacity-10 group-hover:opacity-80">
                            <Clock size="16"/>
                            <p className=" font-normal text-sm">{`${new Date(orkspaces.updatedAt).toLocaleDateString()} . ${new Date(orkspaces.updatedAt).toLocaleTimeString()}`}</p>
                          </span>
                        </div>
                      )
                    }
                  </div>
                ))
              }
                <button onClick={handleCreateWorkingSpace} disabled={loading} className="p-3.5 w-full h-40 group flex justify-center items-center border border-dashed border-brand_tertiary/10 rounded-lg transition-all duration-300 hover:border-brand_tertiary/30 hover:scale-y-105">
                  <Plus size="24" className="transition-all duration-300 opacity-10 group-hover:opacity-80"/>
                </button>
            </div>
            :<WorkingSpaceNotFound/>
          } 
      </ADiv>
      <FloatingNavbar/>
    </MaxWContainer>
  );
}
