
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
    // First get the profiles
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });
    
    // Add search filtering if provided
    if (searchTerm) {
      query = query.or(`full_name.ilike.%${searchTerm}%`);
    }
    
    // Add region filtering if provided
    if (region && region !== "global") {
      query = query.eq('country', region);
    }
    
    // Add pagination
    query = query
      .order('rank', { ascending: true })
      .range((page - 1) * limit, page * limit - 1);
    
    const { data: profiles, count, error } = await query;
    
    if (error) throw error;
    if (!profiles) return { data: [], total: 0 };
    
    // Get the solved problems count for each user
    // In a real app, this would use the timeRange parameter to filter by date
    const userIds = profiles.map(profile => profile.id);
    const { data: submissions, error: subError } = await supabase
      .from('submissions')
      .select('user_id, problem_id')
      .in('user_id', userIds)
      .eq('status', 'accepted');
    
    if (subError) throw subError;
    
    // Count unique problems solved per user
    const problemsSolved: Record<string, number> = {};
    submissions?.forEach(submission => {
      if (!problemsSolved[submission.user_id]) {
        problemsSolved[submission.user_id] = new Set();
      }
      problemsSolved[submission.user_id].add(submission.problem_id);
    });
    
    // Combine the data
    const leaderboardData: LeaderboardEntry[] = profiles.map(profile => ({
      ...profile,
      problems_solved: problemsSolved[profile.id]?.size || 0,
      change: Math.floor(Math.random() * 5) - 2, // Simulated change for demo
    }));
    
    return { 
      data: leaderboardData, 
      total: count || 0 
    };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};
