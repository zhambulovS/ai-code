
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
