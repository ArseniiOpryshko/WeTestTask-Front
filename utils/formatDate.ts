export function formatDate(date: Date | string): string {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options as any);
}
