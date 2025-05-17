
import { AIRecommendation } from "./types";
import { getUserCourseProgress, getUserSubmissions } from "./userStatsService";
import { supabase } from "@/integrations/supabase/client";

// Get AI-powered recommendations for the user
export const getAIRecommendations = async (userId: string): Promise<AIRecommendation[]> => {
  try {
    // Get user's solved problems history and course progress
    const [submissions, progress] = await Promise.all([
      getUserSubmissions(userId),
      getUserCourseProgress(userId)
    ]);
    
    // Get user's profile data for better personalization
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    const recommendations: AIRecommendation[] = [];
    
    // Add recommendation to continue a course if there are uncompleted courses
    if (progress.length > 0) {
      const inProgressCourse = progress.find(p => p.progress < 100);
      if (inProgressCourse) {
        recommendations.push({
          type: "continue",
          title: 'profile.continueCourse',
          description: 'profile.courseProgressDescription',
          link: `/courses/${inProgressCourse.id}`,
          progress: inProgressCourse.progress
        });
      }
    }
    
    // Get user's problem statistics
    const { data: problemStats } = await supabase
      .from('submissions')
      .select('problem_id, status')
      .eq('user_id', userId);
    
    // Get problems user has attempted but not solved
    if (problemStats) {
      const attemptedButNotSolved = problemStats
        .filter(s => s.status !== 'accepted')
        .map(s => s.problem_id)
        .filter((value, index, self) => self.indexOf(value) === index);
      
      if (attemptedButNotSolved.length > 0) {
        // Get a challenging problem the user attempted but didn't solve
        const { data: challengingProblem } = await supabase
          .from('problems')
          .select('*')
          .in('id', attemptedButNotSolved)
          .limit(1)
          .single();
        
        if (challengingProblem) {
          recommendations.push({
            type: "problem",
            title: 'profile.tryAgainProblem',
            description: 'profile.problemRetryDescription',
            difficulty: challengingProblem.difficulty,
            link: `/problems/${challengingProblem.id}`
          });
        }
      }
    }
    
    // Add tip based on solved problems statistics
    recommendations.push({
      type: "tip",
      title: 'profile.improveProgrammingSkills',
      description: 'profile.programmingTipDescription'
    });
    
    // Add course recommendation based on user level
    const userLevel = profileData?.level || 'Beginner';
    const difficultyMap = {
      'Beginner': 'easy',
      'Intermediate': 'medium',
      'Advanced': 'hard'
    };
    
    const { data: recommendedCourse } = await supabase
      .from('courses')
      .select('*')
      .eq('difficulty', difficultyMap[userLevel as keyof typeof difficultyMap] || 'medium')
      .limit(1)
      .single();
    
    if (recommendedCourse) {
      recommendations.push({
        type: "course",
        title: 'profile.recommendedCourse',
        description: 'profile.courseRecommendationDescription',
        link: `/courses/${recommendedCourse.id}`
      });
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return [];
  }
};

// Get personalized hints for the current problem
export const getPersonalizedHint = async (
  userId: string, 
  problemId: number,
  difficulty: string,
  previousAttempts: number
): Promise<string> => {
  try {
    // Implement a more sophisticated hint system
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User must be logged in to get personalized hints");
    }
    
    // Get the user's history with similar problems
    const { data: problemData } = await supabase
      .from('problems')
      .select('tags')
      .eq('id', problemId)
      .single();
      
    if (!problemData || !problemData.tags) {
      return "Try breaking the problem into smaller subproblems and solving them individually.";
    }
    
    const tags = problemData.tags;
    
    // Check the user's progress on problems with similar tags
    const { data: similarProblems } = await supabase
      .from('problems')
      .select('id')
      .contains('tags', tags)
      .neq('id', problemId);
      
    if (!similarProblems || similarProblems.length === 0) {
      return "This problem is unique, but applying basic algorithmic techniques might help solve it.";
    }
    
    const similarProblemIds = similarProblems.map(p => p.id);
    
    // Check if the user has solved similar problems
    const { data: solvedSimilar } = await supabase
      .from('submissions')
      .select('problem_id')
      .eq('user_id', user.user.id)
      .eq('status', 'accepted')
      .in('problem_id', similarProblemIds);
      
    // Generate a personalized hint
    if (!solvedSimilar || solvedSimilar.length === 0) {
      return "You might find it helpful to first solve some easier problems with tags: " + tags.join(", ");
    } else if (solvedSimilar.length < similarProblems.length / 2) {
      return "You've already solved some similar problems. Remember the techniques you used for them.";
    } else {
      return "You have good experience with similar problems. Try applying the same approaches as before, perhaps with some modifications.";
    }
  } catch (error) {
    console.error('Error getting personalized hint:', error);
    return "Error getting personalized hint. Please try again later.";
  }
};
