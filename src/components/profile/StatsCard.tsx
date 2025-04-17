
import { Card, CardContent } from "@/components/ui/card";
import { ActivityLog } from "@/services/profileService";

interface StatsCardProps {
  activityLog: ActivityLog[];
}

export function StatsCard({ activityLog }: StatsCardProps) {
  const totalProblemsSolved = Array.isArray(activityLog) 
    ? activityLog.reduce((sum, day) => sum + day.problems_solved, 0)
    : 0;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold">Problems Solved</h3>
        <div className="mt-2 space-y-2">
          <div className="text-3xl font-bold text-primary">
            {totalProblemsSolved}
          </div>
          <p className="text-sm text-gray-600">Total problems completed</p>
        </div>
      </CardContent>
    </Card>
  );
}
