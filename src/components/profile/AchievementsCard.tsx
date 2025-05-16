
import { Trophy, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Achievement } from "@/services/profileService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CertificatesCard, Certificate } from "@/components/profile/CertificatesCard";

interface AchievementsCardProps {
  achievements: Achievement[];
  certificates?: Certificate[];
}

const iconMap = {
  Trophy,
  Calendar,
  Award,
};

export function AchievementsCard({ achievements, certificates = [] }: AchievementsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Recognition
        </CardTitle>
        <CardDescription>Your achievements and certificates</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements" className="pt-4">
            <div className="grid gap-4">
              {achievements.length > 0 ? (
                achievements.map((achievement) => {
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
                })
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No achievements yet</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="certificates" className="pt-4">
            {certificates && certificates.length > 0 ? (
              <div className="grid gap-4">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{certificate.course_title}</h4>
                      <p className="text-sm text-gray-600">
                        Completed with score: {certificate.score}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Issued: {new Date(certificate.issued_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No certificates yet</p>
                <p className="text-xs text-muted-foreground mt-1">Complete courses with a score of 75% or higher to earn certificates</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
