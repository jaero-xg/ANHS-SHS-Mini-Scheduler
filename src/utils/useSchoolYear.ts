export function getSchoolYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed: 5 = June
 
  const startYear = month >= 5 ? year : year - 1;
  const endYear = startYear + 1;
 
  return `S.Y. ${startYear}–${endYear}`;
}