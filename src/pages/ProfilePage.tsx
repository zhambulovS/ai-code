
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Settings, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AchievementsCard } from "@/components/profile/AchievementsCard";
import { ActivityGraph } from "@/components/profile/ActivityGraph";
import { ActivityCalendar } from "@/components/profile/ActivityCalendar";
import { FavoriteTagsCard } from "@/components/profile/FavoriteTagsCard";
import { TagStatsChart } from "@/components/profile/TagStatsChart";
import { CourseRecommendations } from "@/components/profile/CourseRecommendations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

import {
  fetchUserProfile,
  fetchUserAchievements,
  fetchFavoriteTags,
  fetchActivityLog,
  type UserProfile,
  type Achievement,
  type FavoriteTag,
  type ActivityLog,
} from "@/services/profileService";

import {
  getRecommendedCourses,
  getUserTagStats,
  getAIRecommendations,
  type Course,
  type TagStats,
  type AIRecommendation,
} from "@/services/recommendationService";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchUserProfile(user?.id || ''),
    enabled: !!user,
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: () => fetchUserAchievements(user?.id || ''),
    enabled: !!user,
  });

  const { data: favoriteTags = [] } = useQuery({
    queryKey: ['favoriteTags', user?.id],
    queryFn: () => fetchFavoriteTags(user?.id || ''),
    enabled: !!user,
  });

  const { data: activityLog = [] } = useQuery({
    queryKey: ['activityLog', user?.id],
    queryFn: () => fetchActivityLog(user?.id || ''),
    enabled: !!user,
  });

  const { data: tagStats = [] } = useQuery({
    queryKey: ['tagStats', user?.id],
    queryFn: () => getUserTagStats(user?.id || ''),
    enabled: !!user,
  });

  const { data: recommendedCourses = [] } = useQuery({
    queryKey: ['recommendedCourses', user?.id],
    queryFn: () => getRecommendedCourses(user?.id || ''),
    enabled: !!user,
  });

  const { data: aiRecommendations = [] } = useQuery({
    queryKey: ['aiRecommendations', user?.id],
    queryFn: () => getAIRecommendations(user?.id || ''),
    enabled: !!user,
  });

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <p className="mb-6">We couldn't load your profile data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {profile.full_name?.split(' ').map(n => n[0]).join('') || '?'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold">{profile.full_name}</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>{profile.level}</span>
                <span className="text-gray-300">•</span>
                <span>Rank #{profile.rank}</span>
                {profile.institution && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span>{profile.institution}</span>
                  </>
                )}
              </div>
              {profile.bio && (
                <p className="mt-2 text-gray-600">{profile.bio}</p>
              )}
            </div>
          </div>
          
          <Button variant="outline" onClick={handleEditProfile}>
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>
      
      {/* AI Recommendations Alert */}
      {aiRecommendations.length > 0 && (
        <Alert className="mb-8 border-primary/20 bg-primary/10">
          <Lightbulb className="h-4 w-4 text-primary" />
          <AlertTitle>AI Recommendation</AlertTitle>
          <AlertDescription>
            {aiRecommendations[0].description}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">Problems Solved</h3>
                <div className="mt-2 space-y-2">
                  <div className="text-3xl font-bold text-primary">
                    {activityLog.reduce((sum, day) => sum + day.problems_solved, 0)}
                  </div>
                  <p className="text-sm text-gray-600">Total problems completed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity and Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActivityGraph activityLog={activityLog} />
            <AchievementsCard achievements={achievements} />
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
    </div>
  );
}
