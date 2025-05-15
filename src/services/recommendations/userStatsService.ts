
import { supabase } from "@/integrations/supabase/client";
import { TagStats } from "./types";

// Get statistics about user's completed problem tags
export const getUserTagStats = async (userId: string): Promise<TagStats[]> => {
  try {
    // Get the user's solved problems
    const { data: submissions, error: subError } = await supabase
      .from('submissions')
      .select('problem_id')
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (subError) throw subError;
    if (!submissions.length) return [];

    // Get problem tags for solved problems
    const problemIds = submissions.map(sub => sub.problem_id);
    const { data: problems, error: probError } = await supabase
      .from('problems')
      .select('tags')
      .in('id', problemIds);

    if (probError) throw probError;

    // Count tags
    const tagCounts: Record<string, number> = {};
    problems.forEach(problem => {
      if (problem.tags) {
        problem.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // Convert to array format
    return Object.entries(tagCounts).map(([tag, count]) => ({ tag, count }));
  } catch (error) {
    console.error('Error getting user tag stats:', error);
    return [];
  }
};

// Get user's submission history
export const getUserSubmissions = async (userId: string) => {
  const { data } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  return data || [];
};

// Get information about user's course progress
export const getUserCourseProgress = async (userId: string) => {
  // Get user progress records
  const { data } = await supabase
    .from('user_progress')
    .select('*, courses(title)')
    .eq('user_id', userId);
    
  if (!data || data.length === 0) {
    return [];
  }
  
  // Process the data to return a consistent format
  return data.map(item => {
    // Calculate progress percentage based on completed lessons
    const completedLessons = item.completed_lessons || [];
    const totalLessons = 10; // Default value, ideally we would get this from the database
    const progressPercentage = Math.min(
      Math.round((completedLessons.length / totalLessons) * 100), 
      100
    );
    
    return {
      id: item.course_id,
      title: item.courses?.title || "Неизвестный курс",
      progress: progressPercentage
    };
  });
};
