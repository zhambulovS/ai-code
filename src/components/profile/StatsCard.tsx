
import { Card, CardContent } from "@/components/ui/card";
import { ActivityLog } from "@/services/profileService";
import { useTranslation } from "react-i18next";

interface StatsCardProps {
  activityLog: ActivityLog[];
}

export function StatsCard({ activityLog }: StatsCardProps) {
  const { t } = useTranslation();
  const totalProblemsSolved = Array.isArray(activityLog) 
    ? activityLog.reduce((sum, day) => sum + day.problems_solved, 0)
    : 0;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold">{t('profile.problemsSolved')}</h3>
        <div className="mt-2 space-y-2">
          <div className="text-3xl font-bold text-primary">
            {totalProblemsSolved}
          </div>
          <p className="text-sm text-gray-600">{t('profile.totalProblems')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
