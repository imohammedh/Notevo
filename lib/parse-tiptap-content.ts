/**
 * Utility function to extract plain text from TipTap/Novel JSON content
 * This is a simplified version that handles basic text extraction
 */
export function extractTextFromTiptap(jsonContent: any): string {
  if (!jsonContent) return ""

  try {
    // If it's a string that looks like JSON, parse it
    if (typeof jsonContent === "string") {
      try {
        jsonContent = JSON.parse(jsonContent)
      } catch (e) {
        // If it's not valid JSON, return it as is
        return jsonContent
      }
    }

    // Handle different content structures
    if (jsonContent.content) {
      return extractFromNodes(jsonContent.content)
    } else if (Array.isArray(jsonContent)) {
      return extractFromNodes(jsonContent)
    }

    return String(jsonContent)
  } catch (error) {
    console.error("Error parsing TipTap content:", error)
    return "Unable to display content preview"
  }
}

function extractFromNodes(nodes: any[]): string {
  if (!Array.isArray(nodes)) return ""

  return nodes
    .map((node) => {
      // Text node
      if (node.text) {
        return node.text
      }

      // Paragraph, heading, or other container node
      if (node.content && Array.isArray(node.content)) {
        return extractFromNodes(node.content)
      }

      // Handle specific node types
      if (node.type === "paragraph" || node.type === "heading") {
        if (node.content) {
          return extractFromNodes(node.content) + "\n"
        }
      }

      // For other node types like images, code blocks, etc.
      if (node.type) {
        switch (node.type) {
          case "image":
            return "[Image]"
          case "codeBlock":
            return "[Code Block]"
          case "bulletList":
          case "orderedList":
            if (node.content) {
              return extractFromNodes(node.content)
            }
            return ""
          case "listItem":
            if (node.content) {
              return "• " + extractFromNodes(node.content)
            }
            return ""
          default:
            if (node.content) {
              return extractFromNodes(node.content)
            }
            return ""
        }
      }

      return ""
    })
    .join("")
}

/**
 * Truncates text to a specified length and adds ellipsis if needed
 */
export function truncateText(text: string, maxLength = 100): string {
  if (!text) return ""
  if (text.length <= maxLength) return text

  return text.substring(0, maxLength).trim() + "..."
}
