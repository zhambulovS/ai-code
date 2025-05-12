import { supabase } from "@/lib/supabaseClient";

export const achievementsService = {
  async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievement_id(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }

    return data || [];
  },

  async getAllAchievements() {
    const { data, error } = await supabase
      .from('achievements')
      .select('*');

    if (error) {
      console.error('Error fetching all achievements:', error);
      return [];
    }

    return data || [];
  },

  async giveAchievement(userId: string, achievementId: number) {
    // Check if the user already has this achievement
    const { data: existingAchievement, error: existingError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    if (existingError && existingError.code !== '200') {
      console.error('Error checking existing achievement:', existingError);
      return false;
    }

    if (existingAchievement) {
      console.log('User already has this achievement.');
      return true; // Achievement already given
    }

    // Give the achievement
    const { data, error } = await supabase
      .from('user_achievements')
      .insert([{ user_id: userId, achievement_id: achievementId }]);

    if (error) {
      console.error('Error giving achievement:', error);
      return false;
    }

    console.log('Achievement given successfully:', data);
    return true;
  },

  async checkProblemSolvedAchievements(userId: string) {
    const { data: solvedProblems, error: solvedProblemsError } = await supabase
      .from('submissions')
      .select('problem_id')
      .eq('user_id', userId)
      .eq('status', 'Accepted')
      .distinct();

    if (solvedProblemsError) {
      console.error('Error fetching solved problems:', solvedProblemsError);
      return;
    }

    const numberOfSolvedProblems = solvedProblems ? solvedProblems.length : 0;

    // Define achievement criteria
    const achievementCriteria = [
      { threshold: 1, achievementId: 1 },   // Solve 1 problem
      { threshold: 5, achievementId: 2 },   // Solve 5 problems
      { threshold: 10, achievementId: 3 },  // Solve 10 problems
      { threshold: 25, achievementId: 4 },  // Solve 25 problems
      { threshold: 50, achievementId: 5 },  // Solve 50 problems
      { threshold: 100, achievementId: 6 }, // Solve 100 problems
    ];

    // Check and give achievements based on criteria
    for (const criterion of achievementCriteria) {
      if (numberOfSolvedProblems >= criterion.threshold) {
        await this.giveAchievement(userId, criterion.achievementId);
      }
    }
  },
  
  async checkCourseProgress(userId: string, courseId: number) {
    const { data: courseCompletionData, error: courseCompletionError } = await supabase
      .from('course_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (courseCompletionError) {
      console.error('Error checking course progress:', courseCompletionError);
      return false;
    }

    if (courseCompletionData) {
      return true;
    }

    const { data: courseTests, error: testsError } = await supabase
      .from('course_tests')
      .select('*')
      .eq('course_id', courseId);

    if (testsError) {
      console.error('Error fetching course tests:', testsError);
      return false;
    }

    if (!courseTests || courseTests.length === 0) {
      return false;
    }

    const { data: testCompletions, error: testCompletionsError } = await supabase
      .from('test_completions')
      .select('*')
      .eq('user_id', userId)
      .in('test_id', courseTests.map(test => test.id));

    if (testCompletionsError) {
      console.error('Error fetching test completions:', testCompletionsError);
      return false;
    }

    // Fix for line 138 - check if testCompletions is not an error and has data
    if (!testCompletions) {
      return false;
    }

    // Now we can safely use the array methods
    return courseTests.length > 0 && testCompletions.length === courseTests.length;
  },

  async checkCourseCompletionAchievements(userId: string) {
    // Achievement ID for completing a course
    const courseCompletionAchievementId = 7;

    // Fetch all courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id');

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      return;
    }

    if (!courses) {
      console.log('No courses found.');
      return;
    }

    // Check if the user has completed any course
    let hasCompletedCourse = false;
    for (const course of courses) {
      const completed = await this.checkCourseProgress(userId, course.id);
      if (completed) {
        hasCompletedCourse = true;
        break;
      }
    }

    // Give achievement if the user has completed any course
    if (hasCompletedCourse) {
      await this.giveAchievement(userId, courseCompletionAchievementId);
    }
  },
};
