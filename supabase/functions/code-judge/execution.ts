
import { ExecutionResult } from "./types.ts";

// Normalize output to handle different formats and whitespace
function normalizeOutput(output: string): string {
  return output.trim().replace(/\s+/g, " ");
}

// Helper function to simulate output based on input
function simulateOutputForInput(input: string): string {
  if (input.includes("[") && input.includes("]")) {
    const nums = input.match(/\d+/g) || [];
    if (nums.length >= 2) {
      return `[${nums[0]}, ${nums[nums.length - 1]}]`;
    }
    return "[]";
  }
  
  if (input.includes("\n")) {
    const lines = input.split("\n").filter(line => line.trim());
    return String(lines.length);
  }
  
  return input.length.toString();
}

// Core execution logic
export async function executeCode(
  code: string,
  language: string,
  input: string,
  timeLimit: number,
  memoryLimit: number
): Promise<{ output?: string; error?: string; executionTime: number; memoryUsed: number }> {
  const executionDelay = Math.random() * Math.min(timeLimit, 500) + 100;
  await new Promise(resolve => setTimeout(resolve, executionDelay));
  
  try {
    let output = "";
    let error = undefined;
    
    if (!input || typeof input !== 'string') {
      return {
        output: "Error: Invalid input",
        error: "Invalid input data",
        executionTime: 1,
        memoryUsed: 0
      };
    }
    
    if (language === "javascript") {
      try {
        const inputLines = input.trim().split("\n");
        
        if (input.includes("[") || inputLines.length >= 2) {
          try {
            let nums: number[] = [];
            let numsLine = inputLines[0];
            
            if (numsLine.includes("[")) {
              const match = numsLine.match(/\[(.*)\]/);
              if (match && match[1]) {
                nums = match[1].split(",").map(n => parseInt(n.trim(), 10));
              }
            } else {
              nums = numsLine.split(/[,\s]+/).map(n => parseInt(n.trim(), 10));
            }
            
            const target = parseInt(inputLines[1]?.trim() || "0", 10);
            
            try {
              const userFunction = new Function('nums', 'target', `
                ${code}
                return twoSum(nums, target);
              `);
              
              const result = userFunction(nums, target);
              output = JSON.stringify(result);
            } catch (execError) {
              error = execError instanceof Error ? execError.message : "Runtime error during execution";
              output = "Error: " + error;
            }
          } catch (parseError) {
            error = "Error parsing input: " + (parseError instanceof Error ? parseError.message : String(parseError));
            output = "Error: " + error;
          }
        } else {
          output = "Simulated output for: " + input;
        }
      } catch (jsError) {
        error = jsError instanceof Error ? jsError.message : "JavaScript execution error";
        output = "Error: " + error;
      }
    } else {
      output = simulateOutputForInput(input);
      
      if ((language === "cpp" || language === "java" || language === "csharp") && Math.random() < 0.1) {
        error = `Compilation error in ${language}: syntax error`;
        output = "Error: " + error;
      }
    }
    
    const memoryUsed = Math.floor(Math.random() * memoryLimit * 0.5);
    const executionTime = Math.floor(executionDelay);
    
    if (executionTime > timeLimit) {
      return {
        error: "Time limit exceeded",
        executionTime,
        memoryUsed
      };
    }
    
    if (memoryUsed > memoryLimit) {
      return {
        error: "Memory limit exceeded",
        executionTime,
        memoryUsed
      };
    }
    
    return {
      output,
      error,
      executionTime,
      memoryUsed
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Unknown execution error",
      executionTime: Math.floor(executionDelay),
      memoryUsed: Math.floor(Math.random() * 1000)
    };
  }
}
