
import type { ExecutionResult } from '../interfaces/codeExecution';
import { parseInputForTwoSum } from '../parsers/inputParser';

export const simulateLocalExecution = async (
  code: string,
  language: string,
  input: string,
  timeLimit: number = 2000
): Promise<ExecutionResult> => {
  console.log(`Local execution simulator for ${language}`, { inputLength: input.length });
  
  const executionDelay = Math.min(Math.random() * 500 + 100, timeLimit * 0.8);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        let output = "";
        let success = true;
        let error = undefined;
        
        // Handle JavaScript/TypeScript execution
        if (language === "javascript" || language === "typescript") {
          try {
            // First attempt: Try to handle TwoSum problem specifically
            if (input.includes('[') && (input.includes(',') || input.includes(' '))) {
              try {
                // Try to parse input for two sum problem
                const { nums, target } = parseInputForTwoSum(input);
                
                // Create function from user's code
                // eslint-disable-next-line no-new-func
                const userFunction = new Function('nums', 'target', `
                  ${code}
                  // First try twoSum function
                  if (typeof twoSum !== 'undefined') {
                    return twoSum(nums, target);
                  }
                  // Try other common function names
                  if (typeof solution !== 'undefined') {
                    return solution(nums, target);
                  }
                  if (typeof findTwoNumbers !== 'undefined') {
                    return findTwoNumbers(nums, target);
                  }
                  return null;
                `);
                
                const result = userFunction(nums, target);
                if (result !== null) {
                  output = JSON.stringify(result);
                  success = true;
                } else {
                  // Try another approach if no specific function worked
                  output = evaluateJavaScriptWithConsoleCapture(code, input);
                  success = !!output;
                }
              } catch (parseError) {
                console.error("Input parsing error:", parseError);
                // Try generic execution as fallback
                output = evaluateJavaScriptWithConsoleCapture(code, input);
                success = !!output;
              }
            } else {
              // For non-array inputs, use direct execution with console capturing
              output = evaluateJavaScriptWithConsoleCapture(code, input);
              success = true;
            }
          } catch (e) {
            success = false;
            error = e instanceof Error ? e.message : "Code execution error";
            output = "Error: " + error;
            console.error("JavaScript execution error:", e);
          }
        } else if (language === "python") {
          // Simulate Python execution with more realistic output
          try {
            if (input.includes('[') && input.includes(']')) {
              // Handle array inputs for Python
              const match = input.match(/\[([^\]]+)\]/);
              if (match && match[1]) {
                // Check if the code looks like a TwoSum solution
                if (code.includes('def two_sum') || code.includes('def twoSum') || 
                    code.includes('class Solution') && code.includes('def twoSum')) {
                  output = "[0, 1]"; // Common TwoSum result
                } else {
                  // For other array processing
                  const items = match[1].split(',').map(s => s.trim());
                  // Generate a plausible output based on code content
                  if (code.includes('sort')) {
                    output = `[${items.sort((a, b) => Number(a) - Number(b)).join(', ')}]`;
                  } else if (code.includes('max') || code.includes('min')) {
                    output = Math.max(...items.map(Number)).toString();
                  } else {
                    output = `[${items[0]}, ${items[items.length-1]}]`;
                  }
                }
              } else {
                output = "[]";
              }
            } else {
              // For text-based input
              output = input.split('\n').map(line => `${line.trim()}`).join('\n');
            }
            success = true;
          } catch (e) {
            success = false;
            error = "Python syntax error";
            output = "Error: " + error;
          }
        } else {
          // For other languages, provide more realistic output
          success = Math.random() > 0.2; // 80% success rate for simulation
          if (!success) {
            error = `${language.toUpperCase()} compilation error: syntax error near line ${Math.floor(Math.random() * 20) + 1}`;
            output = "Error: " + error;
          } else {
            if (input.includes('[') && input.includes(']')) {
              // Array-like input
              output = `[${Array.from({length: 2}, () => Math.floor(Math.random() * 10))}]`;
            } else if (input.includes("sort") || input.includes("array")) {
              output = input.includes('[') ? 
                `[${Array.from({length: 5}, () => Math.floor(Math.random() * 100)).sort((a,b) => a-b).join(', ')}]` : 
                `Sorted: ${Math.floor(Math.random() * 10)} items`;
            } else {
              output = `Result: ${Math.floor(Math.random() * 1000)} (${language} execution)`;
            }
          }
        }
        
        resolve({
          output,
          success,
          executionTime: Math.floor(executionDelay),
          memoryUsed: Math.floor(Math.random() * 10000),
          error
        });
      } catch (e) {
        resolve({
          output: "Error during execution",
          success: false,
          executionTime: Math.floor(executionDelay),
          memoryUsed: 0,
          error: e instanceof Error ? e.message : "Unknown error occurred"
        });
      }
    }, executionDelay);
  });
};

// Helper function to capture console.log output from evaluated JS code
function evaluateJavaScriptWithConsoleCapture(code: string, input: string): string {
  let output = "";
  const originalConsoleLog = console.log;
  
  try {
    // Override console.log to capture output
    console.log = (...args) => {
      output += args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ') + '\n';
      originalConsoleLog(...args);
    };
    
    // Try to parse input if it's in JSON format
    let parsedInput = input;
    try {
      if ((input.trim().startsWith('[') && input.trim().endsWith(']')) || 
          (input.trim().startsWith('{') && input.trim().endsWith('}'))) {
        parsedInput = JSON.parse(input);
      }
    } catch {
      // If parsing fails, use original input
      parsedInput = input;
    }
    
    // Create a context with the input available
    const context = new Function('input', `
      ${code}
      // Try to call main function if it exists
      if (typeof main === 'function') {
        return main(input);
      }
      // Try to call solution if it exists
      if (typeof solution === 'function') {
        return solution(input);
      }
      // Try to call solve if it exists
      if (typeof solve === 'function') {
        return solve(input);
      }
      // Try twoSum with appropriate parameters
      if (typeof twoSum === 'function' && Array.isArray(input)) {
        // If input is an array with two elements [nums, target]
        if (input.length >= 2 && Array.isArray(input[0])) {
          return twoSum(input[0], input[1]);
        }
      }
      // Just return any console output
    `);
    
    const result = context(parsedInput);
    
    // If there was a returned value and no console output, use the return value
    if (result !== undefined && !output.trim()) {
      output = typeof result === 'object' ? JSON.stringify(result) : String(result);
    }
    
    // If still no output, indicate successful execution but no output
    if (!output.trim()) {
      output = "Code executed successfully, but produced no output.";
    }
    
    return output.trim();
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  } finally {
    // Restore original console.log
    console.log = originalConsoleLog;
  }
}
