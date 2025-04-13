
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Типы данных
export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  acceptance_rate: number;
  time_limit: number;
  memory_limit: number;
  created_at: string;
  updated_at: string;
}

export interface TestCase {
  id: string;
  problem_id: number;
  input: string;
  expected_output: string;
  is_sample: boolean;
}

export interface Submission {
  id: string;
  user_id: string;
  problem_id: number;
  code: string;
  language: string;
  status: string;
  execution_time?: number;
  memory_used?: number;
  created_at: string;
  updated_at: string;
}

// Получение списка всех задач
export const fetchProblems = async (): Promise<Problem[]> => {
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching problems:", error);
    throw new Error("Failed to fetch problems");
  }

  return data || [];
};

// Получение задачи по ID
export const fetchProblemById = async (id: number): Promise<Problem> => {
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching problem ${id}:`, error);
    throw new Error(`Failed to fetch problem ${id}`);
  }

  return data;
};

// Получение тестовых примеров для задачи
export const fetchTestCasesByProblemId = async (problemId: number): Promise<TestCase[]> => {
  const { data, error } = await supabase
    .from("test_cases")
    .select("*")
    .eq("problem_id", problemId)
    .eq("is_sample", true);

  if (error) {
    console.error(`Error fetching test cases for problem ${problemId}:`, error);
    throw new Error(`Failed to fetch test cases for problem ${problemId}`);
  }

  return data || [];
};

// Получение решений пользователя для задачи
export const fetchUserSubmissionsForProblem = async (
  problemId: number,
  userId: string
): Promise<Submission[]> => {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("problem_id", problemId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching submissions for problem ${problemId}:`, error);
    throw new Error(`Failed to fetch submissions for problem ${problemId}`);
  }

  return data || [];
};

// Отправка нового решения
export const submitSolution = async (submission: Omit<Submission, "id" | "created_at" | "updated_at">): Promise<Submission> => {
  const { data, error } = await supabase
    .from("submissions")
    .insert(submission)
    .select()
    .single();

  if (error) {
    console.error("Error submitting solution:", error);
    throw new Error("Failed to submit solution");
  }

  return data;
};

// React Query хуки
export const useProblems = () => {
  return useQuery({
    queryKey: ["problems"],
    queryFn: fetchProblems,
  });
};

export const useProblem = (id: number) => {
  return useQuery({
    queryKey: ["problem", id],
    queryFn: () => fetchProblemById(id),
    enabled: !!id,
  });
};

export const useTestCases = (problemId: number) => {
  return useQuery({
    queryKey: ["testCases", problemId],
    queryFn: () => fetchTestCasesByProblemId(problemId),
    enabled: !!problemId,
  });
};

export const useUserSubmissions = (problemId: number, userId: string) => {
  return useQuery({
    queryKey: ["submissions", problemId, userId],
    queryFn: () => fetchUserSubmissionsForProblem(problemId, userId),
    enabled: !!problemId && !!userId,
  });
};

export const useSubmitSolution = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: submitSolution,
    onSuccess: (data) => {
      // Инвалидация кэша запросов после успешной отправки решения
      queryClient.invalidateQueries({ queryKey: ["submissions", data.problem_id, data.user_id] });
    },
  });
};
