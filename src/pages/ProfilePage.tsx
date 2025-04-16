
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AchievementsCard } from "@/components/profile/AchievementsCard";
import { ActivityGraph } from "@/components/profile/ActivityGraph";
import { FavoriteTagsCard } from "@/components/profile/FavoriteTagsCard";
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

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [favoriteTags, setFavoriteTags] = useState<FavoriteTag[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadProfileData = async () => {
      setLoading(true);
      try {
        const [profileData, achievementsData, tagsData, activityData] = await Promise.all([
          fetchUserProfile(user.id),
          fetchUserAchievements(user.id),
          fetchFavoriteTags(user.id),
          fetchActivityLog(user.id),
        ]);

        setProfile(profileData);
        setAchievements(achievementsData);
        setFavoriteTags(tagsData);
        setActivityLog(activityData);
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user, navigate]);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (loading) {
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ActivityGraph activityLog={activityLog} />
        <AchievementsCard achievements={achievements} />
      </div>

      {/* Tags */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FavoriteTagsCard tags={favoriteTags} />
      </div>
    </div>
  );
}
