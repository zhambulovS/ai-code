
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

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
