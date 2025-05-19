
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

import {
  fetchUserProfile,
  fetchUserAchievements,
  fetchFavoriteTags,
  fetchActivityLog,
  fetchUserCertificates,
} from "@/services/profileService";

import {
  getRecommendedCourses,
  getUserTagStats,
  getAIRecommendations,
} from "@/services/recommendations";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AIRecommendationAlert } from "@/components/profile/AIRecommendationAlert";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const { data: certificates = [], isLoading: isCertificatesLoading } = useQuery({
    queryKey: ['certificates', user?.id],
    queryFn: () => fetchUserCertificates(user?.id || ''),
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
        <h1 className="text-2xl font-bold mb-4">{t('auth.loginRequired')}</h1>
        <p className="mb-6">{t('auth.loginToViewPage')}</p>
        <Button onClick={() => navigate("/login")}>{t('auth.login')}</Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('profile.profileNotFound')}</h1>
        <p className="mb-6">{t('profile.profileLoadError')}</p>
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
        certificates={certificates}
        favoriteTags={favoriteTags}
        tagStats={tagStats}
        recommendedCourses={recommendedCourses}
      />
    </div>
  );
}
