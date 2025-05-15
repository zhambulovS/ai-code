
import { AIRecommendation } from "./types";
import { getUserCourseProgress, getUserSubmissions } from "./userStatsService";

// Get AI-powered recommendations for the user
export const getAIRecommendations = async (userId: string): Promise<AIRecommendation[]> => {
  try {
    // Get user's solved problems history and course progress
    const [submissions, progress] = await Promise.all([
      getUserSubmissions(userId),
      getUserCourseProgress(userId)
    ]);
    
    // In a real implementation, this would query an AI model
    // For simplicity, we simulate a response based on user history
    
    const recommendations: AIRecommendation[] = [];
    
    // Add recommendation to continue a course if there are uncompleted courses
    if (progress.length > 0) {
      const inProgressCourse = progress.find(p => p.progress < 100);
      if (inProgressCourse) {
        recommendations.push({
          type: "continue",
          title: `Продолжить курс: ${inProgressCourse.title}`,
          description: `Вы прошли ${inProgressCourse.progress}% этого курса. Продолжайте обучение!`,
          link: `/courses/${inProgressCourse.id}`,
          progress: inProgressCourse.progress
        });
      }
    }
    
    // Add problem recommendation
    recommendations.push({
      type: "problem",
      title: "Two Sum с ограничениями",
      description: "Попробуйте эту задачу, чтобы улучшить ваши навыки работы с массивами и оптимизации",
      difficulty: "Medium",
      link: "/problems/42"
    });
    
    // Add tip based on solved problems statistics
    recommendations.push({
      type: "tip",
      title: "Улучшите свои навыки динамического программирования",
      description: "Похоже, у вас возникают трудности с задачами DP. Попробуйте разбивать их на подзадачи и строить решение итеративно."
    });
    
    // Add course recommendation
    recommendations.push({
      type: "course",
      title: "Алгоритмы на графах для соревновательного программирования",
      description: "Этот курс поможет вам освоить концепции теории графов, которые часто встречаются на соревнованиях",
      link: "/courses/graph-algorithms"
    });
    
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
    // In a real implementation, this would query an AI model for a personalized hint
    // based on user data and previous attempts
    
    // Simulate responses for different difficulty levels and number of attempts
    if (previousAttempts === 0) {
      return "Начните с внимательного прочтения условия задачи. Обратите внимание на граничные случаи.";
    } else if (previousAttempts === 1) {
      if (difficulty === "easy") {
        return "Подумайте о использовании хеш-таблицы для оптимизации поиска.";
      } else if (difficulty === "medium") {
        return "Рассмотрите возможность использования динамического программирования для кеширования промежуточных результатов.";
      } else {
        return "Для сложных задач часто требуется комбинация нескольких алгоритмов. Попробуйте разбить проблему на подзадачи.";
      }
    } else {
      return "Не сдавайтесь! Попробуйте взглянуть на задачу с другой стороны. Иногда решение может быть проще, чем кажется.";
    }
  } catch (error) {
    console.error('Error getting personalized hint:', error);
    return "Произошла ошибка при получении подсказки.";
  }
};
