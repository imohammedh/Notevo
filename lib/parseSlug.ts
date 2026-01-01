export function parseSlug(slug: string): string {
  return slug
    .replace(/-\d+$/, "") 
    .replace(/-/g, " ") 
    .replace(/\b\w/g, (char) => char.toUpperCase()); 
}