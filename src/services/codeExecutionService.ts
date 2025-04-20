
import { supabase } from "@/integrations/supabase/client";
import type { ExecutionResult, TestResult } from './interfaces/codeExecution';
import { normalizeOutput } from './utils/outputNormalizer';
import { parseInput } from './parsers/inputParser';
import { simulateLocalExecution } from './simulators/localExecutionSimulator';

export type { ExecutionResult, TestResult };

export const executeCode = async (
  code: string,
  language: string,
  input: string
): Promise<ExecutionResult> => {
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase.functions.invoke('code-judge', {
          body: {
            code,
            language,
            input,
            timeLimit: 2000,
            memoryLimit: 256000
          }
        });
        
        if (error) {
          console.error("Error invoking judge function:", error);
          throw error;
        }
        
        if (data.error) {
          console.error("Judge function returned error:", data.error);
          return {
            output: "Error: " + data.error,
            success: false,
            executionTime: 0,
            memoryUsed: 0,
            error: data.error
          };
        }
        
        return {
          output: data.output || "",
          success: !data.error,
          executionTime: data.executionTime || 0,
          memoryUsed: data.memoryUsed || 0,
          error: data.error
        };
      } catch (error) {
        console.error("Error using judge server:", error);
      }
    }
    
    return simulateLocalExecution(code, language, input);
  } catch (error) {
    console.error("Execution error:", error);
    return {
      output: "Error occurred during execution",
      success: false,
      executionTime: 1,
      memoryUsed: 0,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

export const runTestCases = async (
  code: string,
  language: string,
  testCases: any[],
  problemId?: number,
  userId?: string
): Promise<TestResult[]> => {
  if (problemId && userId) {
    try {
      const { data, error } = await supabase.functions.invoke('code-judge', {
        body: {
          code,
          language,
          problemId,
          userId,
          timeLimit: 2000,
          memoryLimit: 256000
        }
      });
      
      if (error) {
        console.error("Error invoking judge function:", error);
        throw error;
      }
      
      if (data.error) {
        console.error("Judge function returned error:", data.error);
        return [{
          testCase: { input: "Error", expected_output: "N/A" },
          output: "Error: " + data.error,
          expected: "N/A",
          passed: false,
          executionTime: 0,
          error: data.error
        }];
      }
      
      if (data.testResults && Array.isArray(data.testResults)) {
        return data.testResults.map((result: any) => ({
          testCase: testCases.find(tc => tc.id === result.id) || {
            input: result.input,
            expected_output: result.expected
          },
          output: result.output,
          expected: result.expected,
          passed: result.passed,
          executionTime: result.executionTime,
          memoryUsed: result.memoryUsed,
          error: result.error
        }));
      }
      
      throw new Error("Invalid test results format");
    } catch (error) {
      console.error("Error running test cases through judge:", error);
    }
  }
  
  const results: TestResult[] = [];
  
  for (const testCase of testCases) {
    try {
      const result = await executeCode(code, language, testCase.input);
      
      const normalizedOutput = normalizeOutput(result.output);
      const normalizedExpected = normalizeOutput(testCase.expected_output);
      
      results.push({
        testCase,
        output: result.output,
        expected: testCase.expected_output,
        passed: normalizedOutput === normalizedExpected,
        executionTime: result.executionTime,
        memoryUsed: result.memoryUsed,
        error: result.error
      });
    } catch (error) {
      results.push({
        testCase,
        output: "Error executing code",
        expected: testCase.expected_output,
        passed: false,
        executionTime: 0,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
  
  return results;
};

export { parseInput };
