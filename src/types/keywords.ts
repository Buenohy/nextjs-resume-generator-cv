export interface KeywordData {
  id: string;
  keyword: string;
  inVacancy: number;
  goal2x: number;
  onResume: number;
  status: "Pending" | "Approved";
}
