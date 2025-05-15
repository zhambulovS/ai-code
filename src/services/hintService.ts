
import { supabase } from "@/integrations/supabase/client";

export interface HintRequest {
  problemId: number;
  failedSubmission: string;
  testOutput: string;
}

export interface HintResponse {
  hint: string;
}

export const generateHint = async (request: HintRequest): Promise<HintResponse> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User must be logged in to request hints");
    }

    // Check if user has requested too many hints for this problem
    const { count } = await supabase
      .from('hint_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.user.id)
      .eq('problem_id', request.problemId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (count && count >= 3) {
      throw new Error("Hint limit reached for this problem (3 per 24 hours)");
    }

    const { data, error } = await supabase.functions.invoke<HintResponse>('generate-hint', {
      body: {
        ...request,
        userId: user.user.id
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error generating hint:", error);
    throw error;
  }
};

export const getHintHistory = async (problemId: number) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return [];

  const { data } = await supabase
    .from('hint_logs')
    .select('*')
    .eq('user_id', user.user.id)
    .eq('problem_id', problemId)
    .order('created_at', { ascending: false });

  return data || [];
};

// Получение персонализированной подсказки на основе истории решений пользователя
export const getPersonalizedHint = async (
  userId: string,
  problemId: number,
  difficulty: string,
  previousAttempts: number
): Promise<string> => {
  try {
    // В реальной реализации тут будет обращение к ИИ-модели
    // Для демонстрации возвращаем предопределенную подсказку
    
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User must be logged in to get personalized hints");
    }
    
    // Получим историю решений пользователя для аналогичных задач
    const { data: problemData } = await supabase
      .from('problems')
      .select('tags')
      .eq('id', problemId)
      .single();
      
    if (!problemData || !problemData.tags) {
      return "Попробуйте разбить задачу на более мелкие подзадачи и решать их по отдельности.";
    }
    
    const tags = problemData.tags;
    
    // Проверим прогресс пользователя по задачам с аналогичными тегами
    const { data: similarProblems } = await supabase
      .from('problems')
      .select('id')
      .contains('tags', tags)
      .neq('id', problemId);
      
    if (!similarProblems || similarProblems.length === 0) {
      return "Эта задача уникальна, но применение основных алгоритмических приемов может помочь в ее решении.";
    }
    
    const similarProblemIds = similarProblems.map(p => p.id);
    
    // Проверим, решал ли пользователь похожие задачи
    const { data: solvedSimilar } = await supabase
      .from('submissions')
      .select('problem_id')
      .eq('user_id', user.user.id)
      .eq('status', 'accepted')
      .in('problem_id', similarProblemIds);
      
    // Формируем персонализированную подсказку
    if (!solvedSimilar || solvedSimilar.length === 0) {
      return "Вам может быть полезно сначала решить более простые задачи с тегами: " + tags.join(", ");
    } else if (solvedSimilar.length < similarProblems.length / 2) {
      return "Вы уже решили некоторые похожие задачи. Вспомните приемы, которые вы использовали для них.";
    } else {
      return "У вас хороший опыт решения подобных задач. Попробуйте применить те же подходы, что и раньше, возможно с некоторыми модификациями.";
    }
  } catch (error) {
    console.error('Error getting personalized hint:', error);
    return "Ошибка при получении персонализированной подсказки. Попробуйте позже.";
  }
};

// Новый метод для получения рекомендаций по изучению
export const getLearningRecommendations = async (problemId: number): Promise<string[]> => {
  try {
    // Получаем информацию о задаче
    const { data: problem } = await supabase
      .from('problems')
      .select('tags, difficulty')
      .eq('id', problemId)
      .single();
      
    if (!problem) {
      return ["Изучите основные алгоритмы и структуры данных"];
    }
    
    const recommendations: string[] = [];
    
    // Создаем рекомендации на основе тегов задачи
    if (problem.tags && problem.tags.length > 0) {
      for (const tag of problem.tags) {
        switch(tag.toLowerCase()) {
          case 'arrays':
          case 'массивы':
            recommendations.push("Изучите методы сортировки и поиска в массивах");
            break;
          case 'strings':
          case 'строки':
            recommendations.push("Ознакомьтесь с алгоритмами KMP и Rabin-Karp для эффективного поиска подстрок");
            break;
          case 'dynamic programming':
          case 'dp':
          case 'динамическое программирование':
            recommendations.push("Просмотрите курс по динамическому программированию и мемоизации");
            break;
          case 'graphs':
          case 'графы':
            recommendations.push("Изучите алгоритмы обхода графа (BFS, DFS) и поиска кратчайших путей (Dijkstra, Bellman-Ford)");
            break;
          default:
            break;
        }
      }
    }
    
    // Добавляем рекомендации на основе сложности
    if (problem.difficulty) {
      switch(problem.difficulty.toLowerCase()) {
        case 'easy':
        case 'легкий':
          recommendations.push("Попрактикуйтесь в решении простых задач на этом же языке программирования");
          break;
        case 'medium':
        case 'средний':
          recommendations.push("Изучите оптимизационные техники для вашего текущего решения");
          break;
        case 'hard':
        case 'сложный':
          recommendations.push("Рассмотрите продвинутые алгоритмические техники и структуры данных, такие как сегментные деревья или суффиксные массивы");
          break;
        default:
          break;
      }
    }
    
    if (recommendations.length === 0) {
      return ["Изучите основные алгоритмы и структуры данных для более эффективного решения задач"];
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error getting learning recommendations:', error);
    return ["Изучите основные алгоритмы и структуры данных"];
  }
};
