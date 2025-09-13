// Replaced moment with native Date methods

function formatTimeAgo(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

function formatDate(timestamp: number, format?: string): string {
  const date = new Date(timestamp);
  if (format === 'YYYY-MM-DD') {
    return date.toISOString().split('T')[0];
  }
  if (format === 'YYYY-MM-DD HH:mm:ss') {
    return date.toLocaleString('sv-SE').replace('T', ' ');
  }
  return date.toLocaleString();
}

export default function TableItemTime({
  value,
  options,
  className,
}: {
  value: number;
  options?: any;
  className?: string;
}) {
  return (
    <div className={className}>
      {options?.format
        ? formatDate(value, options.format)
        : formatTimeAgo(value)}
    </div>
  );
}
