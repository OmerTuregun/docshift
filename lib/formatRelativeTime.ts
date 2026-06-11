export function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "az önce";
  }

  if (minutes < 60) {
    return `${minutes} dk önce`;
  }

  if (hours < 24) {
    return `${hours} saat önce`;
  }

  if (days === 1) {
    return "dün";
  }

  if (days < 7) {
    return `${days} gün önce`;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
  }).format(new Date(dateStr));
}
