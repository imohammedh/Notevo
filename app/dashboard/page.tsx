"use client";

import {
  Clock,
  FileText,
  Plus,
  Sparkles,
  Notebook,
  PenSquare,
  Folder,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
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
import {
  extractTextFromTiptap as parseTiptapContentExtractText,
  truncateText as parseTiptapContentTruncateText,
} from "@/lib/parse-tiptap-content";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    if (viewer?.name) {
      document.title = `${viewer.name} - Dashboard`;

      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          `${viewer.name}'s Notevo dashboard`,
        );
      } else {
        const newMeta = document.createElement("meta");
        newMeta.name = "description";
        newMeta.content = `${viewer.name}'s Notevo dashboard`;
        document.head.appendChild(newMeta);
      }
    }
  }, [viewer]);

  const workspaceCount = recentWorkspaces?.length || 0;
  const notesCount = recentNotes?.length || 0;
  const pinnedCount = recentNotes?.filter((note) => note.favorite)?.length || 0;

  return (
    <>
      <MaxWContainer className="relative mb-20">
        {/* Enhanced Hero Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent from-20% via-transparent via-70% to-accent p-8 shadow-2xl shadow-primary/10 mb-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

          <header className="relative max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary drop-shadow-lg">
              {viewer?.name ? (
                <>
                  Hello,{" "}
                  {`${viewer.name.split(" ")[0].length > 10
                    ? `${viewer.name.split(" ")[0].substring(0, 10)}...`
                    : viewer.name.split(" ")[0]
                    }${viewer.name.split(" ")[1]
                      ? ` ${viewer.name.split(" ")[1].charAt(0)}.`
                      : "!"
                    }`}
                </>
              ) : (
                <SkeletonTextAnimation className=" w-full h-10" />
              )}
            </h1>
            <p className="text-white/90 text-md max-w-2xl mx-auto mb-6">
              Organize your thoughts, manage your workspaces, and boost your
              productivity with Notevo.
            </p>
          </header>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="workspaces" className="mt-8">
          {recentNotes?.length !== 0 && recentWorkspaces?.length !== 0 && (
            <TabsList className="mb-6 bg-card/90 backdrop-blur-sm p-1 rounded-xl border border-border/50">
              <TabsTrigger
                value="workspaces"
              >
                Workspaces
              </TabsTrigger>
              <TabsTrigger
                value="recent"
              >
                Recent Notes
              </TabsTrigger>
            </TabsList>
          )}

          {/* Workspaces Tab */}
          <TabsContent value="workspaces">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-foreground text-xl font-semibold">
                Your Workspaces
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateWorkingSpace}
                disabled={loading}
                className=" hover:bg-purple-600/10 hover:text-purple-600 hover:border-purple-600/50 transition-all"
              >
                {loading ? (
                  <LoadingAnimation className="h-3 w-3 mr-2" />
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
            <div className="mb-6">
              <h2 className="text-foreground text-xl font-semibold">
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
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="pt-12 pb-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      No notes yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first note to get started
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </MaxWContainer>
    </>
  );
}

interface Workspace {
  _id: Id<"workingSpaces">;
  name: string;
  slug?: string;
  favorite?: boolean;
  userId: Id<"users">;
  createdAt: number;
  updatedAt: number;
}

interface WorkspaceCardProps {
  workspace: Workspace;
  handleCreateWorkingSpace: () => void;
  loading: boolean;
}

function WorkspaceCard({
  workspace,
  handleCreateWorkingSpace,
  loading,
}: WorkspaceCardProps) {
  return (
    <Card className="group relative overflow-hidden bg-card/90 backdrop-blur-sm border-border/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

      <CardHeader className="pb-3 relative">
        <CardTitle className="text-base font-semibold text-foreground">
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

      <CardContent className="pb-3">
        <div className="h-20 flex items-center justify-center">
          <Notebook className="h-7 w-7 text-primary" />
        </div>
      </CardContent>

      <CardFooter className="pt-3 flex justify-between items-center text-xs text-muted-foreground border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {typeof window !== "undefined" ? (
            <span>{`${new Date(workspace.updatedAt).toLocaleDateString()}`}</span>
          ) : (
            <SkeletonTextAnimation className="w-20" />
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-7 px-2 text-xs hover:bg-purple-600/10 hover:text-purple-600"
        >
          <Link href={`/dashboard/${workspace._id}`}>Open</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function CreateWorkspaceCard({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <Card
      className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-dashed border-border/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl cursor-pointer group hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center h-[192px]">
        {loading ? (
          <LoadingAnimation />
        ) : (
          <>
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Plus className="h-7 w-7 text-white" />
            </div>
            <p className="text-foreground font-medium group-hover:text-purple-600 transition-colors">
              Create Workspace
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface Note {
  _id: Id<"notes">;
  title?: string;
  slug?: string;
  workingSpacesSlug?: string;
  workingSpaceId?: Id<"workingSpaces">;
  userId?: Id<"users">;
  body?: string;
  favorite?: boolean;
  createdAt: number;
  updatedAt: number;
  tags?: Id<"tags">[];
  order?: number;
}

function NoteCard({ note }: { note: Note }) {
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

  const isEmpty = !note.body;

  return (
    <Card className={cn(
      "group relative overflow-hidden bg-card/90 backdrop-blur-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
      isEmpty ? "border-dashed border-border/50" : "border-border/50 hover:border-purple-500/50"
    )}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold text-foreground truncate">
              {note.title || "Untitled"}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              {note.workingSpacesSlug || "Personal Workspace"}
            </CardDescription>
          </div>
          {note.favorite && (
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className={cn(
          "text-sm line-clamp-3",
          isEmpty ? "text-muted-foreground italic" : "text-muted-foreground"
        )}>
          {getContentPreview(note.body)}
        </p>
      </CardContent>

      <CardFooter className="pt-3 flex justify-between items-center text-xs text-muted-foreground border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {typeof window !== "undefined" ? (
            <span>{`${new Date(note.updatedAt).toLocaleDateString()}`}</span>
          ) : (
            <SkeletonTextAnimation className="w-20" />
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-7 px-2 text-xs hover:bg-purple-600/10 hover:text-purple-600"
        >
          <Link
            href={`/dashboard/${note.workingSpaceId}/${note.slug}?id=${note._id}`}
          >
            Open
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function WorkspaceCardSkeleton() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="h-5 w-3/4 bg-muted rounded animate-pulse"></div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="h-20 flex items-center justify-center">
          <div className="h-14 w-14 bg-muted rounded-full animate-pulse"></div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t border-border/50">
        <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
      </CardFooter>
    </Card>
  );
}