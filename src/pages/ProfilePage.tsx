
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

import {
  fetchUserProfile,
  fetchUserAchievements,
  fetchFavoriteTags,
  fetchActivityLog,
} from "@/services/profileService";

import {
  getRecommendedCourses,
  getUserTagStats,
  getAIRecommendations,
} from "@/services/recommendationService";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AIRecommendationAlert } from "@/components/profile/AIRecommendationAlert";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchUserProfile(user?.id || ''),
    enabled: !!user,
  });

  const { data: achievements = [], isLoading: isAchievementsLoading } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: () => fetchUserAchievements(user?.id || ''),
    enabled: !!user,
  });

  const { data: favoriteTags = [], isLoading: isTagsLoading } = useQuery({
    queryKey: ['favoriteTags', user?.id],
    queryFn: () => fetchFavoriteTags(user?.id || ''),
    enabled: !!user,
  });

  const { data: activityLog = [], isLoading: isActivityLoading } = useQuery({
    queryKey: ['activityLog', user?.id],
    queryFn: () => fetchActivityLog(user?.id || ''),
    enabled: !!user,
  });

  const { data: tagStats = [], isLoading: isTagStatsLoading } = useQuery({
    queryKey: ['tagStats', user?.id],
    queryFn: () => getUserTagStats(user?.id || ''),
    enabled: !!user,
  });

  const { data: recommendedCourses = [], isLoading: isCoursesLoading } = useQuery({
    queryKey: ['recommendedCourses', user?.id],
    queryFn: () => getRecommendedCourses(user?.id || ''),
    enabled: !!user,
  });

  const { data: aiRecommendations = [], isLoading: isAILoading } = useQuery({
    queryKey: ['aiRecommendations', user?.id],
    queryFn: () => getAIRecommendations(user?.id || ''),
    enabled: !!user,
  });

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const isLoading = loading || isProfileLoading;
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in</h1>
        <p className="mb-6">You need to be logged in to view this page.</p>
        <Button onClick={() => navigate("/login")}>Log in</Button>
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
      <ProfileHeader 
        profile={profile} 
        onEditProfile={handleEditProfile} 
      />
      
      <AIRecommendationAlert recommendations={aiRecommendations} />

      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activityLog={activityLog}
        achievements={achievements}
        favoriteTags={favoriteTags}
        tagStats={tagStats}
        recommendedCourses={recommendedCourses}
      />
    </div>
  );
}
