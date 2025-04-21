
import type { ExecutionResult } from '../interfaces/codeExecution';
import { parseInputForTwoSum } from '../parsers/inputParser';

export const simulateLocalExecution = async (
  code: string,
  language: string,
  input: string,
  timeLimit: number = 2000
): Promise<ExecutionResult> => {
  console.log(`Local execution simulator for ${language}`, { inputLength: input.length });
  
  const executionDelay = Math.min(Math.random() * 500 + 200, timeLimit * 0.8);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        let output = "";
        let success = true;
        let error = undefined;
        
        if (language === "javascript" || language === "typescript") {
          try {
            // Try to detect the problem type based on input format
            if (input.includes('[') && (input.includes(',') || input.includes(' '))) {
              try {
                const { nums, target } = parseInputForTwoSum(input);
                
                // Create function from user's code
                // eslint-disable-next-line no-new-func
                const userFunction = new Function('nums', 'target', `
                  ${code}
                  return typeof twoSum !== 'undefined' ? twoSum(nums, target) : null;
                `);
                
                const result = userFunction(nums, target);
                if (result !== null) {
                  output = JSON.stringify(result);
                  success = true;
                } else {
                  // Try another approach - maybe they used a different function name
                  const extractOutput = new Function('nums', 'target', `
                    ${code}
                    // Look for any function that returns an array
                    const functions = Object.getOwnPropertyNames(this)
                      .filter(prop => typeof this[prop] === 'function' && prop !== 'twoSum');
                    
                    for (const fn of functions) {
                      try {
                        const result = this[fn](nums, target);
                        if (Array.isArray(result)) return result;
                      } catch(e) {}
                    }
                    
                    return null;
                  `);
                  
                  const altResult = extractOutput(nums, target);
                  if (altResult !== null) {
                    output = JSON.stringify(altResult);
                    success = true;
                  } else {
                    output = "No valid solution function found";
                    success = false;
                    error = "Could not find a valid solution function";
                  }
                }
              } catch (parseError) {
                console.error("Input parsing error:", parseError);
                // Try generic execution as fallback
                output = evaluateJavaScriptWithConsoleCapture(code, input);
                success = !!output;
              }
            } else {
              // For non-array inputs, try direct execution with console capturing
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
          // Simulate Python execution
          success = Math.random() > 0.2;
          if (!success) {
            error = "Python syntax error";
            output = "Error: " + error;
          } else {
            // Make a somewhat realistic output
            if (input.includes('[') && input.includes(']')) {
              const match = input.match(/\[([^\]]+)\]/);
              if (match && match[1]) {
                const items = match[1].split(',').map(s => s.trim());
                output = `[${items[0]}, ${items[items.length-1]}]`;
              } else {
                output = "[]";
              }
            } else {
              output = input.split('\n').map(line => `Processed: ${line}`).join('\n');
            }
          }
        } else {
          // For other languages, provide realistic-looking output
          success = Math.random() > 0.3;
          if (!success) {
            error = `${language.toUpperCase()} compilation error: syntax error near line ${Math.floor(Math.random() * 20) + 1}`;
            output = "Error: " + error;
          } else {
            if (input.includes("sort") || input.includes("array")) {
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
      // Just return any console output
    `);
    
    const result = context(input);
    
    // If there was a returned value and no console output, use the return value
    if (result !== undefined && !output) {
      output = typeof result === 'object' ? JSON.stringify(result) : String(result);
    }
    
    // If still no output, indicate successful execution but no output
    if (!output) {
      output = "Code executed successfully, but produced no output.";
    }
    
    return output;
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  } finally {
    // Restore original console.log
    console.log = originalConsoleLog;
  }
}
