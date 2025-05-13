import { supabase } from "@/integrations/supabase/client";
import type { Achievement } from "@/services/profileService";

export const grantAchievement = async (
  userId: string,
  achievementId: string
): Promise<Achievement | null> => {
  try {
    // Check if user already has this achievement
    const { data: existingAchievement } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    if (existingAchievement) {
      return null; // User already has this achievement
    }

    // Grant the achievement
    const { error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId
      });

    if (error) {
      console.error("Error granting achievement:", error);
      throw error;
    }

    // Get the achievement details to return
    const { data: achievement } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single();

    if (!achievement) {
      throw new Error("Achievement not found");
    }

    return {
      ...achievement,
      earned_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in grantAchievement:", error);
    return null;
  }
};

export const createCourseCompletionAchievement = async (
  userId: string,
  courseId: string,
  courseTitle: string
): Promise<Achievement | null> => {
  try {
    // First check if there's an existing achievement for this course
    const { data: existingAchievement } = await supabase
      .from('achievements')
      .select('*')
      .eq('title', `Completed: ${courseTitle}`)
      .single();

    let achievementId = existingAchievement?.id;

    // If no achievement exists for this course, create one
    if (!existingAchievement) {
      const { data: newAchievement, error } = await supabase
        .from('achievements')
        .insert({
          title: `Completed: ${courseTitle}`,
          description: `Successfully completed the "${courseTitle}" course`,
          icon: 'Trophy'
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating achievement:", error);
        throw error;
      }

      achievementId = newAchievement.id;
    }

    if (achievementId) {
      return grantAchievement(userId, achievementId);
    }
    
    return null;
  } catch (error) {
    console.error("Error in createCourseCompletionAchievement:", error);
    return null;
  }
};

export const checkCourseCompletion = async (
  userId: string,
  courseId: string
): Promise<boolean> => {
  try {
    // Get course data with lessons and tests
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*, lessons(*), tests(*)')
      .eq('id', courseId)
      .maybeSingle();
    
    if (courseError || !course) {
      console.error("Error fetching course:", courseError);
      return false;
    }

    // Get user progress
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();
    
    if (!progress) {
      return false;
    }

    // Check if all lessons are completed
    const allLessonsCompleted = course.lessons && course.lessons.length > 0 && 
      course.lessons.every((lesson: any) => 
        progress.completed_lessons?.includes(lesson.id)
      );
    
    // Check if all required tests are completed
    const allRequiredTestsCompleted = !course.tests || course.tests.length === 0 || 
      course.tests.every((test: any) => 
        progress.completed_tests?.includes(test.id)
      );
    
    return allLessonsCompleted && allRequiredTestsCompleted;
  } catch (error) {
    console.error("Error checking course completion:", error);
    return false;
  }
};
