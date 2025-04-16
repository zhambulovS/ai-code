
import { Trophy, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Achievement } from "@/services/profileService";

interface AchievementsCardProps {
  achievements: Achievement[];
}

const iconMap = {
  Trophy,
  Calendar,
  Award,
};

export function AchievementsCard({ achievements }: AchievementsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {achievements.map((achievement) => {
          const Icon = iconMap[achievement.icon as keyof typeof iconMap] || Trophy;
          return (
            <div key={achievement.id} className="flex items-start space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Earned {new Date(achievement.earned_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
