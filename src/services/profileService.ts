
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  level: string;
  rank: number;
  institution: string | null;
  country: string | null;
  bio: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned_at: string;
}

export interface FavoriteTag {
  tag: string;
  created_at: string;
}

export interface ActivityLog {
  date: string;
  problems_solved: number;
}

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }

  return data;
};

export const fetchUserAchievements = async (userId: string): Promise<Achievement[]> => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      achievement:achievements (
        id,
        title,
        description,
        icon
      ),
      earned_at
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user achievements:', error);
    return [];
  }

  return data.map(({ achievement, earned_at }) => ({
    ...achievement,
    earned_at,
  }));
};

export const fetchFavoriteTags = async (userId: string): Promise<FavoriteTag[]> => {
  const { data, error } = await supabase
    .from('favorite_tags')
    .select('tag, created_at')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorite tags:', error);
    return [];
  }

  return data;
};

export const fetchActivityLog = async (userId: string): Promise<ActivityLog[]> => {
  const { data, error } = await supabase
    .from('activity_log')
    .select('date, problems_solved')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(30);

  if (error) {
    console.error('Error fetching activity log:', error);
    return [];
  }

  return data;
};
