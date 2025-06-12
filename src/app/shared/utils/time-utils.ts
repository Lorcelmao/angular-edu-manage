/**
 * Converts milliseconds to a formatted days string
 * @param milliseconds The time in milliseconds
 * @param includeUnit Whether to include the "ngày" unit in the output
 * @returns Formatted string representing days
 */
export function convertMillisecondsToDays(milliseconds: number | null | undefined, includeUnit: boolean = true): string {
  if (milliseconds === null || milliseconds === undefined) {
    return includeUnit ? '0 ngày' : '0';
  }
  
  // For non-numeric values, return 0
  if (isNaN(Number(milliseconds))) {
    return includeUnit ? '0 ngày' : '0';
  }
  
  // Convert milliseconds to days
  const days = Math.ceil(Number(milliseconds) / (1000 * 60 * 60 * 24));
  
  return includeUnit ? `${days} ngày` : `${days}`;
}

/**
 * Formats a duration in days with proper unit
 * @param days Number of days
 * @returns Formatted string with "ngày" unit
 */
export function formatDuration(days: number | null | undefined): string {
  if (days === null || days === undefined) {
    return '0 ngày';
  }
  
  return `${days} ngày`;
}