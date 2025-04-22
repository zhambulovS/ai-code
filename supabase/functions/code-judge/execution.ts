
import { ExecutionResult } from "./types.ts";

export async function executeCode(
  code: string,
  language: string,
  input: string,
  timeLimit: number,
  memoryLimit: number
): Promise<ExecutionResult> {
  // Simulate code execution
  const executionDelay = Math.random() * Math.min(timeLimit, 500) + 100;
  await new Promise(resolve => setTimeout(resolve, executionDelay));
  
  try {
    let output = "";
    let error = undefined;
    
    // Basic execution simulation
    if (language === "javascript") {
      try {
        const userFunction = new Function('input', `
          ${code}
          return typeof main === 'function' ? main(input) : input;
        `);
        
        output = userFunction(input);
      } catch (e) {
        error = e instanceof Error ? e.message : "Execution error";
        output = "Error: " + error;
      }
    } else {
      // Simulate other language executions
      output = `Simulated ${language} output for: ${input}`;
    }
    
    const memoryUsed = Math.floor(Math.random() * memoryLimit * 0.5);
    const executionTime = Math.floor(executionDelay);
    
    return {
      output,
      error,
      executionTime,
      memoryUsed
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Unknown error",
      executionTime: 1,
      memoryUsed: 0
    };
  }
}
