
import { supabase } from "@/integrations/supabase/client";
import { Course } from "./types";
import { getUserTagStats } from "./userStatsService";

// Get recommended courses based on user's preferences
export const getRecommendedCourses = async (userId: string): Promise<Course[]> => {
  try {
    // Get user's tag statistics
    const tagStats = await getUserTagStats(userId);
    
    // In a real implementation, this would use an AI model for recommendations
    // based on user statistics
    
    // Get all available courses
    const { data: allCourses, error } = await supabase
      .from('courses')
      .select('*');
      
    if (error) throw error;
    
    if (!allCourses || allCourses.length === 0) {
      // If no courses found, return example courses
      return [
        {
          id: "1",
          title: "Динамическое программирование",
          description: "Изучите продвинутые техники для эффективного решения задач DP",
          difficulty: "Advanced",
          tags: ["Dynamic Programming", "Algorithms"],
          rating: 4.8
        },
        {
          id: "2",
          title: "Основы теории графов",
          description: "Важные концепции теории графов с практическими применениями",
          difficulty: "Intermediate",
          tags: ["Graphs", "BFS", "DFS"],
          rating: 4.6
        },
        {
          id: "3",
          title: "Структуры данных: глубокое погружение",
          description: "Углубленное изучение продвинутых структур данных",
          difficulty: "Intermediate",
          tags: ["Data Structures", "Trees", "Heaps"],
          rating: 4.7
        }
      ];
    }
    
    // Match user tags with courses for personalized recommendations
    // In a real implementation, this would be a more complex recommendation algorithm
    
    return allCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      tags: course.tags || [],
      rating: 4.5 // Add default rating since it doesn't exist in the database
    }));
  } catch (error) {
    console.error('Error getting recommended courses:', error);
    return [];
  }
};

// Get learning recommendations for the user
export const getLearningRecommendations = async (userId: string): Promise<Course[]> => {
  try {
    // Get user's tag statistics
    const tagStats = await getUserTagStats(userId);
    
    // In a real implementation, this would use an AI model for recommendations
    // based on user statistics
    
    // Get all available courses
    const { data: allCourses, error } = await supabase
      .from('courses')
      .select('*');
      
    if (error) throw error;
    
    if (!allCourses || allCourses.length === 0) {
      // If no courses found, return example courses
      return [
        {
          id: "1",
          title: "Динамическое программирование",
          description: "Изучите продвинутые техники для эффективного решения задач DP",
          difficulty: "Advanced",
          tags: ["Dynamic Programming", "Algorithms"],
          rating: 4.8
        },
        {
          id: "2",
          title: "Основы теории графов",
          description: "Важные концепции теории графов с практическими применениями",
          difficulty: "Intermediate",
          tags: ["Graphs", "BFS", "DFS"],
          rating: 4.6
        },
        {
          id: "3",
          title: "Структуры данных: глубокое погружение",
          description: "Углубленное изучение продвинутых структур данных",
          difficulty: "Intermediate",
          tags: ["Data Structures", "Trees", "Heaps"],
          rating: 4.7
        }
      ];
    }
    
    // Match user tags with courses for personalized recommendations
    // In a real implementation, this would be a more complex recommendation algorithm
    
    return allCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      tags: course.tags || [],
      rating: 4.5 // Add default rating since it doesn't exist in the database
    }));
  } catch (error) {
    console.error('Error getting learning recommendations:', error);
    return [];
  }
};
