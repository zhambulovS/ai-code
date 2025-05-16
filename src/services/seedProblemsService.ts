
import { supabase } from "@/integrations/supabase/client";
import { allProblems } from "@/data/problems";

// Function to insert a problem and its test cases
export const insertProblem = async (problemIndex: number) => {
  if (problemIndex < 0 || problemIndex >= allProblems.length) {
    throw new Error('Invalid problem index');
  }

  const problem = allProblems[problemIndex];
  
  try {
    // Insert the problem
    const { data: insertedProblem, error: problemError } = await supabase
      .from('problems')
      .insert({
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        tags: problem.tags,
        acceptance_rate: problem.acceptance_rate,
        time_limit: problem.time_limit,
        memory_limit: problem.memory_limit
      })
      .select()
      .single();
    
    if (problemError) {
      throw problemError;
    }

    // Insert test cases
    if (insertedProblem) {
      const testCasesData = problem.sample_testcases.map(testCase => ({
        problem_id: insertedProblem.id,
        input: testCase.input,
        expected_output: testCase.expected_output,
        is_sample: testCase.is_sample
      }));

      const { error: testCasesError } = await supabase
        .from('test_cases')
        .insert(testCasesData);
        
      if (testCasesError) {
        throw testCasesError;
      }
    }

    return insertedProblem;
  } catch (error) {
    console.error('Error inserting problem:', error);
    throw error;
  }
};

// Function to delete all problems and test cases (be careful!)
export const clearAllProblems = async () => {
  try {
    // First delete all test_cases (due to foreign key constraint)
    const { error: testCasesError } = await supabase
      .from('test_cases')
      .delete()
      .neq('id', 'does-not-exist'); // Delete all rows
    
    if (testCasesError) {
      throw testCasesError;
    }

    // Then delete all problems
    const { error: problemsError } = await supabase
      .from('problems')
      .delete()
      .neq('id', 0); // Delete all rows
    
    if (problemsError) {
      throw problemsError;
    }

    return true;
  } catch (error) {
    console.error('Error clearing problems:', error);
    throw error;
  }
};

// Function to check if problems exist already
export const countProblems = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('problems')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Error counting problems:', error);
    return 0;
  }
};

// Function to seed database with problems if needed
export const ensureProblemsExist = async () => {
  try {
    const problemCount = await countProblems();
    
    if (problemCount === 0) {
      // Insert all problems one by one
      for (let i = 0; i < allProblems.length; i++) {
        await insertProblem(i);
      }
      return true;
    }
    
    return false; // No action needed
  } catch (error) {
    console.error('Error ensuring problems exist:', error);
    throw error;
  }
};
