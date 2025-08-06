export type DailyProgress = {
  date: string;
  cigarettesSmoked: number;
  targetCigarettes: number;
  status: "OVER" | "UNDER" | "ON_TARGET" | "NO_RECORD";
};

export type WeeklyReport = {
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  targetCigarettesPerDay: number;
  totalCigarettesSmoked: number;
  previousWeeklyTotal: number;
  daysOverTarget: number;
  daysOnTarget: number;
  daysUnderTarget: number;
  cigarettesReduction: number;
  dailyProgress: DailyProgress[];
};

export interface MemberShortDTO {
  memberId: number;
  fullName: string;
  status: string;
  userId: number;
  avatarUrl?: string | null;
}

export interface WeeklyProgressStats {
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  targetCigarettesPerDay: number;
  totalCigarettesSmoked: number;
  cigarettesReduction: number;
  daysOverTarget: number;
  daysOnTarget: number;
  daysUnderTarget: number;
  dailyProgress: DailyProgress[];
}
