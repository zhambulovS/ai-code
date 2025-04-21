
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
    // Log the execution attempt
    console.log(`Executing code in ${language}`, { codeLength: code.length, input });
    
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
        
        console.log("Judge function returned result:", data);
        
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
    
    // Fallback to local execution if Supabase function fails or is not available
    console.log("Falling back to local execution");
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
  console.log("Running test cases", { 
    language,
    testCasesCount: testCases.length,
    problemId,
    hasUserId: !!userId 
  });
  
  if (problemId && userId && supabase) {
    try {
      console.log("Using Supabase code-judge function for test cases");
      
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
        console.error("Error invoking judge function for tests:", error);
        throw error;
      }
      
      if (data.error) {
        console.error("Judge function returned error for tests:", data.error);
        return [{
          testCase: { input: "Error", expected_output: "N/A" },
          output: "Error: " + data.error,
          expected: "N/A",
          passed: false,
          executionTime: 0,
          error: data.error
        }];
      }
      
      console.log("Judge function returned test results:", data);
      
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
  
  console.log("Using local execution for test cases");
  
  const results: TestResult[] = [];
  
  for (const testCase of testCases) {
    try {
      console.log(`Running test case: ${testCase.id || 'unknown'}`);
      const result = await executeCode(code, language, testCase.input);
      
      const normalizedOutput = normalizeOutput(result.output);
      const normalizedExpected = normalizeOutput(testCase.expected_output);
      
      const passed = normalizedOutput === normalizedExpected;
      console.log(`Test result: ${passed ? 'PASSED' : 'FAILED'}`, {
        output: normalizedOutput.substring(0, 100),
        expected: normalizedExpected.substring(0, 100)
      });
      
      results.push({
        testCase,
        output: result.output,
        expected: testCase.expected_output,
        passed,
        executionTime: result.executionTime,
        memoryUsed: result.memoryUsed,
        error: result.error
      });
    } catch (error) {
      console.error(`Error executing test case: ${testCase.id || 'unknown'}`, error);
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
