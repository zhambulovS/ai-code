
import type { ExecutionResult } from '../interfaces/codeExecution';
import { parseInputForTwoSum } from '../parsers/inputParser';

export const simulateLocalExecution = async (
  code: string,
  language: string,
  input: string,
  timeLimit: number = 2000
): Promise<ExecutionResult> => {
  const executionDelay = Math.random() * 1000 + 500;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        let output = "";
        let success = true;
        let error = undefined;
        
        if (language === "javascript") {
          try {
            const { nums, target } = parseInputForTwoSum(input);
            
            // Create function from user's code
            // eslint-disable-next-line no-new-func
            const userFunction = new Function('nums', 'target', `
              ${code}
              return twoSum(nums, target);
            `);
            
            const result = userFunction(nums, target);
            output = JSON.stringify(result);
            success = true;
          } catch (e) {
            success = false;
            error = e instanceof Error ? e.message : "Code execution error";
            output = "Error";
            console.error("Code execution error:", e);
          }
        } else {
          success = Math.random() > 0.3;
          if (!success) {
            error = `Execution error in ${language}: Code failed to compile or execute`;
            output = "Error";
          } else {
            output = "Simulated output for: " + input;
          }
        }
        
        resolve({
          output,
          success,
          executionTime: Math.floor(Math.random() * 100) + 1,
          memoryUsed: Math.floor(Math.random() * 10000),
          error
        });
      } catch (e) {
        resolve({
          output: "Error",
          success: false,
          executionTime: 1,
          memoryUsed: 0,
          error: e instanceof Error ? e.message : "Unknown error occurred"
        });
      }
    }, executionDelay);
  });
};
