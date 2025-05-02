/**
 * Converts a Date object to a local datetime string suitable for datetime-local input
 * Ensures the time shown matches the user's local time without UTC conversion
 * 
 * @param d - Date object to convert
 * @returns string in format "YYYY-MM-DDTHH:mm"
 */
export const toLocalDateTimeValue = (d: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
           `T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}; 