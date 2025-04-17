
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
};

interface CodeSubmission {
  code: string;
  language: string;
  problemId: number;
  userId: string;
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
    const { code, language, problemId, userId, timeLimit, memoryLimit } = submission;

    // Validate input
    if (!code || !language || !problemId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing submission for problem ${problemId} in ${language}`);

    // Get test cases from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
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
      // In a real implementation, this would execute the code in a sandboxed environment
      // Here we're simulating execution for demonstration purposes
      const result = await executeCode(code, language, testCase.input, timeLimit, memoryLimit);
      
      const passed = normalizeOutput(result.output || "") === normalizeOutput(testCase.expected_output);
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
        memoryUsed: result.memoryUsed || 0
      });
    }

    // Save submission result to database
    const status = allPassed ? "accepted" : "wrong_answer";
    
    const { data: submissionData, error: submissionError } = await supabase
      .from("submissions")
      .insert({
        user_id: userId,
        problem_id: problemId,
        code,
        language,
        status,
        execution_time: totalExecutionTime,
        memory_used: maxMemoryUsed
      })
      .select()
      .single();

    if (submissionError) {
      console.error("Error saving submission:", submissionError);
      return new Response(
        JSON.stringify({ error: "Failed to save submission", details: submissionError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return the results
    const response: ExecutionResult = {
      status,
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
  const executionDelay = Math.random() * Math.min(timeLimit, 2000) + 100;
  await new Promise(resolve => setTimeout(resolve, executionDelay));
  
  try {
    let output = "";
    let error = undefined;
    
    // Simple simulation for different languages
    if (language === "javascript") {
      try {
        // For JavaScript, attempt to parse input and simulate execution
        const parseResult = parseInputBasedOnProblemType(input);
        
        // In a real implementation, this would use a proper sandbox
        // This is just a simulation
        if (code.includes("console.log") || code.includes("throw") || Math.random() < 0.1) {
          // Simulate runtime error
          if (Math.random() < 0.2) {
            throw new Error("Runtime error: " + ["Null pointer exception", "Stack overflow", "Out of memory"][Math.floor(Math.random() * 3)]);
          }
        }
        
        // Generate plausible output based on input
        output = simulateOutputForInput(input);
        
        // Randomly fail some test cases
        if (Math.random() < 0.3) {
          output = "Incorrect " + output;
        }
      } catch (e) {
        error = e.message;
        output = "Error";
      }
    } else if (language === "python") {
      // Simulate Python execution
      if (Math.random() < 0.2) {
        error = "IndentationError: unexpected indent";
        output = "Error";
      } else {
        output = simulateOutputForInput(input);
      }
    } else {
      // For other languages, just simulate
      output = simulateOutputForInput(input);
      
      // Simulate compile error for compiled languages
      if ((language === "cpp" || language === "java") && Math.random() < 0.2) {
        error = `Compilation error in ${language}: syntax error`;
        output = "Error";
      }
    }
    
    // Simulate memory used (in KB)
    const memoryUsed = Math.floor(Math.random() * memoryLimit * 0.8);
    
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
      error: e.message,
      executionTime: Math.floor(executionDelay),
      memoryUsed: Math.floor(Math.random() * 1000)
    };
  }
}

function parseInputBasedOnProblemType(input: string): any {
  // This would be more sophisticated in a real implementation
  // and would depend on the problem type
  try {
    const lines = input.trim().split("\n");
    
    if (input.includes("[") && input.includes("]")) {
      // Likely an array problem
      const arrayMatch = input.match(/\[(.*)\]/);
      if (arrayMatch) {
        return JSON.parse(arrayMatch[0]);
      }
    }
    
    return {
      rawInput: input,
      lines
    };
  } catch (error) {
    console.error("Error parsing input:", error);
    return { rawInput: input };
  }
}

function simulateOutputForInput(input: string): string {
  // Generate a plausible output based on input
  // This is just a simulation
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
