export const dashboardMockData = {
  summary: {
    totalBudget: 500000,
    totalSpent: 320000,
    blockedCount: 14,
    blockedAmount: 42500, // שווי כספי של נזק שנמנע
    lastSyncedAt: "2026-06-10T01:30:00Z",
    burnRateDaysRemaining: 12,
    daysTotalRemaining: 18 // לצורך חישוב ה-Insight: 12 ימים מתוך 18
  },
  departments: [
    { id: "d1", name: "פיתוח ותשתיות", allocated: 250000, spent: 190000 },
    { id: "d2", name: "שיווק ודיגיטל", allocated: 150000, spent: 110000 },
    { id: "d3", name: "משאבי אנוש", allocated: 60000, spent: 15000 },
    { id: "d4", name: "אופרציה ולוגיסטיקה", allocated: 40000, spent: 5000 }
  ],
  // 3 החסימות הגדולות ביותר (Top Offenders)
  topOffenders: [
    { id: "to1", departmentName: "שיווק ודיגיטל", amount: 18000, description: "קמפיין בזק - משפיענים", blockedReason: "חריגה מתקציב מחלקה מאושר" },
    { id: "to2", departmentName: "פיתוח ותשתיות", amount: 12500, description: "שרתי GPU נוספים - AWS", blockedReason: "חוסר בהרשאת מנהל רכש" },
    { id: "to3", departmentName: "משאבי אנוש", amount: 5000, description: "אירוע חברה - ספקים חיצוניים", blockedReason: "תקציב מחלקתי מוקפא" }
  ],
  // לוג תנועות כללי
  transactions: [
    { id: "t1", departmentName: "פיתוח ותשתיות", amount: 4500, description: "רישיונות JetBrains", type: "expense", status: "approved", createdAt: "2026-06-10T01:15:00Z" },
    { id: "t2", departmentName: "שיווק ודיגיטל", amount: 18000, description: "קמפיין בזק - משפיענים", type: "expense", status: "blocked", blockedReason: "חריגה מתקציב מחלקה מאושר", createdAt: "2026-06-09T18:22:00Z" },
    { id: "t3", departmentName: "משאבי אנוש", amount: 2300, description: "רכש כיבוד למשרד", type: "expense", status: "approved", createdAt: "2026-06-09T14:10:00Z" },
    { id: "t4", departmentName: "פיתוח ותשתיות", amount: 12500, description: "שרתי GPU נוספים - AWS", type: "expense", status: "blocked", blockedReason: "חוסר בהרשאת מנהל רכש", createdAt: "2026-06-08T09:45:00Z" },
    { id: "t5", departmentName: "אופרציה ולוגיסטיקה", amount: 1200, description: "שליחויות ומסמכים", type: "expense", status: "approved", createdAt: "2026-06-07T11:00:00Z" }
  ]
};