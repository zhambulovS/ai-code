
import { supabase } from "@/integrations/supabase/client";
import { sampleCourses } from "@/data/sampleCourses";

// Function to insert a course
export const insertCourse = async (courseIndex: number) => {
  if (courseIndex < 0 || courseIndex >= sampleCourses.length) {
    throw new Error('Invalid course index');
  }

  const course = sampleCourses[courseIndex];
  
  try {
    const { data: insertedCourse, error } = await supabase
      .from('courses')
      .insert({
        title: course.title,
        description: course.description,
        difficulty: course.difficulty,
        tags: course.tags
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }

    return insertedCourse;
  } catch (error) {
    console.error('Error inserting course:', error);
    throw error;
  }
};

// Function to delete all courses (be careful!)
export const clearAllCourses = async () => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .neq('id', 'does-not-exist'); // Delete all rows
    
    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error clearing courses:', error);
    throw error;
  }
};

// Function to check if courses exist already
export const countCourses = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Error counting courses:', error);
    return 0;
  }
};

// Function to seed database with courses if needed
export const ensureCoursesExist = async () => {
  try {
    const courseCount = await countCourses();
    
    if (courseCount === 0) {
      // Insert all courses one by one
      for (let i = 0; i < sampleCourses.length; i++) {
        await insertCourse(i);
      }
      return true;
    }
    
    return false; // No action needed
  } catch (error) {
    console.error('Error ensuring courses exist:', error);
    throw error;
  }
};
