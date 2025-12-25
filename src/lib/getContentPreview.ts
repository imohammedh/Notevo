import {
  extractTextFromTiptap as parseTiptapContentExtractText,
  truncateText as parseTiptapContentTruncateText,
} from "@/src/lib/parse-tiptap-content";
// Function to get content preview
export const getContentPreview = (content: any, viewMode?: string) => {
  if (!content) return "No content yet. Click to start writing...";

  try {
    const plainText = parseTiptapContentExtractText(content);
    return plainText
      ? parseTiptapContentTruncateText(
          plainText,
          viewMode === "grid" ? 80 : 120,
        )
      : "No content yet. Click to start writing...";
  } catch (error) {
    console.error("Error parsing content:", error);
    return "Unable to display content preview";
  }
};
