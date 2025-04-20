
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ExecutionResult = {
  status: string;
  output?: string;
  error?: string;
  executionTime?: number;
  memoryUsed?: number;
  testResults?: TestResult[];
};

type TestResult = {
  id: string;
  input: string;
  expected: string;
  output: string;
  passed: boolean;
  executionTime: number;
  memoryUsed: number;
  error?: string;
};

interface CodeSubmission {
  code: string;
  language: string;
  problemId?: number;
  userId?: string;
  input?: string;
  timeLimit: number;
  memoryLimit: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get submission data from request
    const submission: CodeSubmission = await req.json();
    const { code, language, problemId, userId, input, timeLimit, memoryLimit } = submission;

    // Validate basic input
    if (!code || !language) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing submission: language=${language}, problemId=${problemId || 'none'}`);

    // Handle single input execution (like when user clicks "Run")
    if (input !== undefined) {
      const result = await executeCode(code, language, input, timeLimit, memoryLimit);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For test cases execution
    if (!problemId) {
      return new Response(
        JSON.stringify({ error: "Problem ID is required for test cases" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get test cases from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: testCases, error: testCasesError } = await supabase
      .from("test_cases")
      .select("*")
      .eq("problem_id", problemId);

    if (testCasesError) {
      console.error("Error fetching test cases:", testCasesError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch test cases" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!testCases || testCases.length === 0) {
      return new Response(
        JSON.stringify({ error: "No test cases found for this problem" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Execute code on each test case
    const testResults: TestResult[] = [];
    let allPassed = true;
    let totalExecutionTime = 0;
    let maxMemoryUsed = 0;

    for (const testCase of testCases) {
      const result = await executeCode(code, language, testCase.input, timeLimit, memoryLimit);
      
      const normalizedOutput = normalizeOutput(result.output || "");
      const normalizedExpected = normalizeOutput(testCase.expected_output);
      const passed = normalizedOutput === normalizedExpected;
      
      if (!passed) allPassed = false;
      
      totalExecutionTime += result.executionTime || 0;
      maxMemoryUsed = Math.max(maxMemoryUsed, result.memoryUsed || 0);
      
      testResults.push({
        id: testCase.id,
        input: testCase.input,
        expected: testCase.expected_output,
        output: result.output || "",
        passed,
        executionTime: result.executionTime || 0,
        memoryUsed: result.memoryUsed || 0,
        error: result.error
      });
    }

    // Save submission result to database if userId is provided
    if (userId) {
      const status = allPassed ? "accepted" : "wrong_answer";
      
      try {
        const { error: submissionError } = await supabase
          .from("submissions")
          .insert({
            user_id: userId,
            problem_id: problemId,
            code,
            language,
            status,
            execution_time: totalExecutionTime,
            memory_used: maxMemoryUsed
          });
  
        if (submissionError) {
          console.error("Error saving submission:", submissionError);
        }
      } catch (saveError) {
        console.error("Error in save submission process:", saveError);
      }
    }

    // Return the results
    const response: ExecutionResult = {
      status: allPassed ? "accepted" : "wrong_answer",
      executionTime: totalExecutionTime,
      memoryUsed: maxMemoryUsed,
      testResults
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing submission:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper functions

// This function would be replaced with actual code execution in a sandbox
async function executeCode(
  code: string,
  language: string,
  input: string,
  timeLimit: number,
  memoryLimit: number
): Promise<{ output?: string; error?: string; executionTime: number; memoryUsed: number }> {
  // Simulate execution time
  const executionDelay = Math.random() * Math.min(timeLimit, 500) + 100;
  await new Promise(resolve => setTimeout(resolve, executionDelay));
  
  try {
    let output = "";
    let error = undefined;
    
    // Simple simulation for different languages
    if (language === "javascript") {
      try {
        // For JavaScript, attempt to parse input and simulate execution
        const inputLines = input.trim().split("\n");
        
        // Try to detect if this is a Two Sum problem
        if (input.includes("[") || inputLines.length >= 2) {
          try {
            // Parse array from first line if it looks like an array
            let nums: number[] = [];
            let numsLine = inputLines[0];
            
            if (numsLine.includes("[")) {
              // Extract content between square brackets
              const match = numsLine.match(/\[(.*)\]/);
              if (match && match[1]) {
                nums = match[1].split(",").map(n => parseInt(n.trim(), 10));
              }
            } else {
              // Try to parse as space or comma separated numbers
              nums = numsLine.split(/[,\s]+/).map(n => parseInt(n.trim(), 10));
            }
            
            // Parse target from second line
            const target = parseInt(inputLines[1].trim(), 10);
            
            // Prepare execution environment
            try {
              // eslint-disable-next-line no-new-func
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
          // Generic case if we can't determine the problem type
          output = "Simulated output for: " + input;
        }
      } catch (jsError) {
        error = jsError instanceof Error ? jsError.message : "JavaScript execution error";
        output = "Error: " + error;
      }
    } else if (language === "python") {
      // Simulate Python execution
      if (Math.random() < 0.1) {
        error = "IndentationError: unexpected indent";
        output = "Error: " + error;
      } else {
        output = simulateOutputForInput(input);
      }
    } else {
      // For other languages, just simulate
      output = simulateOutputForInput(input);
      
      // Simulate compile error for compiled languages
      if ((language === "cpp" || language === "java" || language === "csharp") && Math.random() < 0.1) {
        error = `Compilation error in ${language}: syntax error`;
        output = "Error: " + error;
      }
    }
    
    // Simulate memory used (in KB)
    const memoryUsed = Math.floor(Math.random() * memoryLimit * 0.5);
    
    // Simulate execution time (in ms)
    const executionTime = Math.floor(executionDelay);
    
    // Simulate timeout
    if (executionTime > timeLimit) {
      return {
        error: "Time limit exceeded",
        executionTime,
        memoryUsed
      };
    }
    
    // Simulate memory limit exceeded
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

function simulateOutputForInput(input: string): string {
  // Generate a plausible output based on input
  if (input.includes("[") && input.includes("]")) {
    // For array inputs, return array-like output
    const nums = input.match(/\d+/g) || [];
    if (nums.length >= 2) {
      return `[${nums[0]}, ${nums[nums.length - 1]}]`;
    }
    return "[]";
  }
  
  if (input.includes("\n")) {
    // For multi-line inputs, return the count of lines
    const lines = input.split("\n").filter(line => line.trim());
    return String(lines.length);
  }
  
  // Default case
  return input.length.toString();
}

function normalizeOutput(output: string): string {
  return output.trim().replace(/\s+/g, " ");
}
