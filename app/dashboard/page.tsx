"use client";

import {
  Clock,
  FileText,
  Plus,
  Sparkles,
  Notebook,
  PenSquare,
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
import { StatsRow } from "@/components/dashboard-components/stats-row";
import {
  extractTextFromTiptap as parseTiptapContentExtractText,
  truncateText as parseTiptapContentTruncateText,
} from "@/lib/parse-tiptap-content";
import type { Id } from "@/convex/_generated/dataModel";

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
      // Update document title
      document.title = `${viewer.name} - Dashboard`;

      // Update meta description
      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          `${viewer.name}'s Notevo dashboard`,
        );
      } else {
        // Create meta description if it doesn't exist
        const newMeta = document.createElement("meta");
        newMeta.name = "description";
        newMeta.content = `${viewer.name}'s Notevo dashboard`;
        document.head.appendChild(newMeta);
      }
    }
  }, [viewer]);
  // Get counts for stats
  const workspaceCount = recentWorkspaces?.length || 0;
  const notesCount = recentNotes?.length || 0;
  const pinnedCount = recentNotes?.filter((note) => note.favorite)?.length || 0;

  return (
    <>
      <MaxWContainer className="relative mb-20">
        {/* Hero Section */}
        <div className="w-full py-10 my-5 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl">
          <header className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 flex justify-center items-center gap-2 text-foreground">
              Welcome to Notevo,{" "}
              {viewer?.name ? (
                `${
                  viewer.name.split(" ")[0].length > 10
                    ? `${viewer.name.split(" ")[0].substring(0, 10)}...`
                    : viewer.name.split(" ")[0]
                }${
                  viewer.name.split(" ")[1]
                    ? ` ${viewer.name.split(" ")[1].charAt(0)}.`
                    : "."
                }`
              ) : (
                <SkeletonTextAnimation />
              )}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Organize your thoughts, manage your workspaces, and boost your
              productivity with Notevo.
            </p>
          </header>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="workspaces" className="mt-8">
          {recentNotes?.length !== 0 && recentWorkspaces?.length !== 0 && (
            <TabsList className="mb-6">
              <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
              <TabsTrigger value="recent">Recent Notes</TabsTrigger>
            </TabsList>
          )}

          {/* Workspaces Tab */}
          <TabsContent value="workspaces">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-foreground/80 text-lg font-medium">
                Your Workspaces
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateWorkingSpace}
                disabled={loading}
                className="border-border text-foreground px-2"
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
            <div className="mb-4">
              <h2 className="text-foreground/80 text-lg font-medium">
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
              <Card className="bg-card/30 border-border">
                <CardContent className="pt-6 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-foreground">No notes yet</h3>
                    <p className="text-muted-foreground mb-4">
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
// Workspace Card Component
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
    <Card className="group bg-card/30 border-border hover:border-border/40 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-lg text-foreground">
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
          <Notebook className="h-10 w-10 text-muted-foreground group-hover:text-muted-foreground/60 transition-colors" />
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {typeof window !== "undefined" ? (
            <span>{`${new Date(workspace.updatedAt).toLocaleDateString()}`}</span>
          ) : (
            <SkeletonTextAnimation className="w-20" />
          )}
        </div>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href={`/dashboard/${workspace._id}`}>Open</Link>
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
      className="bg-card/20 border-dashed border-border hover:border-border/40 transition-all duration-300 hover:shadow-md cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center h-[176px]">
        {loading ? (
          <LoadingAnimation />
        ) : (
          <>
            <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mb-3 group-hover:bg-accent/80 transition-colors">
              <Plus className="h-6 w-6 text-muted-foreground group-hover:text-muted-foreground/80 transition-colors" />
            </div>
            <p className="text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
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

// Note Card Component
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
  return (
    <Card className="group bg-card/30 border-border hover:border-border/40 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-foreground">
          {note.title
            ? note.title.length > 20
              ? `${note.title.substring(0, 20)}...`
              : note.title
            : "Untitled"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {note.workingSpacesSlug || "Personal Workspace"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {getContentPreview(note.body)}
        </p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
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
            href={`/dashboard/${note.workingSpaceId}/${note.slug}?id=${note._id}`}
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
    <Card className="bg-card/30 border-border">
      <CardHeader className="pb-2">
        <div className="h-6 w-3/4 bg-primary/20 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-16 flex items-center justify-center">
          <div className="h-10 w-10 bg-primary/20 rounded-full animate-pulse"></div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="h-4 w-24 bg-primary/20 rounded animate-pulse"></div>
      </CardFooter>
    </Card>
  );
}