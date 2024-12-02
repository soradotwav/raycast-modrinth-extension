import { TranslatorCollection } from "node-html-markdown";

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Define time intervals in seconds
  const intervals: { [key: string]: number } = {
    year: 31536000, // 365 days
    month: 2592000, // 30 days
    week: 604800,   // 7 days
    day: 86400,     // 1 day
    hour: 3600,     // 1 hour
    minute: 60      // 1 minute
  };

  let unit: string;
  let count: number;

  // Handle future dates
  if (seconds < 0) {
    return "In the future";
  }

  // Determine how long ago the date is
  if (seconds >= intervals.year) {
    unit = 'Year';
    count = Math.floor(seconds / intervals.year);
  } else if (seconds >= intervals.month) {
    unit = 'Month';
    count = Math.floor(seconds / intervals.month);
  } else if (seconds >= intervals.week) {
    unit = 'Week';
    count = Math.floor(seconds / intervals.week);
  } else if (seconds >= intervals.day) {
    unit = 'Day';
    count = Math.floor(seconds / intervals.day);
  } else if (seconds >= intervals.hour) {
    unit = 'Hour';
    count = Math.floor(seconds / intervals.hour);
  } else {
    // If less than 1 hour, return "1 minute ago"
    unit = 'Minute';
    count = 1; // Minimum count is 1 minute
  }

  // Format return value, handling pluralization
  const plural = count > 1 ? 's' : '';
  return `${count} ${unit}${plural} ago`;
}