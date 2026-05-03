export function formattedDate(date: string): string {
  if (!date) {
    return "N/A";
  }
  const parts: string[] = date?.split("-");

  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  return date;
}
