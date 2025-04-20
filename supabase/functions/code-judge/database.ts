
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

export async function getTestCases(supabase: ReturnType<typeof createClient>, problemId: number) {
  const { data: testCases, error: testCasesError } = await supabase
    .from("test_cases")
    .select("*")
    .eq("problem_id", problemId);

  if (testCasesError) {
    console.error("Error fetching test cases:", testCasesError);
    throw new Error("Failed to fetch test cases");
  }

  return testCases || [];
}

export async function saveSubmission(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  problemId: number,
  code: string,
  language: string,
  status: string,
  executionTime: number,
  memoryUsed: number
) {
  const { error: submissionError } = await supabase
    .from("submissions")
    .insert({
      user_id: userId,
      problem_id: problemId,
      code,
      language,
      status,
      execution_time: executionTime,
      memory_used: memoryUsed
    });

  if (submissionError) {
    console.error("Error saving submission:", submissionError);
    throw new Error("Failed to save submission");
  }
}
