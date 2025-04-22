
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./profileService";

export interface LeaderboardEntry extends UserProfile {
  problems_solved: number;
  change: number;
}

export const fetchLeaderboard = async (
  timeRange: string = "all-time", 
  region: string = "global",
  page: number = 1,
  limit: number = 10,
  searchTerm: string = ""
): Promise<{ data: LeaderboardEntry[], total: number }> => {
  try {
    let query = supabase
      .from('leaderboard_view')
      .select('*', { count: 'exact' });
    
    // Add search filtering if provided
    if (searchTerm) {
      query = query.ilike('username', `%${searchTerm}%`);
    }
    
    // Add region filtering if provided
    if (region && region !== "global") {
      query = query.eq('country', region);
    }
    
    // Add pagination
    query = query
      .order('problems_solved', { ascending: false })
      .order('total_score', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
    
    const { data: leaderboardData, count, error } = await query;
    
    if (error) throw error;
    if (!leaderboardData) return { data: [], total: 0 };
    
    // Map the data to match our LeaderboardEntry interface
    const entries: LeaderboardEntry[] = leaderboardData.map(entry => ({
      id: entry.user_id,
      full_name: entry.username,
      avatar_url: entry.avatar_url,
      level: entry.level,
      rank: entry.rank,
      institution: entry.institution,
      country: entry.country,
      bio: null,
      problems_solved: entry.problems_solved || 0,
      change: Math.floor(Math.random() * 5) - 2 // Simulated rank change for demo
    }));
    
    return { 
      data: entries, 
      total: count || 0 
    };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};
