
import { supabase } from "@/integrations/supabase/client";

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  image_url: string | null;
  rating?: number;
  lessons?: Lesson[];
  tests?: Test[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  order_index: number;
  course_id: string;
}

export interface Test {
  id: string;
  title: string;
  description?: string;
  passing_score: number;
  lesson_id?: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation?: string;
  order_index: number;
  test_id: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  completedLessons: string[];
  completedTests: string[];
  started_at: string;
  completed_at: string | null;
}

export interface TestAttempt {
  id: string;
  user_id: string;
  test_id: string;
  score: number;
  passed: boolean;
  answers: Record<string, string>;
  created_at: string;
}

// Fetch all courses
export const fetchAllCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        difficulty,
        tags,
        image_url
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

// Fetch course by ID with lessons and tests
export const fetchCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    // Get the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        difficulty,
        tags,
        image_url
      `)
      .eq('id', courseId)
      .single();

    if (courseError) throw courseError;
    if (!course) return null;

    // Get lessons for the course
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (lessonsError) throw lessonsError;

    // Get tests for the course
    const { data: tests, error: testsError } = await supabase
      .from('tests')
      .select(`
        id,
        title,
        description,
        passing_score,
        lesson_id
      `)
      .in('lesson_id', lessons.map(lesson => lesson.id))
      .order('created_at', { ascending: true });
    
    if (testsError) throw testsError;

    // Return course with lessons and tests
    return {
      ...course,
      lessons: lessons || [],
      tests: tests || []
    };
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    return null;
  }
};

// Fetch lesson by ID
export const fetchLessonById = async (lessonId: string): Promise<Lesson | null> => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching lesson by ID:', error);
    return null;
  }
};

// Fetch test by ID
export const fetchTestById = async (testId: string): Promise<Test | null> => {
  try {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching test by ID:', error);
    return null;
  }
};

// Fetch test questions
export const fetchTestQuestions = async (testId: string): Promise<TestQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('test_questions')
      .select('*')
      .eq('test_id', testId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    
    // Transform the data to ensure options is Record<string, string>
    return (data || []).map(question => ({
      ...question,
      options: question.options as unknown as Record<string, string>
    }));
  } catch (error) {
    console.error('Error fetching test questions:', error);
    return [];
  }
};

// Enroll user in a course
export const enrollInCourse = async (courseId: string, userId: string): Promise<boolean> => {
  try {
    // Check if already enrolled
    const { data: existingProgress, error: checkError } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (checkError) throw checkError;

    // If already enrolled, return true
    if (existingProgress) return true;

    // Create new enrollment
    const { error: insertError } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        course_id: courseId,
        started_at: new Date().toISOString()
      });

    if (insertError) throw insertError;
    return true;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return false;
  }
};

// Fetch user's progress for a course
export const fetchCourseProgress = async (courseId: string, userId: string): Promise<CourseProgress | null> => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (error) throw error;
    
    if (!data) return null;
    
    return {
      ...data,
      completedLessons: data.completed_lessons || [],
      completedTests: data.completed_tests || []
    };
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return null;
  }
};

// Mark a lesson as completed
export const markLessonAsCompleted = async (courseId: string, lessonId: string, userId: string): Promise<boolean> => {
  try {
    // Get current progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (progressError) throw progressError;
    
    if (!progress) {
      // Create a new progress record if not exists
      const { error: insertError } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          course_id: courseId,
          completed_lessons: [lessonId],
          started_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
    } else {
      // Update existing progress
      const completedLessons = progress.completed_lessons || [];
      if (!completedLessons.includes(lessonId)) {
        const { error: updateError } = await supabase
          .from('user_progress')
          .update({
            completed_lessons: [...completedLessons, lessonId]
          })
          .eq('id', progress.id);
        
        if (updateError) throw updateError;
      }
    }

    return true;
  } catch (error) {
    console.error('Error marking lesson as completed:', error);
    return false;
  }
};

// Submit a test attempt
export const submitTestAttempt = async (
  testId: string, 
  userId: string, 
  answers: Record<string, string>
): Promise<{ score: number; passed: boolean; }> => {
  try {
    // Get test details
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();
    
    if (testError) throw testError;
    
    // Get test questions and correct answers
    const { data: questions, error: questionsError } = await supabase
      .from('test_questions')
      .select('id, correct_answer, test_id')
      .eq('test_id', testId);
    
    if (questionsError) throw questionsError;
    
    // Calculate score
    let correctCount = 0;
    
    for (const question of questions) {
      if (answers[question.id] === question.correct_answer) {
        correctCount++;
      }
    }
    
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= test.passing_score;
    
    // Record the attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('test_attempts')
      .insert({
        user_id: userId,
        test_id: testId,
        score,
        passed,
        answers
      })
      .select()
      .single();
    
    if (attemptError) throw attemptError;
    
    // If passed, update user progress
    if (passed) {
      // Get the course ID from the lesson ID associated with the test
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select('course_id')
        .eq('id', test.lesson_id)
        .maybeSingle();
      
      if (lessonError) throw lessonError;
      
      if (lesson) {
        // Get current progress
        const { data: progress, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('course_id', lesson.course_id)
          .maybeSingle();
        
        if (progressError) throw progressError;
        
        if (progress) {
          const completedTests = progress.completed_tests || [];
          if (!completedTests.includes(testId)) {
            // Update the user's progress
            const { error: updateError } = await supabase
              .from('user_progress')
              .update({
                completed_tests: [...completedTests, testId]
              })
              .eq('id', progress.id);
            
            if (updateError) throw updateError;
          }
        }
      }
    }
    
    return { score, passed };
  } catch (error) {
    console.error('Error submitting test attempt:', error);
    throw error;
  }
};

// Update user skills based on completed courses and tests
export const updateUserSkills = async (userId: string): Promise<boolean> => {
  try {
    // Get all completed tests by the user
    const { data: testAttempts, error: attemptsError } = await supabase
      .from('test_attempts')
      .select(`
        id,
        test_id,
        passed,
        tests (
          id,
          lesson_id,
          lessons (
            id,
            course_id,
            courses (
              id,
              tags
            )
          )
        )
      `)
      .eq('user_id', userId)
      .eq('passed', true);
    
    if (attemptsError) throw attemptsError;
    
    // Extract tags from passed tests' courses
    const skillTags: Record<string, number> = {};
    
    testAttempts.forEach(attempt => {
      const course = attempt.tests?.lessons?.courses;
      if (course && course.tags) {
        course.tags.forEach((tag: string) => {
          skillTags[tag] = (skillTags[tag] || 0) + 1;
        });
      }
    });
    
    // Update user skills
    for (const [skill, count] of Object.entries(skillTags)) {
      // Check if skill already exists
      const { data: existingSkill, error: skillError } = await supabase
        .from('user_skills')
        .select('id, level')
        .eq('user_id', userId)
        .eq('skill', skill)
        .maybeSingle();
      
      if (skillError) throw skillError;
      
      if (existingSkill) {
        // Update skill level based on tests passed
        const newLevel = Math.min(10, existingSkill.level + Math.floor(count / 2));
        
        const { error: updateError } = await supabase
          .from('user_skills')
          .update({ level: newLevel, updated_at: new Date().toISOString() })
          .eq('id', existingSkill.id);
        
        if (updateError) throw updateError;
      } else {
        // Create new skill entry
        const initialLevel = Math.min(5, 1 + Math.floor(count / 2));
        
        const { error: insertError } = await supabase
          .from('user_skills')
          .insert({
            user_id: userId,
            skill,
            level: initialLevel
          });
        
        if (insertError) throw insertError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user skills:', error);
    return false;
  }
};
