
import { supabase } from "@/integrations/supabase/client";

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  rating: number;
}

export interface TagStats {
  tag: string;
  count: number;
}

export interface AIRecommendation {
  type: "problem" | "course" | "tip" | "continue";
  title: string;
  description: string;
  difficulty?: string;
  link?: string;
  progress?: number;
}

// Получение рекомендуемых курсов на основе предпочтений пользователя
export const getRecommendedCourses = async (userId: string): Promise<Course[]> => {
  try {
    // Получаем статистику по тегам пользователя
    const tagStats = await getUserTagStats(userId);
    
    // В настоящей реализации здесь был бы запрос к ИИ-модели для рекомендаций
    // на основе статистики пользователя
    
    // Получаем все доступные курсы
    const { data: allCourses, error } = await supabase
      .from('courses')
      .select('*');
      
    if (error) throw error;
    
    if (!allCourses || allCourses.length === 0) {
      // Если курсы не найдены, возвращаем примеры курсов
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
    
    // Сопоставляем теги пользователя с курсами для получения персонализированных рекомендаций
    // В настоящей реализации здесь был бы более сложный алгоритм рекомендаций
    
    return allCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      tags: course.tags || [],
      rating: course.rating || 4.5
    }));
  } catch (error) {
    console.error('Error getting recommended courses:', error);
    return [];
  }
};

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

// Получение рекомендаций от ИИ для пользователя
export const getAIRecommendations = async (userId: string): Promise<AIRecommendation[]> => {
  try {
    // Получаем историю решенных задач и прогресса по курсам пользователя
    const [submissions, progress] = await Promise.all([
      getUserSubmissions(userId),
      getUserCourseProgress(userId)
    ]);
    
    // В настоящей реализации здесь был бы запрос к ИИ-модели
    // Для простоты имитируем ответ на основе истории пользователя
    
    const recommendations: AIRecommendation[] = [];
    
    // Добавляем рекомендацию по продолжению курса, если есть незавершенные курсы
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
    
    // Добавляем рекомендацию по задаче
    recommendations.push({
      type: "problem",
      title: "Two Sum с ограничениями",
      description: "Попробуйте эту задачу, чтобы улучшить ваши навыки работы с массивами и оптимизации",
      difficulty: "Medium",
      link: "/problems/42"
    });
    
    // Добавляем совет на основе статистики решенных задач
    recommendations.push({
      type: "tip",
      title: "Улучшите свои навыки динамического программирования",
      description: "Похоже, у вас возникают трудности с задачами DP. Попробуйте разбивать их на подзадачи и строить решение итеративно."
    });
    
    // Добавляем рекомендацию по курсу
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

// Вспомогательные функции для получения данных пользователя
const getUserSubmissions = async (userId: string) => {
  const { data } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  return data || [];
};

const getUserCourseProgress = async (userId: string) => {
  const { data } = await supabase
    .from('course_progress')
    .select('*, courses(title)')
    .eq('user_id', userId);
    
  return (data || []).map(item => ({
    id: item.course_id,
    title: item.courses?.title || "Неизвестный курс",
    progress: item.progress || 0
  }));
};

// Новый метод для получения персонализированных подсказок по текущей задаче
export const getPersonalizedHint = async (
  userId: string, 
  problemId: number,
  difficulty: string,
  previousAttempts: number
): Promise<string> => {
  try {
    // В реальной реализации здесь был бы запрос к ИИ для генерации персонализированной подсказки
    // на основе данных о пользователе и его предыдущих попытках
    
    // Имитируем ответы для разных уровней сложности и количества попыток
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
