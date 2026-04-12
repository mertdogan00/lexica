// dateDiffDays returns (a - b) in whole days. Both inputs may be
// yyyy-mm-dd strings or ISO timestamps; each is normalised to local
// midnight before the subtraction so daylight-saving transitions do not
// smear the result by one day.

export function dateDiffDays(a: string, b: string): number {
  const da = new Date(a);
  da.setHours(0, 0, 0, 0);
  const db = new Date(b);
  db.setHours(0, 0, 0, 0);
  return Math.round((da.getTime() - db.getTime()) / 86_400_000);
}
