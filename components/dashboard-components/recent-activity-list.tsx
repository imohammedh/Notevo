import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Clock, FileText, FolderPlus, Star } from "lucide-react";

export function RecentActivityList() {
  const User = useQuery(api.users.viewer);

  // Mock activity data
  const activities = [
    {
      id: "1",
      type: "note_created",
      title: "Project Kickoff Notes",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: "2",
      type: "workspace_created",
      title: "Marketing Strategy",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: "3",
      type: "note_pinned",
      title: "Q3 Planning",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
    {
      id: "4",
      type: "note_created",
      title: "Team Meeting Notes",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    },
    {
      id: "5",
      type: "workspace_created",
      title: "Personal Projects",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    },
  ];

  // Function to format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  };

  // Function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "note_created":
        return <FileText className="h-4 w-4" />;
      case "workspace_created":
        return <FolderPlus className="h-4 w-4" />;
      case "note_pinned":
        return <Star className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Function to get description based on activity type
  const getActivityDescription = (type: string) => {
    switch (type) {
      case "note_created":
        return "Created a new note";
      case "workspace_created":
        return "Created a new workspace";
      case "note_pinned":
        return "Pinned a note";
      default:
        return "Performed an action";
    }
  };

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9 mr-4">
            <AvatarImage
              src={User?.image || "/placeholder.svg"}
              alt={User?.name || "User"}
            />
            <AvatarFallback className="bg-brand_tertiary/10 text-brand_tertiary">
              {User?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            <p className="text-sm text-brand_tertiary/70">
              {getActivityDescription(activity.type)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-brand_tertiary/10 p-1.5">
              {getActivityIcon(activity.type)}
            </div>
            <span className="text-xs text-brand_tertiary/50">
              {formatRelativeTime(activity.timestamp)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
