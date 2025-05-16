
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Achievement, ActivityLog, FavoriteTag } from "@/services/profileService";
import { TagStats, AIRecommendation, Course } from "@/services/recommendations/types";
import { StatsCard } from "./StatsCard";
import { ActivityGraph } from "./ActivityGraph";
import { AchievementsCard } from "./AchievementsCard";
import { FavoriteTagsCard } from "./FavoriteTagsCard";
import { ActivityCalendar } from "./ActivityCalendar";
import { TagStatsChart } from "./TagStatsChart";
import { CourseRecommendations } from "./CourseRecommendations";
import { Certificate } from "./CertificatesCard";
import { useTranslation } from "react-i18next";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activityLog: ActivityLog[];
  achievements: Achievement[];
  certificates?: Certificate[];
  favoriteTags: FavoriteTag[];
  tagStats: TagStats[];
  recommendedCourses: Course[];
}

export function ProfileTabs({
  activeTab,
  setActiveTab,
  activityLog,
  achievements,
  certificates = [],
  favoriteTags,
  tagStats,
  recommendedCourses,
}: ProfileTabsProps) {
  const { t } = useTranslation();
  
  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
        <TabsTrigger value="overview">{t('profile.overview')}</TabsTrigger>
        <TabsTrigger value="activity">{t('profile.activity')}</TabsTrigger>
        <TabsTrigger value="learning">{t('profile.learning')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6 mt-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard activityLog={activityLog} />
        </div>

        {/* Activity and Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActivityGraph activityLog={activityLog} />
          <AchievementsCard achievements={achievements} certificates={certificates} />
        </div>

        {/* Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FavoriteTagsCard tags={favoriteTags} />
        </div>
      </TabsContent>
      
      <TabsContent value="activity" className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActivityCalendar activityLog={activityLog} />
          <TagStatsChart tagStats={tagStats} />
        </div>
      </TabsContent>
      
      <TabsContent value="learning" className="space-y-6 mt-6">
        <CourseRecommendations courses={recommendedCourses} />
      </TabsContent>
    </Tabs>
  );
}
