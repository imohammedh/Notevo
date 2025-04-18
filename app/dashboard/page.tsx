"use client";

import {
  Clock,
  FileText,
  Plus,
  Sparkles,
  Notebook,
  PenSquare,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import MaxWContainer from "@/components/ui/MaxWContainer";
import WorkingSpaceSettings from "@/components/dashboard-components/WorkingSpaceSettings";
import WorkingSpaceNotFound from "@/components/dashboard-components/WorkingSpaceNotFound";
import LoadingAnimation from "@/components/ui/LoadingAnimation";
import SkeletonTextAnimation from "@/components/ui/SkeletonTextAnimation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsRow } from "@/components/dashboard-components/stats-row";
import {
  extractTextFromTiptap as parseTiptapContentExtractText,
  truncateText as parseTiptapContentTruncateText,
} from "@/lib/parse-tiptap-content";

export default function Dashboard() {
  const viewer = useQuery(api.users.viewer);
  const recentWorkspaces = useQuery(
    api.mutations.workingSpaces.getRecentWorkingSpaces,
  );
  const recentNotes = useQuery(api.mutations.notes.getNoteByUserId);
  const createWorkingSpace = useMutation(
    api.mutations.workingSpaces.createWorkingSpace,
  );
  const [loading, setLoading] = useState(false);

  const handleCreateWorkingSpace = async () => {
    setLoading(true);
    await createWorkingSpace({ name: "Untitled" });
    setLoading(false);
  };

  // Get counts for stats
  const workspaceCount = recentWorkspaces?.length || 0;
  const notesCount = recentNotes?.length || 0;
  const pinnedCount = recentNotes?.filter((note) => note.favorite)?.length || 0;

  return (
    <MaxWContainer className="relative mb-20">
      {/* Hero Section */}
      <div className="w-full py-10 my-5 bg-gradient-to-r from-brand_fourthary via-transparent to-brand_fourthary rounded-xl">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 flex justify-center items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand_tertiary/70" />
            Welcome to Notevo,{" "}
            {viewer?.name ? (
              `${viewer.name.split(" ")[0].length > 10 ? `${viewer.name.split(" ")[0].substring(0, 10)}...` : viewer.name.split(" ")[0]}${viewer.name.split(" ")[1] ? ` ${viewer.name.split(" ")[1].charAt(0)}.` : "."}`
            ) : (
              <SkeletonTextAnimation />
            )}
          </h1>
          <p className="text-brand_tertiary/70 max-w-lg mx-auto">
            Organize your thoughts, manage your workspaces, and boost your
            productivity with Notevo.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <StatsRow
        workspaceCount={workspaceCount}
        notesCount={notesCount}
        pinnedCount={pinnedCount}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="workspaces" className="mt-8">
        <TabsList className="bg-brand_fourthary/50 text-brand_tertiary/90 mb-6 ">
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="recent">Recent Notes</TabsTrigger>
        </TabsList>

        {/* Workspaces Tab */}
        <TabsContent value="workspaces">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-brand_tertiary/80 text-lg font-medium">
              Your Workspaces
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateWorkingSpace}
              disabled={loading}
              className="border-brand_tertiary/30 text-brand_tertiary"
            >
              {loading ? (
                <LoadingAnimation />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              New Workspace
            </Button>
          </div>

          {recentWorkspaces?.length !== 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentWorkspaces ? (
                recentWorkspaces.map((workspace) => (
                  <WorkspaceCard
                    key={workspace._id}
                    workspace={workspace}
                    handleCreateWorkingSpace={handleCreateWorkingSpace}
                    loading={loading}
                  />
                ))
              ) : (
                <WorkspaceCardSkeleton />
              )}
              <CreateWorkspaceCard
                onClick={handleCreateWorkingSpace}
                loading={loading}
              />
            </div>
          ) : (
            <WorkingSpaceNotFound />
          )}
        </TabsContent>

        {/* Recent Notes Tab */}
        <TabsContent value="recent">
          <div className="mb-4">
            <h2 className="text-brand_tertiary/80 text-lg font-medium">
              Recent Notes
            </h2>
          </div>

          {recentNotes && recentNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentNotes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>
          ) : (
            <Card className="bg-brand_fourthary/30 border-brand_tertiary/20">
              <CardContent className="pt-6 text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-12 w-12 text-brand_tertiary/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                  <p className="text-brand_tertiary/70 mb-4">
                    Create your first note to get started
                  </p>
                  {/* <Button
                    variant="outline"
                    className="border-brand_tertiary/30 text-brand_tertiary"
                  >
                    <PenSquare className="h-4 w-4 mr-2" />
                    Create Note
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </MaxWContainer>
  );
}
// Workspace Card Component
function WorkspaceCard({
  workspace,
  handleCreateWorkingSpace,
  loading,
}: {
  workspace: any;
  handleCreateWorkingSpace: () => void;
  loading: boolean;
}) {
  return (
    <Card className="group bg-brand_fourthary/30 border-brand_tertiary/20 hover:border-brand_tertiary/40 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-lg">
          {workspace.name.length > 20
            ? `${workspace.name.substring(0, 20)}...`
            : workspace.name}
        </CardTitle>
        <div className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity">
          <WorkingSpaceSettings
            workingSpaceId={workspace._id}
            workingspaceName={workspace.name}
          />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-16 flex items-center justify-center">
          <Notebook className="h-10 w-10 text-brand_tertiary/20 group-hover:text-brand_tertiary/40 transition-colors" />
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center text-xs text-brand_tertiary/50">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {typeof window !== "undefined" ? (
            <span>{`${new Date(workspace.updatedAt).toLocaleDateString()}`}</span>
          ) : (
            <SkeletonTextAnimation className="w-20" />
          )}
        </div>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href={`/dashboard/${workspace.slug}?id=${workspace._id}`}>
            Open
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
// Create Workspace Card Component
function CreateWorkspaceCard({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <Card
      className="bg-brand_fourthary/20 border-dashed border-brand_tertiary/20 hover:border-brand_tertiary/40 transition-all duration-300 hover:shadow-md cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center h-[176px]">
        {loading ? (
          <LoadingAnimation />
        ) : (
          <>
            <div className="h-12 w-12 rounded-full bg-brand_tertiary/5 flex items-center justify-center mb-3 group-hover:bg-brand_tertiary/10 transition-colors">
              <Plus className="h-6 w-6 text-brand_tertiary/40 group-hover:text-brand_tertiary/60 transition-colors" />
            </div>
            <p className="text-brand_tertiary/60 group-hover:text-brand_tertiary/80 transition-colors">
              Create Workspace
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
// Note Card Component
function NoteCard({ note }: { note: any }) {
  const getContentPreview = (content: any) => {
    if (!content) return "No content yet. Click to start writing...";

    try {
      const plainText = parseTiptapContentExtractText(content);
      return plainText
        ? parseTiptapContentTruncateText(plainText, 80)
        : "No content yet. Click to start writing...";
    } catch (error) {
      console.error("Error parsing content:", error);
      return "Unable to display content preview";
    }
  };
  return (
    <Card className="group bg-brand_fourthary/30 border-brand_tertiary/20 hover:border-brand_tertiary/40 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {note.title
            ? note.title.length > 20
              ? `${note.title.substring(0, 20)}...`
              : note.title
            : "Untitled"}
        </CardTitle>
        <CardDescription className="text-brand_tertiary/60">
          {note.workingSpacesSlug || "Personal Workspace"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-brand_tertiary/70 line-clamp-2">
          {getContentPreview(note.body)}
        </p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center text-xs text-brand_tertiary/50">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {typeof window !== "undefined" ? (
            <span>{`${new Date(note.updatedAt).toLocaleDateString()}`}</span>
          ) : (
            <SkeletonTextAnimation className="w-20" />
          )}
        </div>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link
            href={`/dashboard/${note.workingSpacesSlug}/${note.slug}?id=${note._id}`}
          >
            Open
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Workspace Card Skeleton
function WorkspaceCardSkeleton() {
  return (
    <Card className="bg-brand_fourthary/30 border-brand_tertiary/20">
      <CardHeader className="pb-2">
        <div className="h-6 w-3/4 bg-brand_tertiary/10 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-16 flex items-center justify-center">
          <div className="h-10 w-10 bg-brand_tertiary/10 rounded-full animate-pulse"></div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="h-4 w-24 bg-brand_tertiary/10 rounded animate-pulse"></div>
      </CardFooter>
    </Card>
  );
}
